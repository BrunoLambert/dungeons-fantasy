// On Turn Starting
let AURORA_DETAILS = actor.getFlag('world', 'Gunbreak:Aurora')
const boxStyle = `
    flex: 0 0 100%;
    position: relative;
    margin: 0;
    line-height: 24px;
    text-align: center;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid var(--color-border-light-2);
    border-radius: 3px;
    box-shadow: 0 0 2px #FFF inset;
    word-break: break-all;
    margin-bottom: 10px;
    font-size: var(--font-size-20);
    font-weight: bold;
`
const boxStyleFinal = `
    flex: 0 0 100%;
    position: relative;
    margin: 0;
    line-height: 24px;
    text-align: center;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid var(--attribute-bar-secondary-color);
    border-radius: 3px;
    box-shadow: 0 0 2px #FFF inset;
    word-break: break-all;
    margin-bottom: 10px;
    font-size: var(--font-size-20);
    font-weight: bold;
    color: var(--attribute-bar-primary-color);
`
const isMaxHealing = actor.flags["midi-qol"]?.max?.damage?.heal;
const healing = await new Roll(AURORA_DETAILS.healing).evaluate({ maximize: isMaxHealing });
actor.update({ 'system.attributes.hp.value': Math.min(actor.system.attributes.hp.value + healing.total, actor.system.attributes.hp.max) });

ChatMessage.create({
    user: game.user.id,
    speaker: speaker,
    content: `
        <div style="display: flex; align-items: center; gap: 10px;">
            <img width="36px" src="worlds/fantasy-dungeons/itens/Features%20and%20Spells/Aurora.png" title="Aurora" />
            <h3 style="font-family: Modesto Condensed, Palatino Linotype, serif; flex: 1; border-bottom: unset;">
                <div style="display:flex; align-items:center;">Aurora</div>
            </h3>
        </div>
        <p style="font-size:12px; text-align:center; margin-bottom:0;">Healing (${AURORA_DETAILS.healing})</p>
        <div style="${boxStyle}">${healing.result}</div>
        <div style="${boxStyleFinal}">${healing.total}</div>
    `
})

AURORA_DETAILS.duration--;

if (AURORA_DETAILS.duration <= 0) {
    const auroraItem = actor.items.find(i => i.name === 'Aurora');
    if (!auroraItem.system.recharge.charged) {
        auroraItem.rollRecharge();
    }

    await actor.unsetFlag('world', 'Gunbreak:Aurora');
    game.dfreds.effectInterface.removeEffect({ effectName: 'Aurora', uuid: actor.uuid });
} else {
    await actor.setFlag('world', AURORA_DETAILS.flag, AURORA_DETAILS);
}