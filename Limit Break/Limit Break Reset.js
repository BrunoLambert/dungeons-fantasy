const characters = game.actors.filter(actor => actor.type === "character");

characters.forEach(character => {
    if (character.system.resources.tertiary.label !== 'Limit Break') return;

    character.update({ 'system.resources.tertiary.value': 0 });
});

const borunActor = game.actors.find(actor => actor.id === 'qTobemlO2cxXi1HE');

ChatMessage.create({
    user: null,
    speaker: ChatMessage.getSpeaker({ actor: borunActor }),
    content: `<p>All Limit Break Points were lost.</p>`
});