const rollData = args[0];
if (!rollData.castData || rollData.castData.baseLevel < 1) return;

const dices = rollData.damageRoll.dice;
let hasHealing = false;
let hasCritical = false;
let criticalDice = null;

dices.forEach((dice) => {
    if (hasCritical) return;

    hasHealing = hasHealing || dice.formula.includes('[Healing]');
    if (!hasHealing) return;

    const faces = dice.faces;
    hasCritical = dice.results.reduce((prev, acc) => prev || acc.result === faces, false);
    criticalDice = `1d${faces}`;
});

if (!hasHealing || !hasCritical) return;

const roll = await new Roll(criticalDice).roll();

return { damageRoll: `${criticalDice}`, flavor: `Critical Heal` };