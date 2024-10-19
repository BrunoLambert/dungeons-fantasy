if (args[0] === 'on') {
  const updates = actor.items.filter(
    (i) => {
      let hasHealDamage = false;
      if (i.system?.damage?.parts && i.system?.damage?.parts.length > 0) {
        hasHealDamage = i.system.damage.parts.reduce((acc, curr) => (acc || curr.includes('healing')), false)
      }

      if (i.type === 'feat') {
        return i.system.actionType === "heal"
      }

      return i.type === 'spell' && hasHealDamage
    }
  ).map((s) => {
    if (s.type == 'spell' || (s.system?.damage?.parts && s.system?.damage?.parts.length > 0)) {
      return {
        _id: s.id,
        name: `Eukrasian ${s.name}`,
        'system.damage.parts': s.system.damage.parts.map(part => {
          let tmp = part.join('%b');
          tmp = tmp.replace("healing", "temphp");
          return tmp.split('%b');
        }),
      };
    }

    return {
      _id: s.id,
      name: `Eukrasian ${s.name}`,
    };

  });
  const eukrasianSpells = updates.map((i) => i._id);
  await actor.setFlag('world', 'EukrasianSpells', eukrasianSpells);
  await actor.updateEmbeddedDocuments('Item', updates);
}
if (args[0] === 'off') {
  const updates = actor.getFlag('world', 'EukrasianSpells').map((s) => {
    const item = actor.items.get(s);

    if (item.type == 'spell' || (item.system?.damage?.parts && item.system?.damage?.parts.length > 0)) {
      return {
        _id: s,
        name: item.name.split("Eukrasian ")[1],
        'system.damage.parts': item.system.damage.parts.map(part => {
          let tmp = part.join('%b');
          tmp = tmp.replace("temphp", "healing");
          return tmp.split('%b');
        }),
      };
    }

    return {
      _id: s,
      name: item.name.split("Eukrasian ")[1],
    };
  });

  await actor.updateEmbeddedDocuments('Item', updates);
}