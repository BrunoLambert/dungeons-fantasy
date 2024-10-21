const onUseItem = async () => {
  actor.sheet.close();

  const spawnKerachole = async (amountNoulith = 1) => {
    const effectData = game.dfreds.effectInterface.findEffectByName('Kerachole').data.toObject();
    effectData.description = effectData.description.replace("1d6", `${amountNoulith}d6`);
    effectData.changes = effectData.changes.map(change => {
      if (change.key !== "flags.midi-qol.DR.all") return change;
      return { ...change, value: `${amountNoulith}d6` }
    })

    const prev = await game.canvas.tokens.ownedTokens.find((token) => token.name === 'Kerachole')
    if (prev) {
      await prev.document.delete();
    }

    const [spawnedCreature2] = await warpgate.spawn("Kerachole", { token: { alpha: 1 } });

    const spawning = new Sequence()
      .wait(200)
      .effect()
      .file("jb2a.energy_field.02.above.blue")
      .attachTo(spawnedCreature2)
      .scale(2.4)
      .persist()
      .name(`Kerachole-${spawnedCreature2}`)
      .fadeIn(300)
      .fadeOut(300)

    await spawning.play();

    const spawnedActor = game.canvas.tokens.get(spawnedCreature2).actor;
    game.dfreds.effectInterface.addEffectWith({ effectData, uuid: spawnedActor.uuid });
    spawnedActor.setFlag('world', 'Kerachole', amountNoulith);
    Hotbar.toggleDocumentSheet(actor.uuid)
  }

  const noulithsToSend = Math.max(Math.min(item.actor.system.abilities.int.mod, 4), 1);
  let selects = ""
  for (let i = 0; i < noulithsToSend; i++) {
    selects += `<option value=${i + 1}>${i + 1} drones</option>`
  }
  let keracholeDialog = new Dialog({
    title: "Kerachole",
    content: `
      <p><b>Choose how many Nouliths you want to deploy</b></p>
      <select name="kerachole_charges" style="width: 100%;">
        ${selects}
      </select><br/><br/>`,
    buttons: {
      "Ok": {
        label: "Next",
        callback: (html) => {
          const charges = html.find('[name=kerachole_charges]')[0].value;
          if (!charges) throw new Error("None charges was selected");
          spawnKerachole(charges)
        }
      }
    }
  });
  keracholeDialog.render(true);
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
  let keracholeFlag = +actor.getFlag('world', 'Kerachole');

  const spawnRecalledNouliths = async (amount = 1) => {
    const keracholeToken = await game.canvas.tokens.ownedTokens.find((token) => token.name === 'Kerachole')

    for (let index = 0; index < amount; index++) {
      const [spawnedCreature] = await warpgate.spawnAt(keracholeToken.center, "Noulith", { token: { alpha: 0 } });

      const spawning = new Sequence()
        .wait(200)
        .effect()
        .file("jb2a.swirling_sparkles.01.blue")
        .atLocation(spawnedCreature)
        .wait(250)
        .animation()
        .on(spawnedCreature)
        .opacity(1.0)

      spawning.play();
    }
  }

  const recallNoulights = async (amount = 1) => {
    await game.dfreds.effectInterface.removeEffect({ effectName: "Kerachole", uuid: actor.uuid });
    const amountNoulith = keracholeFlag - amount;
    await spawnRecalledNouliths(amount);

    if (amountNoulith <= 0) {
      Hotbar.toggleDocumentSheet(actor.uuid)
      const keracholeToken = await game.canvas.tokens.ownedTokens.find((token) => token.name === 'Kerachole')
      keracholeToken.document.delete();
    } else {
      const effectData = game.dfreds.effectInterface.findEffectByName('Kerachole').data.toObject();
      effectData.description = effectData.description.replace("1d4", `${amountNoulith}d4`);
      effectData.changes = effectData.changes.map(change => {
        if (change.key !== "flags.midi-qol.DR.all") return change;
        return { ...change, value: `${amountNoulith}d4` }
      })

      await new Sequence().wait(3000).play();
      game.dfreds.effectInterface.addEffectWith({ effectData, uuid: actor.uuid });
      actor.setFlag('world', 'Kerachole', amountNoulith);
    }
  }

  let selects = ""
  for (let i = 0; i < keracholeFlag; i++) {
    selects += `<option value=${i + 1}>${i + 1} drones</option>`
  }
  let keracholeDialog = new Dialog({
    title: "Kerachole Recal",
    content: `
      <p><b>Choose how many Nouliths you want to recall</b></p>
      <select name="kerachole_charges" style="width: 100%;">
        ${selects}
      </select><br/><br/>`,
    buttons: {
      "Ok": {
        label: "Next",
        callback: (html) => {
          const charges = html.find('[name=kerachole_charges]')[0].value;
          if (!charges) throw new Error("None charges was selected");
          recallNoulights(charges)
        }
      }
    }
  });

  keracholeDialog.render(true);
}