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
    tokenAttacher.detachAllElementsFromToken(target)

    await new Sequence()
      .effect()
      .file("jb2a.swirling_sparkles.01.blue")
      .atLocation(target)
      .scaleToObject()
      .elevation(1)
      .wait(500)
      .animation()
      .on(target)
      .moveTowards(characterToken.center, { ease: "linear", delay: 0, relativeToCenter: true })
      .moveSpeed(2000)
      .snapToGrid()
      .wait(100)
      .effect()
      .file("jb2a.swirling_sparkles.01.blue")
      .atLocation(target)
      .scaleToObject()
      .play();
  })
}