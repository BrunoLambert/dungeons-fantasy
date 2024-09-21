try {
    const target = game.user.targets.first();
    if (!target) {
        throw new Error('You need to select a target first');
    }

    const hasAuroraEffect = await game.dfreds.effectInterface.hasEffectApplied('Aurora', actor.uuid);
    const targetHasAuroraEffect = await game.dfreds.effectInterface.hasEffectApplied('Aurora', target.actor.uuid);
    const targetIsSelf = target.actor.uuid === actor.uuid

    if (!targetIsSelf && hasAuroraEffect && !targetHasAuroraEffect) {
        let AURORA_DETAILS = actor.getFlag('world', 'Gunbreak:Aurora')
        AURORA_DETAILS.duration = 2
        AURORA_DETAILS.item = item.name

        await target.actor.setFlag('world', AURORA_DETAILS.flag, AURORA_DETAILS);

        const effectData = game.dfreds.effectInterface.findEffectByName('Aurora').data.toObject();
        effectData.description = effectData.description.replace('%hp', AURORA_DETAILS.healing)
        effectData.description = effectData.description.replace('%r', AURORA_DETAILS.duration)
        game.dfreds.effectInterface.addEffectWith({ effectData, uuid: target.actor.uuid });
    }
} catch (err) {
    let errorDialog = new Dialog({
        title: "Heart of Stone",
        content: `<h2>Heart of Stone Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
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