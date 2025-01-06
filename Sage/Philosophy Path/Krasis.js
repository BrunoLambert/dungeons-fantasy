const onItemUse = () => {
  try {
    const targets = game.user.targets.toObject();
    if (targets.some((target) => target.name !== "Noulith") && targets.length <= 4) {
      throw new Error("You need valid targets");
    }

    const handleEffectDestination = () => {
      const creatureToken = game.user.targets.first();
      if (!creatureToken || creatureToken.name === "Noulith") throw new Error("Invalid target of Krasis");

      const gridOffset = game.canvas.grid.w * 0.4;
      const noulithToGoPositions = [
        { x: creatureToken.x, y: creatureToken.y },
        { x: creatureToken.x + gridOffset, y: creatureToken.y },
        { x: creatureToken.x, y: creatureToken.y + gridOffset },
        { x: creatureToken.x + gridOffset, y: creatureToken.y + gridOffset }
      ]
      const noulithEffectData = game.dfreds.effectInterface.findEffect({ effectName: 'Krasis' }).toObject();
      noulithEffectData.description = "Working on Krasis Technique";

      targets.forEach(async (target, targetIndex) => {
        const movingToken = new Sequence()
          .animation()
          .on(target)
          .moveTowards(noulithToGoPositions[targetIndex])
          .moveSpeed(500)
        await movingToken.play();
        game.dfreds.effectInterface.addEffect({ effectData: noulithEffectData, uuid: target.actor.uuid });
        target.actor.setFlag('world', 'Krasis', { targetUuid: creatureToken.actor.uuid });
      });

      game.dfreds.effectInterface.addEffect({ effectName: 'Krasis', uuid: creatureToken.actor.uuid });
      setTimeout(() => {
        tokenAttacher.attachElementsToToken(targets, creatureToken)
      }, 2000);
    }

    let krasisDialog = new Dialog({
      title: "Krasis",
      content: `<p><b>Target the creature you want to deploy your Noulith(s) with Krasis effect</b></p>`,
      buttons: {
        "Ok": {
          label: "Next",
          callback: handleEffectDestination
        }
      }
    });

    krasisDialog.render(true);
  } catch (err) {
    let errorDialog = new Dialog({
      title: "Krasis",
      content: `<h2>Krasis Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
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

const onEffectCreation = () => {
  const onUpdateActor = (eventActor, eventData, eventOptions, eventUserId) => {
    if (actor.name === "Noulith") return;
    if (actor.uuid !== eventActor.uuid) return;
    if (!eventData.system?.attributes?.hp?.value) return;
    if (!eventOptions.dhp || eventOptions.dhp < 0 && !eventOptions.damageItem && !eventOptions.damageItem.hpDamage > 0) return;

    const healingBoxStyle = `
      flex: 0 0 100%;
      position: relative;
      margin: 0;
      line-height: 24px;
      text-align: center;
      background: rgba(0, 0, 0, 0.1);
      border: 1px solid var(--attribute-bar-secondary-color);
      border-radius: 3px;
      box-shadow: 0 0 2px #FFF inset;
      word-break: break-all;
      margin-bottom: 10px;
      font-size: var(--font-size-20);
      font-weight: bold;
      color: var(--attribute-bar-primary-color);`

    const krasisNouliths = game.canvas.tokens.placeables.filter(token => {
      const hasKrasisFlag = token.actor.getFlag("world", "Krasis");
      return (token.name === "Noulith" && hasKrasisFlag && hasKrasisFlag.targetUuid === actor.uuid)
    })
    if (!krasisNouliths.length) {
      game.dfreds.effectInterface.removeEffect({ effectName: "Krasis", uuid: actor.uuid });
      return;
    }

    ChatMessage.create({
      user: game.user.id,
      speaker: speaker,
      content: `
        <div style = "display: flex; align-items: center; gap: 10px;" >
              <img width="36px" src="worlds/fantasy-dungeons/itens/Features%20and%20Spells/Krasis.png" title="Aurora" />
              <h3 style="font-family: Modesto Condensed, Palatino Linotype, serif; flex: 1; border-bottom: unset;">
                  <div style="display:flex; align-items:center;">Krasis</div>
              </h3>
          </div >
          <p style="font-size:12px; text-align:center; margin-bottom:0;">Healing</p>
          <div style="${healingBoxStyle}">${krasisNouliths.length}</div>
      `
    })
    actor.update({ "system.attributes.hp.value": Math.min(actor.system.attributes.hp.value + krasisNouliths.length, actor.system.attributes.hp.max) })
  }
  const myHookId = Hooks.on('updateActor', onUpdateActor.bind(this));
  actor.setFlag('world', 'Krasis', { hook: myHookId });
}

const onEffectDeletion = async () => {
  const krasisFlag = actor.getFlag('world', 'Krasis');
  if (!krasisFlag) return;

  await actor.unsetFlag('world', 'Krasis');

  if (actor.name !== "Noulith") {
    const krasisNouliths = game.canvas.tokens.placeables.filter(token => {
      const hasKrasisFlag = token.actor.getFlag("world", "Krasis");
      return (token.name === "Noulith" && hasKrasisFlag && hasKrasisFlag.targetUuid === actor.uuid)
    })
    Hooks.off('updateActor', krasisFlag.hook);
    tokenAttacher.detachElementsFromToken(krasisNouliths, token);
    krasisNouliths.forEach(noulithToken => {
      noulithToken.setTarget(true, { releaseOthers: false })
    })
    game.macros.getName("Recall Noulith").execute();
  } else {
    token.setTarget(true, { releaseOthers: true })
    game.macros.getName("Recall Noulith").execute();
  }
}