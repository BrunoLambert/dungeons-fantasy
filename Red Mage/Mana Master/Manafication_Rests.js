try {
    const blackMana = actor.items.find(i => i.name === 'Black Mana');
    const whiteMana = actor.items.find(i => i.name === 'White Mana');

    if (!blackMana || !whiteMana) {
        throw new Error('You dont have Black and White Mana');
    }

    // On Short Rest
    blackMana.update({ "system.uses.value": Math.ceil(blackMana.system.uses.value / 2) });
    whiteMana.update({ "system.uses.value": Math.ceil(whiteMana.system.uses.value / 2) });

    // On Long Rest
    blackMana.update({ "system.uses.value": 0 });
    whiteMana.update({ "system.uses.value": 0 });
} catch (err) {
    let errorDialog = new Dialog({
        title: "Manafication",
        content: `<h2>Manafication Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
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