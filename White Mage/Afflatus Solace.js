try {
    const hasEffectAppliedPrayer = await game.dfreds.effectInterface.hasEffectApplied('Prayer', actor.uuid);
    const hasEffectAppliedAfflatus = await game.dfreds.effectInterface.hasEffectApplied('Afflatus Solace', actor.uuid);

    if (hasEffectAppliedPrayer || hasEffectAppliedAfflatus) {
        throw new Error('Cant heal if Prayer or Afflatus Solace was used');
    }

    const confession = actor.items.find(i => i.name === 'Confession');
    if (!confession) {
        throw new Error('You dont have a Confession Feature');
    }

    const uses = confession.system.uses.value;
    if (!uses) {
        // No charges on confession to use.
        throw new Error('No charges on Confession to use');
    }

    const handleButtonCallback = async (charges) => {
        const target = game.user.targets.first();
        if (!target) {
            throw new Error('You need to select a target to complete the action');
        }

        const targetActor = target.actor;
        if (targetActor.system.attributes.hp.value === 0) {
            // cant heal 0 hp
            throw new Error('You cant heal if the target has hp equal 0 (zero)');
        }

        const roll = await new Roll(`${charges}d4 + ${actor.system.attributes.prof}`).evaluate({ async: true });
        confession.update({ 'system.uses.value': uses - charges });
        await roll.toMessage({ flavor: `Afflatus Solace - Healing`, speaker: actor.uuid });
        targetActor.update({ 'system.attributes.hp.value': Math.min(roll.total + targetActor.system.attributes.hp.value, targetActor.system.attributes.hp.max) });
        game.dfreds.effectInterface.addEffect({ effectName: 'Afflatus Solace', uuid: actor.uuid });
    };

    let buttons = new Array(uses).fill({
        label: 0,
        callback: () => { }
    });

    let buttonsObject = {};
    buttons = buttons.forEach((b, index) => {
        buttonsObject = {
            ...buttonsObject, [`button${index}`]: {
                label: index + 1,
                callback: () => handleButtonCallback(index + 1)
            }
        };
    });

    let confessionChargeDialog = new Dialog({
        title: "Afflatus Solace",
        content: `<p>Selecione quantas cargas você quer usar</p>`,
        buttons: buttonsObject
    });

    confessionChargeDialog.render(true);

} catch (err) {
    let errorDialog = new Dialog({
        title: "Afflatus Solace",
        content: `<h2>Afflatus Solace Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
        buttons: {
            button1: {
                label: 'Ok',
                callback: () => { },
            }
        }
    });

    errorDialog.render(true);
    game.macros.getName("ClearLastMessage").execute();
}