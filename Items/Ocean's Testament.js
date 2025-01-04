const onItemUse = async () => {
    actor.sheet.close();

    const spawnedCreature = game.canvas.tokens.placeables.find(placeable => placeable.name === "Leviathan Egi");

    await new Sequence()
        .wait(200)
        .effect()
        .file("jb2a.liquid.splash.blue")
        .atLocation(spawnedCreature)
        .wait(500)
        .animation()
        .on(spawnedCreature)
        .opacity(1.0)
        .play()

    if (game.combat) {
        await spawnedCreature.toggleCombat();

        const combatant = game.combat.combatants.find(combatant => combatant.actorId === actor.id);
        await game.combat.combatants.find(combatant => combatant.tokenId === spawnedCreature.id).update({ initiative: combatant.initiative - 0.001 });
    }

    const itemData = game.items.find(item => item.name === "Ray of Frost").toObject();
    itemData.name = `${itemData.name} (Leviathan Egi)`;
    await Item.create(itemData, { parent: actor });

    Hotbar.toggleDocumentSheet(actor.uuid)
}

const onEffectDeletion = async () => {
    const leviathanToken = game.canvas.tokens.ownedTokens.find((token) => token.name === 'Leviathan Egi')
    await new Sequence()
        .wait(200)
        .effect()
        .file("jb2a.particle_burst.01.circle.bluepurple")
        .atLocation(leviathanToken)
        .scale(1)
        .wait(1750)
        .play();
    leviathanToken.document.delete();


    const cantrip = actor.items.find((item) => (item.name.search("Leviathan Egi") >= 0 && item.name.search("Ray of Frost") >= 0))
    if (cantrip) cantrip.delete();
}
