const data = args[0];
const castLevel = data.castData.castLevel;
const hpIncrease = (castLevel - 1) * 5;

const effectData = game.dfreds.effectInterface.findEffect({ effectName: 'Aid Effect' }).toObject();
effectData.name = 'Aid';
effectData.changes = effectData.changes.map(change => ({
    ...change,
    value: effectData.changes[0].value.replace('%h', hpIncrease)
}));
effectData.description = effectData.description.replace('%h', hpIncrease);

const targets = game.user.targets;
targets.forEach(target => {
    game.dfreds.effectInterface.addEffect({ effectData, uuid: target.actor.uuid });
})
