actor.sheet.close();

const [spawnedCreature] = await warpgate.spawn("Alfredo", { token: { alpha: 0 } });

const spawning = new Sequence()
    .wait(200)
    .effect()
    .file("jb2a.plant_growth.03.ring.4x4.pulse.greenyellow")
    .atLocation(spawnedCreature)
    .wait(900)
    .animation()
    .on(spawnedCreature)
    .opacity(1.0)

await spawning.play();

if (game.combat) {
    const token = game.canvas.tokens.placeables.find(placeable => placeable.id === spawnedCreature);
    await token.toggleCombat();

    const combatant = game.combat.combatants.find(combatant => combatant.actorId === actor.id);

    await game.combat.combatants.find(combatant => combatant.tokenId === spawnedCreature).update({ initiative: combatant.initiative - 0.001 });
}

Hotbar.toggleDocumentSheet(actor.uuid)