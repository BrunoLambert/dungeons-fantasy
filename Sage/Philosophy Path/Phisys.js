const onUsingItem = () => {
  try {
    const effectData = game.dfreds.effectInterface.findEffect({ effectName: 'Physis' }).toObject();

    if (item.name.search("Eukrasian") >= 0) {
      effectData.name = `Eukrasian ${effectData.name}`;
      effectData.description = effectData.description.replace("Physis", `Eukrasian ${effectData.name}`)
    }

    const targets = game.user.targets.toObject();
    if ((!targets && targets.length < 1) || targets.some((target) => target.name !== "Noulith")) {
      throw new Error("You need valid targets");
    }
    const NOULITH_TARGETS = game.user.targets.toObject();
    let amountOfNouliths = targets.length;

    const handleSelection = (destinationToken, maxAmount) => new Promise((resolve, reject) => {
      if (!maxAmount) reject("No Nouliths left");

      const handleAmountSelection = async (amount = 0) => {
        const gridOffset = game.canvas.grid.w * 0.4;
        const noulithToGoPositions = [
          { x: destinationToken.x, y: destinationToken.y },
          { x: destinationToken.x + gridOffset, y: destinationToken.y },
          { x: destinationToken.x, y: destinationToken.y + gridOffset },
          { x: destinationToken.x + gridOffset, y: destinationToken.y + gridOffset }
        ]

        const tokensToMove = targets.splice(0, amount);
        for (let index = 0; index < tokensToMove.length; index++) {
          const movingToken = new Sequence()
            .animation()
            .on(tokensToMove[index])
            .moveTowards(noulithToGoPositions[index])
            .moveSpeed(500)
          await movingToken.play();
          game.dfreds.effectInterface.addEffect({ effectData, uuid: tokensToMove[index].actor.uuid });
          tokensToMove[index].actor.setFlag('world', 'Physis', { targetUuid: destinationToken.id });
        }

        setTimeout(() => {
          tokenAttacher.attachElementsToToken(tokensToMove, destinationToken)
        }, 1000);
        resolve(amount);
      }

      let selects = "";
      for (let i = 0; i < Math.min(maxAmount, 4); i++) {
        selects += `<option value=${i + 1}>${i + 1} drones</option>`
      }
      let destinationPhysisDialog = new Dialog({
        title: "Physis",
        content: `
          <p><b>Choose how many Nouliths you want to deploy to ${destinationToken.name}</b></p>
          <select name="nouliths" style="width: 100%;">
            ${selects}
          </select><br/><br/>
        `,
        buttons: {
          "Ok": {
            label: "Next",
            callback: (html) => {
              const noulithAmount = html.find('[name=nouliths]')[0].value;
              if (!noulithAmount) reject("None Nouliths were selected");
              handleAmountSelection(noulithAmount)
            }
          }
        }
      });
      destinationPhysisDialog.render(true);
    })

    const handleEffectDestination = async () => {
      const destinationTokens = game.user.targets.toObject().filter(token => token.name !== "Noulith");

      for (let index = 0; index < destinationTokens.length; index++) {
        if (amountOfNouliths > 0) {
          const amountSent = await handleSelection(destinationTokens[index], amountOfNouliths);
          amountOfNouliths -= amountSent
        }
      }

      token.setTarget(false, { releaseOthers: true })
    }

    token.setTarget(false, { releaseOthers: true })
    let physisDialog = new Dialog({
      title: "Physis",
      content: `<p><b>Target the creatures you want to deploy your Noulith(s) with Physis effect</b></p>`,
      buttons: {
        "Ok": {
          label: "Next",
          callback: handleEffectDestination
        }
      }
    });
    physisDialog.render(true);

  } catch (err) {
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
    const handleTargetingMode = () => {
      const targets = game.user.targets.toObject().filter(target => target.name === "Noulith");
      if (!targets && targets.length < 1) {
        throw new Error('You need, at least, one target');
      }

      targets.forEach(target => {
        const physisIcon = target.actor.items.find(item => item.name.search('Physis Healing') >= 0);
        physisIcon.use();
      });
    }

    const handleAutomaticMode = () => {
      const physisNoulithTokens = game.canvas.tokens.ownedTokens.filter((token) => (token.name === 'Noulith') && !!token.actor.getFlag('world', 'Physis'));
      physisNoulithTokens.forEach(physisNoulithToken => {
        const physisIcon = physisNoulithToken.actor.items.find(item => item.name.search('Physis Healing') >= 0);
        physisIcon.use();
      });
    }

    let physisDialog = new Dialog({
      title: "Physis",
      content: `<p><b>Select the the activation mode:</b></p>`,
      buttons: {
        "Target": {
          label: "Targeting Mode",
          callback: handleTargetingMode
        },
        "General": {
          label: "Automatic Mode",
          callback: handleAutomaticMode
        }
      }
    });
    physisDialog.render(true);

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