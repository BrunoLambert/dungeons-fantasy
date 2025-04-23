// On effect deletion of Dragon Sight
const onOpratingEffectDeletion = async () => {
    const character = actor;
    const draconianItem = character.items.find(item => item.name === "Draconian Fury");
  
    if (!draconianItem || !character) return;

    await draconianItem.update({
      "system.uses.max": Math.max(draconianItem.system.uses.max, draconianItem.system.uses.value + 1),
      "system.uses.value": draconianItem.system.uses.value + 1
    });
  }