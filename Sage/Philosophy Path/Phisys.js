const onUsingItem = () => {
  const effectData = game.dfreds.effectInterface.findEffectByName('Physis').data.toObject();

  if (item.name.search("Eukrasian") >= 0) {
    effectData.name = `Eukrasian ${effectData.name}`;
    effectData.description = effectData.description.replace("Physis", `Eukrasian ${effectData.name}`)
  }

  const targets = game.user.targets;
  if (!targets && targets.size < 1) {
    return;
  }

  targets.forEach(async (target) => {
    const hasEffectsApplied = [
      await game.dfreds.effectInterface.hasEffectApplied('Physis', target.actor.uuid),
      await game.dfreds.effectInterface.hasEffectApplied('Eukrasian Physis', target.actor.uuid)
    ];
    if (hasEffectsApplied.some(hasEffectApply => hasEffectApply)) return;

    game.dfreds.effectInterface.addEffectWith({ effectData, uuid: target.actor.uuid });
  })
}

const onEffectCreation = async () => {
  const item = game.items.find(i => i.name === "Physis Healing");
  const itemData = item.toObject();

  if (effect.name.search("Eukrasian") >= 0) {
    itemData.name = "Eukrasian " + itemData.name;
    itemData.system.damage.parts = itemData.system.damage.parts.map(part => {
      let tmp = part.join('%b');
      tmp = tmp.replace("healing", "temphp");
      tmp = tmp.replace("1d8", `1d8 + ${actor.system.attributes.prof}`)
      return tmp.split('%b');
    })
    itemData.system.description.value = itemData.system.description.value.replace("hit points", "temporary hit points");
  }

  await Item.create(itemData, { parent: actor });
}

const activeHealingEffect = () => {
  try {
    const targets = game.user.targets;
    if (!targets && targets.size < 1) {
      throw new Error('You need, at least, one target');
    }

    targets.forEach(target => {
      const physisIcon = target.actor.items.find(item => item.name.search('Physis Healing') >= 0);
      physisIcon.use();
    });

  } catch (error) {
    let errorDialog = new Dialog({
      title: "Physis",
      content: `<h2>Physis Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
      buttons: {
        button1: {
          label: 'Ok',
          callback: () => { },
        }
      }
    });

    errorDialog.render(true);
    game.macros.getName("ClearLastMessage").execute();
  }
}

const onEffectDeletion = () => {
  const item = actor.items.find((item) => item.name.search("Physis") >= 0)
  item.delete();
}