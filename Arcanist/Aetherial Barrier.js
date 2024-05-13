try {
    const taticsFeature = game.user.character.items.find(i => i.name === 'Tatics Feature');
    if (!taticsFeature) {
        throw new Error('You dont have a Tatics Feature');
    }

    const uses = taticsFeature.system.uses.value;
    if (!uses) {
        throw new Error('No charges on Tactics to use');
    }

    const target = game.user.targets.first();
    if (!target) {
        throw new Error('You need to select a target to complete the action');
    }
    const targetUuid = target.actor.uuid;

    const checkAndApplyEffect = async (effect) => {
        const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied(effect, targetUuid);

        if (!hasEffectApplied) {
            const effectData = game.dfreds.effectInterface.findEffectByName(effect).data.toObject();
            game.dfreds.effectInterface.addEffectWith({ effectData, uuid: targetUuid });
        }
    }

    taticsFeature.update({ 'system.uses.value': uses - 1 });
    await checkAndApplyEffect('Aetherial Barrier');

} catch (err) {
    let errorDialog = new Dialog({
        title: "Aetherial Barrier",
        content: `<h2>Aetherial Barrier Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
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