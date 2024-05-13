if (args[0] === 'on') {
    const updates = actor.items
        .filter(
            (i) =>
                i.type === 'spell' &&
                i.system.range.units === 'touch' &&
                i.system.preparation.prepared
        )
        .map((s) => {
            return {
                _id: s.id,
                name: `${s.name}: (Reach of the Unseen)`,
                'system.range': { long: null, units: 'ft', value: 30 },
            };
        });
    const touchSpellIds = updates.map((i) => i._id);
    await actor.setFlag('world', 'touchSpells', touchSpellIds);
    await actor.updateEmbeddedDocuments('Item', updates);
}
if (args[0] === 'off') {
    const updates = actor.getFlag('world', 'touchSpells').map((s) => {
        return {
            _id: s,
            name: actor.items.get(s).name.split(':')[0],
            'system.range': { value: null, long: null, units: 'touch' },
        };
    });
    await actor.updateEmbeddedDocuments('Item', updates);
}