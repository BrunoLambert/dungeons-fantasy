const findingTokens = canvas.tokens.ownedTokens.filter(token => token.document.name.toLowerCase().search(/ifrit|garuda|titan/gm) >= 0);
const atherialCompanionToken = findingTokens[0]?.document;

const source = token;
const destiny = atherialCompanionToken;

new Sequence()
    .effect()
    .file("jb2a.particle_burst.01.star")
    .atLocation(source)
    .scale(0.4)
    .randomRotation()
    .wait(900)
    .animation()
    .on(source)
    .teleportTo(destiny)
    .play()

new Sequence()
    .effect()
    .file("jb2a.particle_burst.01.circle")
    .atLocation(destiny)
    .scale(0.4)
    .randomRotation()
    .wait(900)
    .animation()
    .on(destiny)
    .teleportTo(source)
    .play()