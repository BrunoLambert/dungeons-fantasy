try {
  const character = game.user.character;
  const actives = character.items.find(item => item.name === "Active Nouliths");
  const inactives = character.items.find(item => item.name === "Inactive Nouliths");
  // system.uses.value /system.uses.max

  const keracholeToken = await game.canvas.tokens.ownedTokens.find((token) => (token.name === 'Kerachole'));
  const noulithTokens = await game.canvas.tokens.ownedTokens.filter((token) => (token.name === 'Noulith'));
  let safeCount = noulithTokens.length;

  if (!!keracholeToken) {
    const keracholeData = keracholeToken.actor.getFlag('world', 'Kerachole');
    safeCount += keracholeData.length;
  }

  if (actives.system.uses.value !== safeCount) {
    await inactives.update({ "system.uses.value": Math.max(Math.min(inactives.system.uses.value + actives.system.uses.value - safeCount, inactives.system.uses.max), 0) });
  }
  await actives.update({ "system.uses.value": safeCount });

  if (!inactives.system.uses.value) {
    throw new Error("You don't have any inactive Noulith to spawn");
  }

  if (actives.system.uses.value >= actives.system.uses.max) {
    throw new Error("You can't spawn more Noulith");
  }

  const [spawnedNoulith] = await warpgate.spawn("Noulith", { token: { alpha: 0, elevation: 1 } });

  const spawning = new Sequence()
    .wait(200)
    .effect()
    .file("jb2a.swirling_sparkles.01.blue")
    .atLocation(spawnedNoulith)
    .wait(900)
    .animation()
    .on(spawnedNoulith)
    .opacity(1.0)

  await spawning.play();

  await actives.update({ "system.uses.value": actives.system.uses.value + 1 });
  await inactives.update({ "system.uses.value": inactives.system.uses.value - 1 });

} catch (err) {
  let errorDialog = new Dialog({
    title: "Spawn Noulith",
    content: `<h2>Spawn Noulith Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
    buttons: {
      button1: {
        label: 'Ok',
        callback: () => { },
      }
    }
  });

  errorDialog.render(true);
}