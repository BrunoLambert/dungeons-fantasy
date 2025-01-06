actor.sheet.close();

const newLocation = await new Portal()
  .color(game.user.color.css)
  .texture(game.user.character.prototypeToken.texture.src)
  .origin(token)
  .range(actor.system.attributes.movement.walk)
  .pick()

await new Sequence()
  .effect()
  .file("jb2a.impact.ground_crack.still_frame")
  .atLocation(token)
  .elevation(0)
  .wait(100)
  .animation()
  .on(token)
  .duration(1000)
  .moveTowards(newLocation, { ease: "linear", delay: 0, relativeToCenter: true })
  .moveSpeed(1000)
  .snapToGrid()
  .waitUntilFinished()
  .effect()
  .file("jb2a.impact.ground_crack.orange")
  .scale(3)
  .atLocation(token)
  .scaleToObject()
  .play();

let jumpDialog = new Dialog({
  title: "Jump",
  content: `
        <p>After landing your jump, you can activate <b>Spineshatter Dive</b>.</p>
        <p>Do you like to use it?</p>
        <p><small><b>Remeber: it will end your Dragon Sight buff</b></small></p>
        <br/>
    `,
  buttons: {
    'yes': {
      label: "Yes, use it",
      callback: async () => {
        const spineshatterDiveItem = actor.items.find(item => item.name === "Spineshatter Dive");
        if (spineshatterDiveItem) {
          await spineshatterDiveItem.use();
        }
        Hotbar.toggleDocumentSheet(actor.uuid)
      }
    },
    'no': {
      label: "No, not now"
    }
  }
});
jumpDialog.render(true);