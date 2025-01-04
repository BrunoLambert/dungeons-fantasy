
const onUsingItem = async () => {
    const summonedCreature = item.system.summons.summonedCreatures[0];
    if (!summonedCreature) return;

    const EGI_NAMES = {
        ifrit: "Ifrit Egi",
        titan: "Titan Egi",
        garuda: "Garuda Egi"
    };
    const specialEffects = {
        [EGI_NAMES.ifrit]: "jb2a.cast_generic.fire.01.orange",
        [EGI_NAMES.titan]: "jb2a.cast_generic.earth.01.browngreen",
        [EGI_NAMES.garuda]: "jb2a.cast_generic.01.yellow"
    }
    const cantrip = {
        [EGI_NAMES.ifrit]: "Fire Bolt",
        [EGI_NAMES.titan]: "Stone Blast",
        [EGI_NAMES.garuda]: "Shocking Grasp"
    }
    const effects = {
        [EGI_NAMES.ifrit]: "Egi's Boon: Ifrit",
        [EGI_NAMES.titan]: "Egi's Boon: Titan",
        [EGI_NAMES.garuda]: "Egi's Boon: Garuda"
    }

    const handleSelect = async (egiName) => {
        actor.sheet.close();

        const hasEffectApplied = {
            [EGI_NAMES.ifrit]: await game.dfreds.effectInterface.hasEffectApplied(effects[EGI_NAMES.ifrit], actor.uuid),
            [EGI_NAMES.titan]: await game.dfreds.effectInterface.hasEffectApplied(effects[EGI_NAMES.titan], actor.uuid),
            [EGI_NAMES.garuda]: await game.dfreds.effectInterface.hasEffectApplied(effects[EGI_NAMES.garuda], actor.uuid),
        }
        Object.keys(hasEffectApplied).forEach(key => {
            if (hasEffectApplied[key]) {
                game.dfreds.effectInterface.removeEffect({ effectName: effects[key], uuid: actor.uuid });
            }
        })

        const spawnedEgi = summonedCreature.token;

        await new Sequence()
            .wait(200)
            .effect()
            .file(specialEffects[egiName])
            .atLocation(spawnedEgi)
            .wait(500)
            .animation()
            .on(spawnedEgi)
            .opacity(1.0)
            .play()

        const itemData = game.items.find(item => item.name === cantrip[egiName]).toObject();
        itemData.name = `${itemData.name} (${egiName})`;
        await Item.create(itemData, { parent: actor });

        game.dfreds.effectInterface.addEffect({ effectName: effects[egiName], uuid: actor.uuid });

        Hotbar.toggleDocumentSheet(actor.uuid)
    }

    handleSelect(item.system.summons.summonedCreatures[0].name)
}

const onEffectDeletion = async () => {
    const cantrips = ["Fire Bolt", "Stone Blast", "Shocking Grasp"];

    canvas.tokens.ownedTokens.filter(token => (
        token.document.name.toLowerCase().search(/ifrit|garuda|titan/gm) >= 0 &&
        token.actor.system.details.type.subtype === "Egi"
    )).forEach(async (token) => {
        await new Sequence()
            .wait(200)
            .effect()
            .file("jb2a.particle_burst.01.circle.bluepurple")
            .atLocation(token)
            .scale(0.5)
            .wait(1750)
            .play();
        token.document.delete();
    })

    actor.items.filter(item => item.name.search("Egi") >= 0).forEach(item => {
        const isAEgiCantrip = cantrips.reduce((prev, curr) => (prev || item.name.search(curr) >= 0), false)
        if (!isAEgiCantrip) return;
        item.delete();
    });
}