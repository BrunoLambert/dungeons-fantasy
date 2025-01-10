if (args[0] === 'on') {
    try {
        const sourceActor = game.actors.find(char => char.uuid === args[1].origin.split(".Item")[0]);
        const sourceActorUser = game.users.get(Object.keys(sourceActor.ownership).filter(key => !["Dq4GUDk42WtKambg", "default"].includes(key))[0])
        const target = sourceActorUser.targets.first();
        if (!target) {
            throw new Error('You need to select a target first');
        }

        const targetIsSelf = target.actor.uuid === sourceActor.uuid;
        let SOURCE_AURORA_DETAILS = sourceActor.getFlag('world', 'Gunbreak:Aurora');

        if (SOURCE_AURORA_DETAILS && !targetIsSelf) {
            SOURCE_AURORA_DETAILS.duration = 2;
            SOURCE_AURORA_DETAILS.item = item.name;

            await target.actor.setFlag('world', SOURCE_AURORA_DETAILS.flag, SOURCE_AURORA_DETAILS);

            const effectData = game.dfreds.effectInterface.findEffect({ effectName: 'Aurora' }).toObject();
            effectData.description = effectData.description.replace('%hp', SOURCE_AURORA_DETAILS.healing);
            effectData.description = effectData.description.replace('%r', SOURCE_AURORA_DETAILS.duration);
            game.dfreds.effectInterface.addEffect({ effectData, uuid: target.actor.uuid });
        }
    } catch (err) {
        let errorDialog = new Dialog({
            title: "Heart of Stone",
            content: `<h2>Heart of Stone Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
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