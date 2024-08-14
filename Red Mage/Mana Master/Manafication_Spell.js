// Add for everysingle spell from the RedMage Spell list.
try {
    const BLACK_MANA_SCHOOLS = ['evo', 'nec', 'ill'];
    const WHITE_MANA_SCHOOLS = ['div', 'abj', 'con'];
    const NEUTRAL_MANA_SCHOOLS = ['trs', 'enc'];

    // item.system.school
    // args[0].castData.baseLevel
    // args[0].castData.castLevel

    const blackMana = actor.items.find(i => i.name === 'Black Mana');
    const whiteMana = actor.items.find(i => i.name === 'White Mana');
    const castLevel = args[0].castData.castLevel;

    if (item.level < 1) {
        return;
    }

    if (!blackMana) {
        throw new Error('You dont have Black Mana Feature');
    }

    if (!whiteMana) {
        throw new Error('You dont have White Mana Feature');
    }

    if (BLACK_MANA_SCHOOLS.includes(item.system.school)) {

        blackMana.update({ "system.uses.value": Math.min(blackMana.system.uses.value + castLevel, blackMana.system.uses.max) });

    } else if (WHITE_MANA_SCHOOLS.includes(item.system.school)) {

        whiteMana.update({ "system.uses.value": Math.min(whiteMana.system.uses.value + castLevel, whiteMana.system.uses.max) });

    } else if (NEUTRAL_MANA_SCHOOLS.includes(item.system.school)) {

        blackMana.update({ "system.uses.value": Math.min(blackMana.system.uses.value + 1, blackMana.system.uses.max) });
        whiteMana.update({ "system.uses.value": Math.min(whiteMana.system.uses.value + 1, whiteMana.system.uses.max) });

    }
} catch (error) {
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