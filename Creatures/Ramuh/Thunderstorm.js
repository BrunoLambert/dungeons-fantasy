const onMacroUse = () => {
    const targets = game.user.targets.toObject()

    targets.forEach((target) => {
        new Sequence()
            .effect()
            .file("jb2a.impact.012.blue")
            .attachTo(target)
            .name("ThunderstormEffect")
            .persist()
            .play()
    })
}

const onItemUse = () => {
    const targets = game.user.targets.toObject()

    targets.forEach((target) => {
        Sequencer.EffectManager.endEffects({ name: "ThunderstormEffect", object: target })
    })
}