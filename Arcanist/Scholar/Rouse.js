const mod = item.actor.system.abilities.int.mod || 1;

const target = game.user.targets.first();
const uuid = target.actor.uuid;

const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Rouse', uuid);
if (hasEffectApplied) return;

const effectData = game.dfreds.effectInterface.findEffectByName('Rouse').data.toObject();
effectData.duration.seconds = mod * 6;
effectData.changes = effectData.changes.map(change => ({ ...change, value: mod }))
game.dfreds.effectInterface.addEffectWith({ effectData, uuid });