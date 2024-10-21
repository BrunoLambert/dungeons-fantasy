const [spawnedNoulith] = await warpgate.spawn("Noulith", { token: { alpha: 0, elevation: 1 } });

const spawning = new Sequence()
  .wait(200)
  .effect()
  .file("jb2a.swirling_sparkles.01.blue")
  .atLocation(spawnedNoulith)
  .wait(900)
  .animation()
  .on(spawnedNoulith)
  .opacity(1.0)

await spawning.play();