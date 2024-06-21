try {
    const CONVENIENT_EFFECTS = [
        "Elemental Blessing - Damage Change",
        "Elemental Blessing - Attack Bonus",
        "Elemental Blessing - Bonus Damage"
    ];
    const EFFECT_DESCRIPTIONS = [
        'The damage type of the weapon changes to cold, radiant or thunder.',
        'The weapon gains a +1 bonus on attack rolls.',
        "The weapon's damage rolls deal bonus damage equal to your proficiency bonus."
    ];

    const confession = actor.items.find(i => i.name === 'Secret of the Lily');
    if (!confession) {
        throw new Error('You dont have a Secret of the Lily Feature');
    }

    const uses = confession.system.uses.value;
    if (!uses) {
        throw new Error('No charges of Lily to use');
    }

    let buttons = new Array(uses).fill({
        label: 0,
        callback: () => { }
    });

    const target = game.user.targets.first();
    if (!target) {
        throw new Error('You need to select a target to complete the action');
    }
    let targetItem;

    const handleButtonCallback = (charges) => {
        const uuid = target.actor.uuid;
        const mod = item.actor.system.abilities.wis.mod || 1;
        const casterProf = item.actor.system.attributes.prof;
        let copy_item = duplicate(targetItem.toObject(false));

        const checkAndApplyEffect = async (effect) => {
            const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied(effect, uuid);

            if (!hasEffectApplied) {
                const effectData = game.dfreds.effectInterface.findEffectByName(effect).data.toObject();
                effectData.duration.seconds = mod * 6;
                game.dfreds.effectInterface.addEffectWith({ effectData, uuid });
            }
        }

        const applyDamageEffect = async (type) => {
            DAE.setFlag(target.actor, "elementalblessing", {
                "_id": targetItem._id,
                "system.damage": copy_item.system.damage,
                "system.ability": copy_item.system.ability,
                "system.properties.mgc": copy_item.system.properties.mgc,
                "name": copy_item.name
            }).then(() => {
                copy_item.system.damage.parts[0][1] = type;
                if (charges >= 2) {
                    copy_item.system.attackBonus = 1;
                    checkAndApplyEffect(CONVENIENT_EFFECTS[1]);
                }
                if (charges >= 3) {
                    copy_item.system.damage.parts[0][0] = copy_item.system.damage.parts[0][0] + ` + ${casterProf}`;
                    checkAndApplyEffect(CONVENIENT_EFFECTS[2]);
                }

                copy_item.system.properties.mgc = true;
                copy_item.name = `${copy_item.name} (Elemental Blessed)`;
                target.actor.updateEmbeddedDocuments("Item", [copy_item]);
                checkAndApplyEffect(`Elemental Blessing - ${type} Damage`);

                confession.update({ 'system.uses.value': uses - charges });
            });
        }

        let elementDamageDialog = new Dialog({
            title: "Elemental Blessing",
            content: `<p>Select the elemento for the selected weapon:</p>`,
            buttons: {
                cold: {
                    label: "Cold",
                    callback: () => applyDamageEffect("Cold")
                },
                radiant: {
                    label: "Radiant",
                    callback: () => applyDamageEffect("Radiant")
                },
                thunder: {
                    label: "Thunder",
                    callback: () => applyDamageEffect("Thunder")
                }
            }
        });

        elementDamageDialog.render(true);
    };

    let buttonsObject = {};
    buttons = buttons.forEach((b, index) => {
        if (index >= 3) return;

        buttonsObject = {
            ...buttonsObject, [`button${index}`]: {
                label: index + 1,
                callback: () => handleButtonCallback(index + 1)
            }
        };
    });

    const htmlEffects = EFFECT_DESCRIPTIONS.map(e => "<li>" + e + "</li>").join('');

    let confessionChargeDialog = new Dialog({
        title: "Elemental Blessing",
        content: `<p>Select how many charges of Lily you want to use</p>
         <p><ol>
             ${htmlEffects}
         </ol></p>`,
        buttons: buttonsObject
    });


    let weapons = target.actor.items.filter(i => i.type === "weapon" && i.system.equipped);
    let weapon_content = ``;
    for (let weapon of weapons) {
        weapon_content += `<option value=${weapon.id}>${weapon.name}</option>`;
    }
    let selectWeaponDialog = new Dialog({
        title: "Elemental Blessing",
        content: `<div class="form-group">
                        <label>Select the weapon to empower: </label>
                        <br /><br />
                        <select name="weapons">
                            ${weapon_content}
                        </select>
                        <br /><br />
                    </div>`,
        buttons: {
            "Ok": {
                label: "Ok",
                callback: (html) => {
                    const itemId = html.find('[name=weapons]')[0].value;
                    if (!itemId) throw new Error("There was no weapon selected");

                    targetItem = target.actor.items.get(itemId);
                    console.log(itemId, targetItem)
                    confessionChargeDialog.render(true);
                }
            }
        }
    });

    selectWeaponDialog.render(true);

} catch (err) {
    let errorDialog = new Dialog({
        title: "Elemental Blessing",
        content: `<h2>Elemental Blessing Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
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