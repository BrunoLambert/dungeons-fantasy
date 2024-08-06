try {
    const cartridge = actor.items.find(i => i.name === 'Cartridges');
    if (!cartridge) {
        throw new Error('You dont have Cartridge Feature');
    }

    const gunblade = actor.items.find(i => i.name === 'Gunblade');
    if (!gunblade) {
        throw new Error('You dont have a Gunblade weapon');
    }

    const cartridgeUses = cartridge.system.uses.value;
    if (!cartridgeUses) {
        throw new Error('No charges of Cartridge to use');
    }

    const gunbladeUses = gunblade.system.uses.value;
    const gunbladeMaxUses = gunblade.system.uses.max;
    const maxChargesToReloadOnGunblade = gunbladeMaxUses - gunbladeUses;
    if (!maxChargesToReloadOnGunblade) {
        throw new Error('Your Gunblade is full');
    }

    const rechargeCallback = (charges = 0) => {
        gunblade.update({ "system.uses.value": gunbladeUses + charges });
        cartridge.update({ "system.uses.value": cartridgeUses - charges });
    }

    let buttons = {}
    for (let index = 0; index < Math.min(maxChargesToReloadOnGunblade, cartridgeUses); index++) {
        buttons[`charge${index + 1}`] = {
            label: `${index + 1} charges`,
            callback: () => { rechargeCallback(index + 1) }
        }
    }

    let reloadDialog = new Dialog({
        title: "Cartridge Reload",
        content: `
            <p>You have ${cartridgeUses} charges you may use to reload</p>
            <p>Your Gunblade can be loaded up up to ${maxChargesToReloadOnGunblade} charges.</p>
            <b>
                <p>Choose how may charges you want to reload:</p>
            </b>`,
        buttons,
    });

    reloadDialog.render(true);
} catch (err) {
    let errorDialog = new Dialog({
        title: "Cartridge Reload",
        content: `<h2>Cartridge Reload Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
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