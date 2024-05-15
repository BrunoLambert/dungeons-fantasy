actor.sheet.close();

const variableDistance = game.canvas.dimensions.size / 2;
const rangeValue = item.system.range.value;

const sizeIncrease = {
    lg: 5,
}

const increase = sizeIncrease[token.actor.system.traits.size] || 0

let templateData = {
    ...token.center,
    t: "circle",
    user: game.user._id,
    distance: rangeValue + increase,
    borderColor: "#000000",
    fillColor: game.user.color,
};

let theTemplate = await MeasuredTemplateDocument.create(templateData, { parent: canvas.scene });

const [spawnedCreature] = await warpgate.spawn("The Whorl Blessing", { token: { alpha: 0 } });
game.canvas.scene.deleteEmbeddedDocuments('MeasuredTemplate', [theTemplate._id]);

const animation = await new Sequence()
    .wait(200)
    .effect()
    .file("jb2a.liquid.splash.blue")
    .atLocation(spawnedCreature)
    .wait(900)
    .animation()
    .on(spawnedCreature)
    .opacity(1.0)
    .play()

actor.sheet.open();