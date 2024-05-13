const characters = game.actors.filter(actor => actor.type === "character");

let finalLBValue = 0;

characters.forEach(character => {
    if (character.system.resources.tertiary.label !== 'Limit Break') return;
    
    const LBValue = character.system.resources.tertiary.value || 0;
    finalLBValue = Math.min(LBValue + 1, 9);
    
    character.update({ 'system.resources.tertiary.value': finalLBValue });
});

const borunActor  = game.actors.find(actor => actor.id === 'qTobemlO2cxXi1HE');

if (finalLBValue === 3 || finalLBValue === 6) {
    AudioHelper.play({ src: "worlds/fantasy-dungeons/sounds/FFXIV_Limit_Break_Unlocked.mp3", volume: 1, autoplay: true, loop: false }, true);
    
    ChatMessage.create({
        user: null,
        speaker: ChatMessage.getSpeaker({ actor: borunActor }),
        content: `<p>Our party Limit Break points increased by 1</p><p><b>Limit Break Stage ${Math.ceil(finalLBValue / 3)} available!</b>`
    });
   
} else if (finalLBValue === 9) {
    AudioHelper.play({ src: "worlds/fantasy-dungeons/sounds/FFXIV_Limit_Break_Charged.mp3", volume: 1, autoplay: true, loop: false }, true);   
    
    ChatMessage.create({
        user: null,
        speaker: ChatMessage.getSpeaker({ actor: borunActor }),
        content: `<p>Our party Limit Break points increased by 1</p><p><b>Limit Break Stage 3 available!!!</b>`
    });
} else {
    ChatMessage.create({
        user: null,
        speaker: ChatMessage.getSpeaker({ actor: borunActor }),
        content: `<p>Our party Limit Break points increased by 1</p><p><b>We have ${finalLBValue} Limit Break points.</b>`
    });
}