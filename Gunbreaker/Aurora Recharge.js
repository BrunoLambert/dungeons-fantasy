// On start of combat turn
const onStartOfCombatTurn = async () => {
    const auroraItem = actor.items.find(i => i.name === 'Aurora');
    const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied({ effectName: "Aurora", uuid: actor.uuid });
    if (!auroraItem.system.recharge.charged && !hasEffectApplied) {
        auroraItem.rollRecharge();
    }
}

// On combat ending
const onCombatEnding = async () => {
    const auroraItem = actor.items.find(i => i.name === 'Aurora');
    if (!auroraItem) return;

    auroraItem.update({ "system.uses.recharge.charged": true });
}