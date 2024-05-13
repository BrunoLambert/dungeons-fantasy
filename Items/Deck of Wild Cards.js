if (!args[0].hitTargetUuids.length) return;

const effectsActions = [
    'Rods',
    'Coins',
    'Cups',
    'Swords'
].map(e => 'Deck of Wild Cards - ' + e);

const effectRoll = await new Roll('1d4 - 1').roll();
const itemName = effectsActions[effectRoll.total];

let c_item = game.items.find(i => i.name === itemName);

let c_item_3 = await Item.create(c_item, { parent: actor })
c_item_3.use();