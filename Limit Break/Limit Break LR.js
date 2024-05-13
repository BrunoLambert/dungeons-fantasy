const characters = game.actors.filter(actor => actor.type === "character");
const borunActor = game.actors.find(actor => actor.id === 'qTobemlO2cxXi1HE');

const higherCharge = Math.max(...characters.map(char => (char.system.resources.tertiary.value || 0)));
const newCharge = Math.floor(higherCharge / 2);

characters.forEach(character => {
    if (character.system.resources.tertiary.label !== 'Limit Break') return;

    character.update({ 'system.resources.tertiary.value': newCharge });
});

ChatMessage.create({
    user: null,
    speaker: ChatMessage.getSpeaker({ actor: borunActor }),
    content: `<p>In a Long Rest, the party Limit Break points are cut in half (rounded down).</p><p><b>Now the party has ${newCharge} Limit Break points.</b></p>`
});
