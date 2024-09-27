// On Turn Starting

const boxStyleFinal = `
    flex: 0 0 100%;
    position: relative;
    margin: 0;
    line-height: 24px;
    text-align: center;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid var(--color-shadow-primary);
    border-radius: 3px;
    box-shadow: 0 0 2px #FFF inset;
    word-break: break-all;
    margin-bottom: 10px;
    font-size: var(--font-size-20);
    font-weight: bold;
    color: var(--color-shadow-primary);
`

const damage = await new Roll('1d10').roll();
actor.update({ 'system.attributes.hp.value': Math.max(actor.system.attributes.hp.value - damage.total, 0) });

ChatMessage.create({
    user: game.user.id,
    speaker: speaker,
    content: `
        <div style="display: flex; align-items: center; gap: 10px;">
            <img width="36px" src="icons/skills/wounds/injury-triple-slash-bleed.webp" title="Aurora" />
            <h3 style="font-family: Modesto Condensed, Palatino Linotype, serif; flex: 1; border-bottom: unset;">
                <div style="display:flex; align-items:center;">Bleeding</div>
            </h3>
        </div>
        <p style="font-size:12px; text-align:center; margin-bottom:0;">Blessing (1d10)</p>
        <div style="${boxStyleFinal}">${damage.total}</div>
    `
});