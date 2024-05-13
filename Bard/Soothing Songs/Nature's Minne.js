try {
    let NaturesMinneEffect = actor.items.find(i => i.name === "Nature's Minne");
    if (!NaturesMinneEffect) throw new Error('You dont have a Nature Minne Feature');

    const continueCallback = () => {
        console.log(NaturesMinneEffect)
        NaturesMinneEffect.use();
    }

    let cardDialog = new Dialog({
        title: "Soothing Song: Nature's Minne",
        content: `<h2>On the start of your turn you and all your allies in range <b>recover 1d4 hp</b>.</h2><br/>`,
        buttons: {
            one: {
                icon: '<i class="fas fa-check"></i>',
                label: "Recover!",
                callback: continueCallback
            },
        },
        default: "one",
    });

    cardDialog.render(true);
} catch (error) {
    let errorDialog = new Dialog({
        title: "Soothing Song: Nature's Minne",
        content: `<h2>Soothing Song: Nature's Minne Failed</h2><p>${err.toString().split('Error: ')[1]}</p><br/>`,
        buttons: {
            button1: {
                label: 'Ok',
                callback: () => { },
            }
        }
    });

    errorDialog.render(true);
    game.macros.getName("ClearLastMessage").execute();
}