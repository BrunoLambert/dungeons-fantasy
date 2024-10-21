const onUseItem = async () => {
  const intMod = item.actor.system.abilities.int.mod;
  const targets = game.user.targets;
  if (!targets && targets.size < 1 && !targets.some(target => target.name !== "Noulith")) {
    throw new Error("You need valid targets.");
  }

  const effectData = game.dfreds.effectInterface.findEffectByName('Zoe').data.toObject();
  effectData.description = effectData.description.replace("%m", `+${intMod}`);
  const maxNoulithsToSend = Math.max(Math.min(intMod, 4), 1);

  targets.filter((target) => (target.name === "Noulith")).toObject().slice(0, maxNoulithsToSend).forEach(target => {
    game.dfreds.effectInterface.addEffectWith({ effectData, uuid: target.actor.uuid });
    target.actor.setFlag('world', 'Zoe', true);
  })

  effectData.description = `Zoe Technique is amplifying the healing by ${intMod * targets.size}`
  game.dfreds.effectInterface.addEffectWith({ effectData, uuid: actor.uuid });
}

const onHealing = () => {
  const rollData = args[0];

  const zoeNoulithTokens = game.canvas.tokens.ownedTokens.filter((token) => (token.name === 'Noulith') && !!token.actor.getFlag('world', 'Zoe'));
  if (zoeNoulithTokens.length < 1) return;

  if (!['spell', 'feat'].includes(rollData.item.type) || rollData.item.system.actionType !== "heal") return;

  const adicionalHealing = zoeNoulithTokens.length * actor.system.abilities.int.mod;

  return { damageRoll: `${adicionalHealing}`, flavor: `Zoe` };
}

const onEffectDeletion = async () => {
  if (actor.name !== "Noulith") return;

  await actor.unsetFlag('world', 'Zoe');

  const zoeNoulithTokens = game.canvas.tokens.ownedTokens.filter((token) => (token.name === 'Noulith') && !!token.actor.getFlag('world', 'Zoe'));
  if (zoeNoulithTokens < 1) {
    game.dfreds.effectInterface.removeEffect({ effectName: "Zoe", uuid: game.user.character.uuid });
  }
}