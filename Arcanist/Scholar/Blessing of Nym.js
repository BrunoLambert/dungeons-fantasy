const findingTokens = canvas.tokens.ownedTokens.filter(token => ['Selene', 'Eos'].includes(token.document.name));
const atherialCompanionToken = findingTokens[0]?.document;

const source = token;
const destiny = atherialCompanionToken;

new Sequence()
    .effect()
    .file("jb2a.misty_step.01.blue")
    .atLocation(source)
    .scale(0.3)
    .randomRotation()
    .wait(500)
    .animation()
    .on(source)
    .teleportTo(destiny)
    .play()

new Sequence()
    .effect()
    .file("jb2a.misty_step.02.blue")
    .atLocation(destiny)
    .scale(0.3)
    .randomRotation()
    .wait(500)
    .animation()
    .on(destiny)
    .teleportTo(source)
    .play()