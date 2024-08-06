try {
    const gunblade = actor.items.find(i => i.name === 'Gunblade');
    if (!gunblade) {
        throw new Error('You dont have a Gunblade weapon');
    }
    const gunbladeUses = gunblade.system.uses.value;
    if (!gunbladeUses) {
        throw new Error('You dont have a Cartridges Charges on your Gunblade');
    }
    const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Aurora', actor.uuid);
    if (hasEffectApplied) {
        throw new Error('You already have an active Aurora effect');
    }
    
    const conMod = actor.system.abilities.con.mod;
    const AURORA_DETAILS = {
        healing: `1d8 + ${gunbladeUses} + ${conMod}`,
        duration: actor.system.attributes.prof,
        flag: 'Gunbreak:Aurora',
        item: item.name
    }

    await actor.setFlag('world', AURORA_DETAILS.flag, AURORA_DETAILS);

    const effectData = game.dfreds.effectInterface.findEffectByName('Aurora').data.toObject();
    effectData.description = effectData.description.replace('%hp', AURORA_DETAILS.healing)
    effectData.description = effectData.description.replace('%r', AURORA_DETAILS.duration)
    game.dfreds.effectInterface.addEffectWith({ effectData, uuid: actor.uuid });

    gunblade.update({ "system.uses.value": 0 });
} catch (err) {
    let errorDialog = new Dialog({
        title: "Aurora II",
        content: `<h2>Aurora II Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
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