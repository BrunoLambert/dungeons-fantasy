actor.sheet.close();

const [spawnedCreature] = await warpgate.spawn("Eos", { token: { alpha: 0 }});

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