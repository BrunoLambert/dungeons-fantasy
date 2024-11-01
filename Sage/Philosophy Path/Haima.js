const onItemUse = async (item) => {
  try {
    // Changed the item name to Reacall Haima then entering here.
    if (item.name.search("Recall") >= 0) {
      const haimaData = actor.getFlag('world', 'Haima') // { nouliths: [tokens_id], target: token_id }
      const charToken = game.canvas.tokens.placeables.find(token => token.id === haimaData.target)
      game.dfreds.effectInterface.removeEffect({ effectName: "Haima", uuid: charToken.actor.uuid });
      game.canvas.tokens.ownedTokens.filter(token => haimaData.nouliths.includes(token.id)).forEach(token => {
        token.setTarget(true, { releaseOthers: false })
      })
      item.update({ name: "Haima" })
      await actor.unsetFlag('world', 'Haima');
      tokenAttacher.detachAllElementsFromToken(charToken)
      game.macros.getName("Recall Noulith").execute();
      return;
    }

    const targets = game.user.targets.toObject();
    const isntAllNouliths = targets.some((target) => target.name !== "Noulith")
    if (isntAllNouliths || targets.length < 4) throw new Error("You need valid targets (4 Nouliths)");

    // Handle New Targeting
    const handleEffectDestination = () => {
      const creatureToken = game.user.targets.first();
      if (!creatureToken || creatureToken.name === "Noulith") throw new Error("Invalid target of Haima");

      const gridOffset = game.canvas.grid.w * 0.4;
      const noulithToGoPositions = [
        { x: creatureToken.x, y: creatureToken.y },
        { x: creatureToken.x + gridOffset, y: creatureToken.y },
        { x: creatureToken.x, y: creatureToken.y + gridOffset },
        { x: creatureToken.x + gridOffset, y: creatureToken.y + gridOffset }
      ]
      targets.forEach(async (target, targetIndex) => {
        const movingToken = new Sequence()
          .animation()
          .on(target)
          .moveTowards(noulithToGoPositions[targetIndex])
          .moveSpeed(500)
        await movingToken.play();
        game.dfreds.effectInterface.addEffect({ effectName: 'Haima', uuid: target.actor.uuid });
      });

      game.dfreds.effectInterface.addEffect({ effectName: 'Haima', uuid: creatureToken.actor.uuid });
      setTimeout(() => {
        tokenAttacher.attachElementsToToken(targets, creatureToken)
      }, 2000);
      item.update({ name: "Recall Haima" })
      actor.setFlag('world', 'Haima', { nouliths: targets.map(target => target.id), target: creatureToken.id });
    }

    let haimaDialog = new Dialog({
      title: "Haima",
      content: `<p><b>Target the creature you want to protect with Haima then click Next</b></p>`,
      buttons: {
        "Ok": {
          label: "Next",
          callback: () => handleEffectDestination(targets)
        }
      }
    });

    haimaDialog.render(true);
  } catch (err) {
    let errorDialog = new Dialog({
      title: "Haima",
      content: `<h2>Haima Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
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