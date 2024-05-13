// Effect on Starting Round
let warningDialog = new Dialog({
    title: "Call to Ocean",
    content: `<p>You have creature to spawns</p>`,
    buttons: {
        button1: {
            label: 'Ok',
            callback: () => { },
        }
    }
});
warningDialog.render(true);
game.togglePause();

const uuid = actor.uuid
const effectName = 'Call to Ocean';

const hasEffectApplied = await game.dfreds.effectInterface.hasEffectApplied(effectName, uuid);
if (hasEffectApplied) {
    game.dfreds.effectInterface.removeEffect({ effectName, uuid });
}