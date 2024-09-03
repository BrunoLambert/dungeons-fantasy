const characters = game.actors.filter(actor => actor.type === "character");
const tataruActor = game.actors.find(actor => actor.id === 'ylVFkMeFBZIxoLTt');

const continueCallback = (stage) => {
    const higherCharge = Math.max(...characters.map(char => (char.system.resources.tertiary.value || 0)));
    const newCharge = Math.max(higherCharge - (stage * 3), 0);

    characters.forEach(character => {
        if (character.system.resources.tertiary.label !== 'Limit Break') return;

        character.update({ 'system.resources.tertiary.value': newCharge });
    });

    ChatMessage.create({
        user: null,
        speaker: ChatMessage.getSpeaker({ actor: tataruActor }),
        content: `<p>Limit Break Stage ${stage} was used.</p><p><b>Now the party has ${newCharge} Limit Break points.</b></p>`
    });
}

let selectLBStage = new Dialog({
    title: "Limit Break",
    content: `<p>Choose the stage:</p>`,
    buttons: {
        one: {
            icon: '<i class="fas fa-check"></i>',
            label: "LB 1",
            callback: () => continueCallback(1)
        },
        two: {
            icon: '<i class="fas fa-check"></i>',
            label: "LB 2",
            callback: () => continueCallback(2)
        },
        three: {
            icon: '<i class="fas fa-check"></i>',
            label: "LB 3",
            callback: () => continueCallback(3)
        },
    },
    default: "one",
});

selectLBStage.render(true);