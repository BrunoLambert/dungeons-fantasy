const rollData = args[0];
if (!rollData.castData || rollData.castData.baseLevel < 1) return;

const dices = rollData.damageRoll.dice;
let hasHealing = false;

dices.forEach((dice) => {
    hasHealing = hasHealing || dice.formula.includes('[Healing]');
    if (!hasHealing) return;
});

if (!hasHealing) return;

const adicionalHealing = rollData.castData.castLevel + actor.system.attributes.prof;

return { damageRoll: `${adicionalHealing}`, flavor: `Freecure` };