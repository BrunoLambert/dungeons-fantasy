const onUseItem = () => {
    const targets = game.user.targets.toObject()
    if (targets.length !== 2) return

    targets.forEach(target => {
        target.actor.setFlag('world', "RollingThunder", 1);
    })

    new Sequence()
        .effect()
        .file("jb2a.impact.011.blue")
        .attachTo(targets[0])
        .stretchTo(targets[1], { attachTo: true })
        .name("RollingThunderEffect")
        .persist()
        .play()
}

const onTurnStart = () => {
    const stacks = actor.getFlag('world', 'RollingThunder')
    if (!stacks) return

    const boxStyle = `
        flex: 0 0 100%;
        position: relative;
        margin: 0;
        line-height: 24px;
        text-align: center;
        background: rgba(0, 0, 0, 0.1);
        border: 1px solid purple;
        border-radius: 3px;
        box-shadow: 0 0 2px #FFF inset;
        word-break: break-all;
        margin-bottom: 10px;
        font-size: var(--font-size-20);
        font-weight: bold;
        padding: 2px;
    `
    const damage = 8 * stacks;
    actor.update({ 'system.attributes.hp.value': Math.min(actor.system.attributes.hp.value - damage, actor.system.attributes.hp.max) });

    ChatMessage.create({
        user: game.user.id,
        speaker: speaker,
        content: `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img width="36px" src="worlds/fantasy-dungeons/itens/Monster%20Actions/Thunderclap.png" title="Thunderclap" />
                <h3 style="font-family: Modesto Condensed, Palatino Linotype, serif; flex: 1; border-bottom: unset;">
                    <div style="display:flex; align-items:center;">Thunderclap</div>
                </h3>
            </div>
            <p style="font-size:12px; text-align:center; margin-bottom:0;">Lightning</p>
            <div style="${boxStyle}">${damage}</div>
        `
    })

    actor.setFlag('world', "RollingThunder", stacks + 1);
}

const onEffectDeletion = () => {
    actor.unsetFlag('world', 'RollingThunder');
}