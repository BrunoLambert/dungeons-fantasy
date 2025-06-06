const onUseItem = async () => {
  const intMod = item.actor.system.abilities.int.mod;
  const targets = game.user.targets;
  if (!targets && targets.size < 1 && !targets.some(target => target.name !== "Noulith")) {
    throw new Error("You need valid targets.");
  }

  const zoeNoulithTokens = game.canvas.tokens.ownedTokens.filter((token) => (token.name === 'Noulith') && !!token.actor.getFlag('world', 'Zoe'));
  zoeNoulithTokens.forEach(async (zoeNoulith) => {
    await game.dfreds.effectInterface.removeEffect({ effectName: "Zoe", uuid: zoeNoulith.actor.uuid });
  })

  const effectData = game.dfreds.effectInterface.findEffect({ effectName: 'Zoe' }).toObject();
  effectData.description = effectData.description.replace("%m", `+${intMod}`);
  const maxNoulithsToSend = Math.max(Math.min(intMod, 4), 1);

  const gridOffset = game.canvas.grid.w * 0.4;
  const noulithToGoPositions = [
    { x: token.x, y: token.y },
    { x: token.x + gridOffset, y: token.y },
    { x: token.x, y: token.y + gridOffset },
    { x: token.x + gridOffset, y: token.y + gridOffset }
  ]

  targets.filter((target) => (target.name === "Noulith")).toObject().slice(0, maxNoulithsToSend).forEach(async (target, targetIndex) => {
    game.dfreds.effectInterface.addEffect({ effectData, uuid: target.actor.uuid });
    target.actor.setFlag('world', 'Zoe', true);
    const movingToken = new Sequence()
      .animation()
      .on(target)
      .moveTowards(noulithToGoPositions[targetIndex])
      .moveSpeed(500)

    await movingToken.play();
  })

  effectData.description = `Zoe Technique is amplifying the healing by ${intMod * targets.size}`
  game.dfreds.effectInterface.addEffect({ effectData, uuid: actor.uuid });
  setTimeout(() => {
    tokenAttacher.attachElementsToToken(targets, token)
  }, 2000);
}

const onHealing = () => {
  const rollData = args[0];

  const zoeNoulithTokens = game.canvas.tokens.ownedTokens.filter((token) => (token.name === 'Noulith') && !!token.actor.getFlag('world', 'Zoe'));
  if (zoeNoulithTokens.length < 1) {
    game.dfreds.effectInterface.removeEffect({ effectName: "Zoe", uuid: game.user.character.uuid });
    return;
  }

  if (rollData.item.type !== "spell" && rollData.item.system.actionType !== "heal") return;

  return { damageRoll: `${zoeNoulithTokens.length}d4`, flavor: `Zoe` };
}

const onEffectDeletion = async () => {
  if (actor.name !== "Noulith") return;

  await actor.unsetFlag('world', 'Zoe');

  const zoeNoulithTokens = game.canvas.tokens.ownedTokens.filter((token) => (token.name === 'Noulith') && !!token.actor.getFlag('world', 'Zoe'));
  if (zoeNoulithTokens < 1) {
    game.dfreds.effectInterface.removeEffect({ effectName: "Zoe", uuid: game.user.character.uuid });
  }
}