const boxStyle = `
    flex: 0 0 100%;
    position: relative;
    margin: 0;
    line-height: 24px;
    text-align: center;
    background: rgba(0, 0, 0, 0.1);
    border: 1px solid var(--color-border-light-2);
    border-radius: 3px;
    box-shadow: 0 0 2px #FFF inset;
    word-break: break-all;
    margin-bottom: 10px;
    font-size: var(--font-size-20);
    font-weight: bold;
`

const rollData = args[0];

const howManyTargets = rollData.hitTargets.length;

const totalDamage = args[0].damageTotal
const finalDamage = Math.ceil(totalDamage * ((howManyTargets - 1) / howManyTargets));

game.dfreds.effectInterface.removeEffect({ effectName: 'StackDamage', uuid: rollData.actor.uuid });

return ({ damageRoll: `-${finalDamage}`, flavor: `Stack Damage Reduce` });