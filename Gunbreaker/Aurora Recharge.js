// On start of combat turn
const auroraItem = actor.items.find(i => i.name === 'Aurora');
if (!auroraItem.system.recharge.charged) {
    auroraItem.rollRecharge();
}

// On combat ending
const auroraItem = actor.items.find(i => i.name === 'Aurora');
if (!auroraItem) return;

auroraItem.update({ "system.uses.recharge.charged": true });