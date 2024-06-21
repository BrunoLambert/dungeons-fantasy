const lily = actor.items.find(i => i.name === 'Secret of the Lily');

lily.update({ "system.uses.value": Math.min((lily.system.uses.value * 2) + 1, lily.system.uses.max) });