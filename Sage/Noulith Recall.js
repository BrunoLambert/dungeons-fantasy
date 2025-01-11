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
    const portal = new Portal().setLocation(characterToken.center).size(10);
    portal.addCreature("Noulith", {
      count: 1, updateData: {
        token: { opacity: 0, alpha: 0 },
        actor: {
          system: {
            attributes: {
              hp: {
                value: target.actor.system.attributes.hp.value,
              }
            }
          }
        }
      },
    });
    const [summon] = await portal.spawn();

    await new Sequence()
      .effect()
      .file("jb2a.swirling_sparkles.01.blue")
      .atLocation(target)
      .scaleToObject()
      .belowTokens()
      .animation()
      .on(target)
      .opacity(0)
      .duration(1000)
      .waitUntilFinished()
      .effect()
      .file("jb2a.swirling_sparkles.01.blue")
      .atLocation(summon)
      .scaleToObject()
      .belowTokens()
      .thenDo(async () => {
        await summon.update({ elevation: 1 })
      })
      .animation()
      .on(summon)
      .opacity(1)
      .duration(1000)
      .waitUntilFinished()
      .play();

    target.document.delete();
  })
}