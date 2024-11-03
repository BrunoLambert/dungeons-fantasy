// On effect deletion of Operation
const onOpratingEffectDeletion = async () => {
  const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Inactive Noulith', actor.uuid);
  if (!hasEffectApplied) {
    await game.dfreds.effectInterface.addEffect({ effectName: 'Inactive Noulith', uuid: actor.uuid });
  }

  const character = game.user.character;
  const brokens = character.items.find(item => item.name === "Broken Nouliths");
  const inactives = character.items.find(item => item.name === "Inactive Nouliths");
  const actives = character.items.find(item => item.name === "Active Nouliths");

  if (!brokens || !character || !inactives || !actives) return;

  await brokens.update({ "system.uses.max": brokens.system.uses.value + 1 });
  await brokens.update({ "system.uses.value": brokens.system.uses.value + 1 });
  await inactives.update({
    "system.uses.max": Math.max(inactives.system.uses.max - 1, 1),
    "system.uses.value": Math.min(inactives.system.uses.value, inactives.system.uses.max - 1)
  });
  await actives.update({ "system.uses.value": actives.system.uses.value - 1 });

  await tokenAttacher.detachAllElementsFromToken(token)
}

// On effect deletion of Inactive Noulith
token.document.delete()
const character = game.user.character;

const brokens = character.items.find(item => item.name === "Broken Nouliths");
const destroyeds = character.items.find(item => item.name === "Destroyed Nouliths");

if (!brokens || !destroyeds) return;

await brokens.update({
  "system.uses.max": Math.max(brokens.system.uses.max - 1, 1),
  "system.uses.value": Math.max(brokens.system.uses.value - 1, 0)
});
await destroyeds.update({
  "system.uses.value": destroyeds.system.uses.value + 1,
  "system.uses.max": destroyeds.system.uses.value + 1
});