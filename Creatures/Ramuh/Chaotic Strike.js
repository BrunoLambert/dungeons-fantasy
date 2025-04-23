const onChaoticStrikeEffectEnd = (actor) => {
    game.dfreds.effectInterface.addEffect({ effectName: `Remuh's Seduction`, uuid: actor.uuid });
}