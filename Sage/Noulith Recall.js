const ownedTokens = game.canvas.tokens.ownedTokens;
const characterToken = ownedTokens.find(ownedToken => (
  ownedToken.actor.type === "character" && ownedToken.actor.uuid === game.user.character.uuid
));

const targets = game.user.targets;
if (targets.first().name === "Kerachole") {
  const keracholeTarget = targets.first();
  const recallItem = keracholeTarget.actor.items.find(item => item.name === "Recall");
  recallItem.use();
} else {
  const nouliths = targets.toObject().filter((target) => (target.name === "Noulith"))
  nouliths.forEach(async (target) => {
    const noulithHp = target.actor.system.attributes.hp.value;
    tokenAttacher.detachAllElementsFromToken(target)

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

    let token = canvas.tokens.placeables.find(t => t.id === spawnedCreature);
    token.actor.update({ "system.attributes.hp.value": noulithHp })

    target.document.delete();
  })
}