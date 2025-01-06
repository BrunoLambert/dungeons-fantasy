const applyDamageEffect = async (isEmpowered) => {
    const effectName = isEmpowered ? 'Enwater (Empowered)' : 'Enwater (Normal)';
    const uuid = item.actor.uuid;
    const pb = item.actor.system.attributes.prof;

    const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied({ effectName, uuid });

    if (!hasEffectApplied) {
        const effectData = game.dfreds.effectInterface.findEffect({ effectName }).toObject();
        effectData.duration.seconds = pb * 6;
        game.dfreds.effectInterface.addEffect({ effectData, uuid });
    }
}

let enwaterDialog = new Dialog({
    title: "Trident of Sahagin Prince",
    content: `
        <p>Your are about to use Enwater feature from the Trident of Sahagin Prince</p>
        <p>Now, if there is a water source as described at the item you need to tell me</p><br />
    `,
    buttons: {
        yes: {
            label: "Yes, there is.",
            callback: () => applyDamageEffect(true)
        },
        no: {
            label: "No, it is dry here",
            callback: () => applyDamageEffect(false)
        },
    }
});

enwaterDialog.render(true);