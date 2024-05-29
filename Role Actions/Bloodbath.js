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
const rollData = args[0];
let healing = 0;

if (rollData.attackD20 && rollData.attackRoll && rollData.hitTargets.length + rollData.hitTargetUuids.length > 0) {
    healing = Math.ceil(rollData.damageTotal / 2);
    ChatMessage.create({
        user: game.user.id,
        speaker: speaker,
        content: `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img width="36px" src="worlds/fantasy-dungeons/itens/Role%20Actions/Bloodbath.png" title="Bloodbath" />
                <h3 style="font-family: Modesto Condensed, Palatino Linotype, serif; flex: 1; border-bottom: unset;">
                    <div style="display:flex; align-items:center;">Bloodbath</div>
                </h3>
            </div>
            <p style="font-size:12px; text-align:center; margin-bottom:0;">Healing</p>
            <div style="${boxStyle}">${healing}</div>
        `
    })
}