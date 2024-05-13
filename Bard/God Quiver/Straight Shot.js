const straightShotItem = actor.items.find(i => i.name === 'Straight Shot');
if (straightShotItem.system.recharge.charged) return;

const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied('Straight Shot', actor.uuid);
if (hasEffectApplied) {
    return;
}

straightShotItem.rollRecharge();