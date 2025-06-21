const handleConfirm = () => {
  const characters = game.actors.filter((actor) => actor.type === "character");

  let finalLBValue = 0;

  characters.forEach((character) => {
    if (character.system.resources.tertiary.label !== "Limit Break") return;

    const LBValue = character.system.resources.tertiary.value || 0;
    finalLBValue = Math.min(LBValue + 1, 9);

    character.update({ "system.resources.tertiary.value": finalLBValue });
  });

  const tataruActor = game.actors.find(
    (actor) => actor.id === "ylVFkMeFBZIxoLTt"
  );

  if (finalLBValue === 3 || finalLBValue === 6) {
    AudioHelper.play(
      {
        src: "worlds/fantasy-dungeons/sounds/FFXIV_Limit_Break_Unlocked.mp3",
        volume: 1,
        autoplay: true,
        loop: false,
      },
      true
    );

    ChatMessage.create({
      user: null,
      speaker: ChatMessage.getSpeaker({ actor: tataruActor }),
      content: `<p>Our party Limit Break points increased by 1</p><p><b>Limit Break Stage ${Math.ceil(
        finalLBValue / 3
      )} available!</b>`,
    });
  } else if (finalLBValue === 9) {
    AudioHelper.play(
      {
        src: "worlds/fantasy-dungeons/sounds/FFXIV_Limit_Break_Charged.mp3",
        volume: 1,
        autoplay: true,
        loop: false,
      },
      true
    );

    ChatMessage.create({
      user: null,
      speaker: ChatMessage.getSpeaker({ actor: tataruActor }),
      content: `<p>Our party Limit Break points increased by 1</p><p><b>Limit Break Stage 3 available!!!</b>`,
    });
  } else {
    ChatMessage.create({
      user: null,
      speaker: ChatMessage.getSpeaker({ actor: tataruActor }),
      content: `<p>Our party Limit Break points increased by 1</p><p><b>We have ${finalLBValue} Limit Break points.</b>`,
    });
  }
};

let limitBreakDialog = new Dialog({
  title: "Limit Break Up",
  content: `<p>Confirm the Limit Break Up</p>`,
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
