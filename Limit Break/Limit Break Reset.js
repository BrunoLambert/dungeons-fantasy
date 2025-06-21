const handleConfirm = () => {
  const characters = game.actors.filter((actor) => actor.type === "character");

  characters.forEach((character) => {
    if (character.system.resources.tertiary.label !== "Limit Break") return;

    character.update({ "system.resources.tertiary.value": 0 });
  });

  const tataruActor = game.actors.find(
    (actor) => actor.id === "ylVFkMeFBZIxoLTt"
  );

  ChatMessage.create({
    user: null,
    speaker: ChatMessage.getSpeaker({ actor: tataruActor }),
    content: `<p>All Limit Break Points were lost.</p>`,
  });
};

let limitBreakDialog = new Dialog({
  title: "Limit Break RESET",
  content: `<p>Confirm the update of Limit Break <b>RESET</b></p>`,
  buttons: {
    one: {
      icon: '<i class="fas fa-check"></i>',
      label: "Confirm",
      callback: () => handleConfirm(),
    },
    two: {
      icon: '<i class="fas fa-close"></i>',
      label: "Cancel",
      callback: () => {},
    },
  },
  default: "two",
});

limitBreakDialog.render(true);
