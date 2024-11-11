// On attack rolls
const isHit = this.roll.total >= game.user.targets.first().actor.system.attributes.ac.value;
if (!isHit) return;

const triggerProvoke = () => {
  const provokeItem = actor.items.find(item => item.name === "Provoke");
  if (provokeItem) {
    provokeItem.use();
  }
}

let provokeDialog = new Dialog({
  title: "Povoke",
  content: `
      <p>You just hit an attack roll, you may trigger the Provoke usage</p>
      <br/>
  `,
  buttons: {
    'yes': {
      label: "Yes, trigger it",
      callback: triggerProvoke
    },
    'no': {
      label: "No, not now"
    }
  }
});
provokeDialog.render(true);

// On turn starting
const provoke2Item = actor.items.find(i => i.name === 'Provoke II');
if (!provoke2Item.system.recharge.charged) {
  provoke2Item.rollRecharge();
}