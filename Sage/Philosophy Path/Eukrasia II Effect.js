const rollData = args[0];

const itemName = rollData.item.name
if (!['spell', 'feat'].includes(rollData.item.type) || rollData.item.system.actionType !== "heal") return;

const adicionalHealing = actor.system.attributes.prof;

return { damageRoll: `${adicionalHealing}`, flavor: `Eukrasia II` };