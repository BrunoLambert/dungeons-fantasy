const handleConfirm = () => {
  const characters = game.actors.filter((actor) => actor.type === "character");
  const tataruActor = game.actors.find(
    (actor) => actor.id === "ylVFkMeFBZIxoLTt"
  );

  const higherCharge = Math.max(
    ...characters.map((char) => char.system.resources.tertiary.value || 0)
  );
  const newCharge = Math.floor(higherCharge / 2);

  characters.forEach((character) => {
    if (character.system.resources.tertiary.label !== "Limit Break") return;

    character.update({ "system.resources.tertiary.value": newCharge });
  });

  ChatMessage.create({
    user: null,
    speaker: ChatMessage.getSpeaker({ actor: tataruActor }),
    content: `<p>In a Long Rest, the party Limit Break points are cut in half (rounded down).</p><p><b>Now the party has ${newCharge} Limit Break points.</b></p>`,
  });
};

let limitBreakDialog = new Dialog({
  title: "Limit Break Long Rest",
  content: `<p>Confirm the update of Limit Break for Long Rests</p>`,
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
