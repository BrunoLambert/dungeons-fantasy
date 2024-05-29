const damage = args[0].damageList[0]

if (!damage.wasHit) return;

const recovering = Math.ceil(damage.totalDamage / 2);

actor.update({"system.attributes.hp.value": Math.min(actor.system.attributes.hp.value + recovering, actor.system.attributes.hp.max) });

ChatMessage.create({
    user: game.user.id,
    speaker: speaker,
    content: `<p><b>Lancet</b> recupera <b>${recovering} de pontos de vida.</b></p>`
})