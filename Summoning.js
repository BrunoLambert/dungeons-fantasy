actor.sheet.close();

const [spawnedCreature] = await warpgate.spawn("Eos", { token: { alpha: 0 } });

new Sequence()
  .wait(200)
  .effect()
  .file("jb2a.screen_overlay.01.bad_omen")
  .atLocation(spawnedCreature)
  .wait(900)
  .animation()
  .on(spawnedCreature)
  .opacity(1.0)
  .play()


// v2
actor.sheet.close();
const prev = await game.canvas.tokens.ownedTokens.find((token) => token.name === 'Spiritual Weapon')
if (prev) {
  await prev.document.delete();
}

const [spawnedCreature2] = await warpgate.spawn("Spiritual Weapon", { token: { alpha: 0 } });

const spawning = new Sequence()
  .wait(200)
  .effect()
  .file("jb2a.screen_overlay.01.bad_omen")
  .atLocation(spawnedCreature2)
  .wait(900)
  .animation()
  .on(spawnedCreature2)
  .opacity(1.0)

await spawning.play();

Hotbar.toggleDocumentSheet(actor.uuid)