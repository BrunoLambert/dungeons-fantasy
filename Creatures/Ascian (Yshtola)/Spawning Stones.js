const positions = [
    { x: 650, y: 450 },
    { x: 1350, y: 450 },
    { x: 2050, y: 450 },
    { x: 2750, y: 450 },
    { x: 450, y: 650 },
    { x: 450, y: 1350 },
    { x: 450, y: 2050 },
    { x: 450, y: 2750 }
]

const iceEffect = 'jb2a.template_circle.out_pulse.02.burst.bluewhite';
const fireEffect = 'jb2a.explosion.01.orange';

const stoneNames = ['Fire Stone', 'Ice Stone'];

let fireCount = 0;
let iceCount = 0;
let mode = 'hard'
const MAX_SPHERE = {
    hard: 4,
    normal: 2
}

const spawnStone = async (x, y) => {
    const stoneRoll = await new Roll(`1d100`).roll();
    // 1: Ice Stone
    // 0: Fire Stone
    let stonePosition = stoneRoll.total % 2 ? 1 : 0

    if (stonePosition) {
        if (iceCount >= MAX_SPHERE[mode]) stonePosition = 0
        else iceCount++;
    } else {
        if (fireCount >= MAX_SPHERE[mode]) stonePosition = 1
        else fireCount++;
    }

    const sphereName = stoneNames[stonePosition];

    const [spawnedCreature] = await warpgate.spawnAt({ x, y }, sphereName, { token: { alpha: 0 } });

    const animation = new Sequence()
        .wait(200)
        .effect()
        .file(stonePosition ? iceEffect : fireEffect)
        .atLocation(spawnedCreature)
        .duration(2000)
        .scale(1)
        .animation()
        .on(spawnedCreature)
        .opacity(1.0)

    await animation.play();
    await warpgate.wait(100);
}

const spawningStones = async (isHard = false) => {
    if (isHard) {
        positions.forEach(async (position) => {
            await spawnStone(position.x, position.y);
        })
    } else {
        mode = 'normal';
        const stoneRoll = await new Roll(`1d100`).roll();
        // 1: Vertical
        // 0: Horizontal
        let stoneStartPosition = (stoneRoll.total % 2 ? 1 : 0) * 4

        for (let i = 0; i < 4; i++) {
            await spawnStone(positions[stoneStartPosition].x, positions[stoneStartPosition].y)
            stoneStartPosition++;
        }
    }

    const yshtolaActor = game.actors.find(actor => actor.id === 'atsm1DM68Cdckr0v');
    ChatMessage.create({
        user: null,
        speaker: ChatMessage.getSpeaker({ actor: yshtolaActor }),
        content: `<p><b>You all are gonna be wash out!</b></p>`
    });
}

let spawningDialog = new Dialog({
    title: "Spawning Stones",
    content: `Choose the mode`,
    buttons: {
        yes: {
            label: "Normal",
            callback: () => { spawningStones(false) }
        },
        no: {
            label: "Hard",
            callback: () => { spawningStones(true) }
        },
    }
});

spawningDialog.render(true);

