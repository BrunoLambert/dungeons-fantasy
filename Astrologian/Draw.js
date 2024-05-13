const roll = await new Roll(`1d6`).roll();

const effects = ['The Balance', 'The Bole', 'The Arrow', 'The Spear', 'The Ewer', 'The Spire'];
const descriptions = [
    'Bonus 1d6 damage on all damage rolls. This bonus damage applies once per action, attack damage roll, bonus action and reaction. This increases to 2d6 at the 5th level, 3d6 at the 11th level and 4d6 at the 17th level.',
    'All damage you take is reduced by 1d6 . This increases to 2d6 at the 5th level, 3d6 at the 11th level and 4d6 at the 17th level.',
    'You gain one extra attack when you take the attack action.',
    'Your attack rolls crit on a 19 or 20 die result.',
    'Temporarily provides one level 1 or 2 spell slot. May be used for level 3 spell slots beginning at the 11th level and level 4 spell slots at the 17th level.',
    'Temporarily provides 1, non-spell slot resource to an ally. This increases to 2 resources at the 5th level, 3 resources at the 11th level and 4 resources at the 17th level.',
];
const cardImages = [
    'worlds/fantasy-dungeons/images/draw/the_balance.webp',
    'worlds/fantasy-dungeons/images/draw/the_bole.webp',
    'worlds/fantasy-dungeons/images/draw/the_arrow.webp',
    'worlds/fantasy-dungeons/images/draw/the_spear.webp',
    'worlds/fantasy-dungeons/images/draw/the_ewer.webp',
    'worlds/fantasy-dungeons/images/draw/the_spire.webp'
];

const rolledEffectCardImage = cardImages[roll.result - 1];
const rolledEffect = 'Draw: ' + effects[roll.result - 1];

const continueCallback = async () => {
    const target = game.user.targets.first();

    if (!target) {
        return targetDialog.render(true);
    }

    const uuid = target.actor.uuid;
    const spellcasting = item.actor.system.attributes.spellcasting;
    const mod = item.actor.system.abilities[spellcasting].mod || 1;

    effects.forEach((effect, index) => {
        if (index !== roll.result - 1) {
            game.dfreds.effectInterface.removeEffect({ effectName: `Draw: ${effect}`, uuid });
        }
    })

    const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied(rolledEffect, uuid);

    if (!hasEffectApplied) {
        const effectData = game.dfreds.effectInterface.findEffectByName(rolledEffect).data.toObject();
        effectData.duration.seconds = mod * 6;
        game.dfreds.effectInterface.addEffectWith({ effectData, uuid });
    }
};

let targetDialog = new Dialog({
    title: "Draw Feature",
    content: `<h2>NO TARGET SELECTED</h2>
        <p>The card drawn was ${roll.result}: ${effects[roll.result - 1]}.</p><p><b>${descriptions[roll.result - 1]}</b></p>
        <p>Select your target to continue...</p>`,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Now it is selected",
            callback: continueCallback
        },
    },
    default: "one",
    render: html => console.log("Register interactivity in the rendered dialog"),
    close: html => console.log("This always is logged no matter which option is chosen")
});

let cardDialog = new Dialog({
    title: "Draw Feature",
    content: `
     <div style="text-align: center;">
         <img src="${rolledEffectCardImage}" alt="${effects[roll.result - 1]}" height="400px" width="auto">
     </div>
     <p>The card drawn was ${roll.result}: ${effects[roll.result - 1]}.</p><p><b>${descriptions[roll.result - 1]}</b></p>
     <p>Select your target to continue...</p>`,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "Continue",
            callback: continueCallback
        },
    },
    default: "two",
    render: html => console.log("Register interactivity in the rendered dialog"),
    close: html => console.log("This always is logged no matter which option is chosen")
}, {
    width: 400,
});

cardDialog.render(true);
ChatMessage.create({
    user: null,
    speaker: ChatMessage.getSpeaker({ actor: speaker }),
    content: `
        <div style="text-align: center;">
            <p>${actor.name} just drew <b>${effects[roll.result - 1]}!</b></p>
            <img src="${rolledEffectCardImage}" alt="${effects[roll.result - 1]}" height="300px" width="auto"> 
        </div>
    `
});