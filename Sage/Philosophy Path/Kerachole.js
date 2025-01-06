const onUseItem = async () => {
  actor.sheet.close();
  const targets = game.user.targets.toObject();
  if (!targets && targets.length < 1 && !targets.some(target => target.name !== "Noulith")) {
    throw new Error("You need valid targets.");
  }

  const spawnKerachole = async (amountNoulith = 1) => {
    const effectData = game.dfreds.effectInterface.findEffect({ effectName: 'Kerachole' }).toObject();
    effectData.description = effectData.description.replace("1d4", `${amountNoulith}d4`);
    effectData.changes = effectData.changes.map(change => {
      if (change.key !== "system.traits.dm.midi.all") return change;
      return { ...change, value: `- (floor(random() * ${amountNoulith * 4}) + 1)` };
    })

    const spawnedKerachole = item.system.summons.summonedCreatures[0];
    if (!spawnedKerachole) return;

    const spawnedToken = spawnedKerachole.token;

    const prev = await game.canvas.tokens.ownedTokens.find((token) => token.name === 'Kerachole' && token.id !== spawnedToken.id);
    if (prev) {
      await prev.document.delete();
    }

    const spawning = new Sequence()
      .wait(200)
      .effect()
      .file("jb2a.energy_field.02.above.blue")
      .attachTo(spawnedToken)
      .scale(2.4)
      .persist()
      .name(`Kerachole-${spawnedToken.id}`)
      .fadeIn(300)
      .fadeOut(300);

    await spawning.play();

    game.dfreds.effectInterface.addEffect({ effectData, uuid: spawnedKerachole.uuid });

    const keracholeData = []
    for (let index = 0; index < amountNoulith; index++) {
      keracholeData.push({ hp: targets[index].actor.system.attributes.hp.value });
      targets[index].document.delete();
    }

    spawnedKerachole.update({
      "system.attributes.hp.max": keracholeData.reduce((prev, crr) => prev + crr.hp, 0),
      "system.attributes.hp.value": keracholeData.reduce((prev, crr) => prev + crr.hp, 0)
    })
    spawnedKerachole.setFlag('world', 'Kerachole', keracholeData);
    Hotbar.toggleDocumentSheet(actor.uuid);
  }

  const maxNoulithsToSend = Math.max(Math.min(item.actor.system.abilities.int.mod, 4), 1);
  await spawnKerachole(Math.min(targets.length, maxNoulithsToSend));
}

const onEffectEnd = async (args) => {
  if (args[0] === "off") {
    const keracholeToken = game.canvas.tokens.ownedTokens.find((token) => token.name === 'Kerachole');

    if (!keracholeToken || !keracholeToken.id) return;

    Sequencer.EffectManager.endEffects({ name: `Kerachole-${keracholeToken.id}`, object: keracholeToken });

    const deSpawning = new Sequence()
      .wait(200)
      .effect()
      .file("jb2a.swirling_sparkles.01.blue")
      .atLocation(keracholeToken.id)
      .wait(200)

    await deSpawning.play();
  }
}

const onReacall = async () => {
  let keracholeData = actor.getFlag('world', 'Kerachole');

  const spawnRecalledNouliths = async (recalleds = [{ hp: 0 }], avarageLostHp = 0) => {
    const actorToken = await game.canvas.tokens.ownedTokens.find((token) => token.actor.type === "character");

    recalleds.forEach(async (recalled, recalledIndex) => {
      const portal = new Portal().setLocation(actorToken.center).size(10);
      portal.addCreature("Noulith", {
        count: 1,
        updateData: {
          token: { elevation: 1, alpha: 0 },
          actor: {
            system: { attributes: { hp: { value: recalled.hp - avarageLostHp } } }
          }
        }
      });
      const [summon] = await portal.spawn();

      const spawning = new Sequence()
        .wait(200)
        .effect()
        .file("jb2a.swirling_sparkles.01.blue")
        .atLocation(summon)
        .wait(900)
        .animation()
        .on(summon)
        .opacity(1.0)

      await spawning.play();
    })
  }

  const recallNoulights = async (amount = 1) => {
    await game.dfreds.effectInterface.removeEffect({ effectName: "Kerachole", uuid: actor.uuid });
    const amountNoulith = keracholeData.length - amount;
    const avarageLostHp = (actor.system.attributes.hp.max - actor.system.attributes.hp.value) / keracholeData.length

    if (amountNoulith <= 0) {
      Hotbar.toggleDocumentSheet(actor.uuid)
      await spawnRecalledNouliths(keracholeData, avarageLostHp)
      const keracholeToken = await game.canvas.tokens.ownedTokens.find((token) => token.name === 'Kerachole')
      keracholeToken.document.delete();
    } else {
      const effectData = game.dfreds.effectInterface.findEffect({ effectName: 'Kerachole' }).toObject();
      effectData.description = effectData.description.replace("1d4", `${amountNoulith}d4`);
      effectData.changes = effectData.changes.map(change => {
        if (change.key !== "system.traits.dm.midi.all") return change;
        return { ...change, value: `- (floor(random() * ${amountNoulith * 4}) + 1)` };
      })

      const recalleds = keracholeData.slice(0, amount)
      await spawnRecalledNouliths(recalleds, avarageLostHp);
      await new Sequence().wait(3000).play();

      keracholeData.splice(0, amount)
      const reducedMaxLife = recalleds.reduce((prev, crr) => prev + crr.hp, 0);
      game.dfreds.effectInterface.addEffect({ effectData, uuid: actor.uuid });
      actor.update({
        "system.attributes.hp.max": actor.system.attributes.hp.max - reducedMaxLife,
        "system.attributes.hp.value": (Math.min(actor.system.attributes.hp.max - reducedMaxLife, actor.system.attributes.hp.value) - (keracholeData.length * avarageLostHp))
      });
      actor.setFlag('world', 'Kerachole', keracholeData);
    }
  }

  let selects = ""
  for (let i = 0; i < keracholeData.length; i++) {
    selects += `<option value=${i + 1}>${i + 1} drones</option>`
  }
  let keracholeDialog = new Dialog({
    title: "Kerachole Recal",
    content: `
      <p><b>Choose how many Nouliths you want to recall</b></p>
      <select name="charges" style="width: 100%;">
        ${selects}
      </select><br/><br/>`,
    buttons: {
      "Ok": {
        label: "Next",
        callback: (html) => {
          const charges = html.find('[name=charges]')[0].value;
          if (!charges) throw new Error("None charges was selected");
          recallNoulights(charges)
        }
      }
    }
  });

  keracholeDialog.render(true);
}