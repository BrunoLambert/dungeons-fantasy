// On Turn Starting
const boxStyle = `
    flex: 0 0 100%;
    position: relative;
    margin: 0;
    line-height: 24px;
    text-align: center;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid teal;
    border-radius: 3px;
    box-shadow: 0 0 2px #FFF inset;
    word-break: break-all;
    margin-bottom: 10px;
    font-size: var(--font-size-20);
    font-weight: bold;
    padding: 4px;
`

const damage = await new Roll("2d8").evaluate();
actor.update({ 'system.attributes.hp.value': Math.min(actor.system.attributes.hp.value - damage.total, actor.system.attributes.hp.max) });
const dicesResult = damage.dice[0].values.join(" + ")

ChatMessage.create({
    user: game.user.id,
    speaker: speaker,
    content: `
        <div style="display: flex; align-items: center; gap: 10px;">
            <img width="36px" src="icons/magic/lightning/bolt-cloud-sky-white.webp" title="Aurora" />
            <h3 style="font-family: Modesto Condensed, Palatino Linotype, serif; flex: 1; border-bottom: unset;">
                <div style="display:flex; align-items:center;">Electrified Pool</div>
            </h3>
        </div>
        <p style="font-size:12px; text-align:center; margin-bottom:0;">Lightning (2d8)</p>
        <div style="${boxStyle}">${damage.total} (${dicesResult})</div>
    `
})