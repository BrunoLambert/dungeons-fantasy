const ownedTokens = game.canvas.tokens.ownedTokens;
const characterToken = ownedTokens.find(ownedToken => (
  ownedToken.actor.type === "character" && ownedToken.actor.uuid === game.user.character.uuid
));

const targets = game.user.targets;
targets.filter((target) => (target.name === "Noulith")).forEach(async (target) => {
  target.document.delete();

  const [spawnedCreature] = await warpgate.spawnAt(characterToken.center, "Noulith", { token: { alpha: 0, elevation: 1 } });

  const spawning = new Sequence()
    .wait(200)
    .effect()
    .file("jb2a.swirling_sparkles.01.blue")
    .atLocation(spawnedCreature)
    .wait(200)
    .animation()
    .on(spawnedCreature)
    .opacity(1.0)

  await spawning.play();

  // Check for Zoe Nouliths
  const zoeNoulithTokens = game.canvas.tokens.ownedTokens.filter((token) => (token.name === 'Noulith') && !!token.actor.getFlag('world', 'Zoe'));
  if (zoeNoulithTokens < 1) {
    game.dfreds.effectInterface.removeEffect({ effectName: "Zoe", uuid: game.user.character.uuid });
  }
})