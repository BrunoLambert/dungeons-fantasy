actor.sheet.close();

// Ifrit
const [spawnedCreature1] = await warpgate.spawn("Ifrit Egi", { token: { alpha: 0 } });

await new Sequence()
    .wait(200)
    .effect()
    .file("jb2a.cast_generic.fire.01.orange")
    .atLocation(spawnedCreature)
    .wait(500)
    .animation()
    .on(spawnedCreature)
    .opacity(1.0)
    .play()

// Garuda
const [spawnedCreature2] = await warpgate.spawn("Garuda Egi", { token: { alpha: 0 } });

await new Sequence()
    .wait(200)
    .effect()
    .file("jb2a.cast_generic.01.yellow")
    .atLocation(spawnedCreature)
    .wait(500)
    .animation()
    .on(spawnedCreature)
    .opacity(1.0)
    .play()

// Titan
const [spawnedCreature3] = await warpgate.spawn("Titan Egi", { token: { alpha: 0 } });

new Sequence()
    .wait(200)
    .effect()
    .file("jb2a.cast_generic.earth.01.browngreen")
    .atLocation(spawnedCreature)
    .wait(500)
    .animation()
    .on(spawnedCreature)
    .opacity(1.0)
    .play()

// Open character sheet again
Hotbar.toggleDocumentSheet(actor.uuid)

// Effect Toggle Off
game.canvas.tokens.ownedTokens.find((token) => token.name === 'Garuda Egi').document.delete();