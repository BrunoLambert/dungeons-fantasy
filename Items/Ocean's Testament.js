actor.sheet.close();

const [spawnedCreature] = await warpgate.spawn("Leviathan Egi", { token: { alpha: 0 } });

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
    const token = game.canvas.tokens.placeables.find(placeable => placeable.id === spawnedCreature);
    await token.toggleCombat();

    const combatant = game.combat.combatants.find(combatant => combatant.actorId === actor.id);

    await game.combat.combatants.find(combatant => combatant.tokenId === spawnedCreature).update({ initiative: combatant.initiative - 0.001 });
}

const itemData = game.items.find(item => item.name === "Ray of Frost").toObject();
itemData.name = `${itemData.name} (Summon Leviathan)`;
await Item.create(itemData, { parent: actor });

Hotbar.toggleDocumentSheet(actor.uuid)

const onEffectDeletion = () => {
    const item = actor.items.find((item) => item.name.search("(Summon Leviathan)") >= 0)
    if (item) item.delete();
}
