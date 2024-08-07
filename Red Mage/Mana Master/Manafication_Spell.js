// Not working

const rollData = args[0];
if (!rollData.castData || rollData.castData.baseLevel < 1 || rollData.item.type !== 'spell') return;

console.log(rollData.castData, rollData);
console.log(rollData.item.system.school)

const BLACK_MANA_SCHOOLS = ['evo', 'nec', 'ilu']