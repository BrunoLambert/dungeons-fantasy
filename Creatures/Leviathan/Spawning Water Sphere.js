actor.sheet.close();

const spawnPositions = [
    { x: 1025, y: 275 },
    { x: 1025, y: 625 },
    { x: 1025, y: 1375 },
    { x: 1025, y: 1875 },
]
const spawnedPositions = [];

const spawnSphere = async () => {
    let positionRoll = null;
    do {
        positionRoll = await new Roll(`1d4`).roll();
    } while (spawnedPositions.includes(positionRoll.total));

    spawnedPositions.push(positionRoll.total);

    const [spawnedCreature] = await warpgate.spawnAt(spawnPositions[positionRoll.total - 1], "Leviathan's Sphere", { token: { alpha: 0 } });

    const animation = new Sequence()
        .wait(200)
        .effect()
        .file("jb2a.liquid.blob.blue")
        .atLocation(spawnedCreature)
        .duration(2000)
        .scale(0.5)
        .animation()
        .on(spawnedCreature)
        .opacity(1.0)

    await animation.play();
}

const amountRoll = await new Roll(`1d2`).roll();

for (let i = 0; i < amountRoll.total; i++) {
    await spawnSphere();
    warpgate.wait(100);
}

const leviathanActor = game.actors.find(actor => actor.id === 'D8HG306PEYqo3SfF');
ChatMessage.create({
    user: null,
    speaker: ChatMessage.getSpeaker({ actor: leviathanActor }),
    content: `<p><b>${amountRoll.total} water orb(s) appeared.</b></p>`
});

