try {
    const blackMana = actor.items.find(i => i.name === 'Black Mana');
    const whiteMana = actor.items.find(i => i.name === 'White Mana');

    if (!blackMana || !whiteMana) {
        throw new Error('You dont have Black and White Mana');
    }

    const spendMana = (type = 'white') => {
        if (type === 'white') {
            whiteMana.update({ "system.uses.value": Math.max((whiteMana.system.uses.value - 1), 0) });
        } else {
            blackMana.update({ "system.uses.value": Math.max((blackMana.system.uses.value - 1), 0) });
        }
    }

    const buttons = {}
    if (whiteMana.system.uses.value > 0) {
        buttons.whiteMana = {
            label: 'White Mana',
            callback: () => { spendMana('white') }
        }
    }
    if (blackMana.system.uses.value > 0) {
        buttons.blackMana = {
            label: 'Black Mana',
            callback: () => { spendMana('black') }
        }
    }

    if (!buttons.whiteMana && !buttons.blackMana) {
        throw new Error('You dont have Black or White Mana to use this feature.');
    }

    let choiseDialog = new Dialog({
        title: item.name,
        content: `
                <p>Choose which Mana you wanna use:</p><br/>`,
        buttons,
    });

    choiseDialog.render(true);
} catch (err) {
    let errorDialog = new Dialog({
        title: item.name,
        content: `<h2>${item.name} Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
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