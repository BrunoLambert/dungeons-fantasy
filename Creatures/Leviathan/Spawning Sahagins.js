// Macro to Spawn the Sahagins somewhere in these 8 pre defined points
const spawnPositions = [
    { x: 775, y: 125 },
    { x: 725, y: 1275 },
    { x: 725, y: 925 },
    { x: 1275, y: 775 },
    { x: 1175, y: 1525 },
    { x: 1025, y: 1875 },
    { x: 1275, y: 425 },
    { x: 1175, y: 125 }
]
const spawnedPositions = [];

const sahaginsCreatures = [
    "Shelfscale Sahagin",
    "Surfspine Sahagin",
    "Trenchtooth Sahagin"
]

const amountRoll = await new Roll(`1d4 - 1`).roll();

const spawnSahagin = async () => {
    let positionRoll = null;
    do {
        positionRoll = await new Roll(`1d8`).roll();
    } while (spawnedPositions.includes(positionRoll.total));

    spawnedPositions.push(positionRoll.total);

    const creatureSpawnRoll = await new Roll(`1d12`).roll();

    let creatureSpawnArrayPosition = Math.ceil((creatureSpawnRoll.total - 1) / 3) - 1;
    if (creatureSpawnArrayPosition > 2) creatureSpawnArrayPosition = 2;
    if (creatureSpawnArrayPosition < 0) creatureSpawnArrayPosition = 0;

    const [spawnedCreature] = await warpgate.spawnAt(spawnPositions[positionRoll.total - 1], sahaginsCreatures[creatureSpawnArrayPosition], { token: { alpha: 0 } });

    const animation = new Sequence()
        .wait(200)
        .effect()
        .file("jb2a.liquid.splash.blue")
        .atLocation(spawnedCreature)
        .wait(900)
        .animation()
        .on(spawnedCreature)
        .opacity(1.0)

    AudioHelper.play({ src: "worlds/fantasy-dungeons/sounds/Water/water-splash.mp3", volume: 1, autoplay: true, loop: false }, true);
    await animation.play();

    let token = canvas.tokens.placeables.find(t => t.id === spawnedCreature);
    token.control({ releaseOthers: false });
}

for (let i = 0; i < amountRoll.total; i++) {
    await spawnSahagin();
    warpgate.wait(500);
}

if (!amountRoll.total) return;

const leviathanActor = game.actors.find(actor => actor.id === 'D8HG306PEYqo3SfF');
ChatMessage.create({
    user: null,
    speaker: ChatMessage.getSpeaker({ actor: leviathanActor }),
    content: `<p><i>Minhas ordens foram ouvidas!</i></p><p><b>${amountRoll.total} guerreiro(s) Sahagin(s) entraram no combate.</b></p>`
});

await canvas.tokens.toggleCombat();
game.combat.rollNPC();