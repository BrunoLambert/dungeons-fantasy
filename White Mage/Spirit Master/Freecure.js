const rollData = args[0];
console.log(rollData)
if (!rollData.castData || rollData.castData.baseLevel < 1 || rollData.item.type !== "spell") return;

const itemName = rollData.item.name
if (item.name.search("Afflatus") >= 0) return;

const dices = rollData.damageRoll.dice;
let hasHealing = false;

dices.forEach((dice) => {
    hasHealing = hasHealing || dice.formula.includes('[Healing]');
    if (!hasHealing) return;
});

if (!hasHealing) return;

const adicionalHealing = rollData.castData.castLevel + actor.system.attributes.prof;

return { damageRoll: `${adicionalHealing}`, flavor: `Freecure` };