const positions = [750, 1350, 1950, 2550]

const iceEffect = 'jb2a.template_circle.out_pulse.02.burst.bluewhite';
const fireEffect = 'jb2a.explosion.01.orange';

const sphereNames = ['Fire Sphere', 'Ice Sphere'];

let fireCount = 0;
let iceCount = 0;
let mode = 'hard';

const MAX_SPHERE = {
    hard: 8,
    normal: 4
}

const spawnSphere = async (x, y) => {
    const sphereRoll = await new Roll(`1d100`).roll();
    // 1: Ice Sphere
    // 0: Fire Sphere
    let spherePosition = sphereRoll.total % 2 ? 1 : 0

    if (spherePosition) {
        if (iceCount >= MAX_SPHERE[mode]) spherePosition = 0
        else iceCount++;
    } else {
        if (fireCount >= MAX_SPHERE[mode]) spherePosition = 1
        else fireCount++;
    }

    const sphereName = sphereNames[spherePosition];

    const [spawnedCreature] = await warpgate.spawnAt({ x, y }, sphereName, { token: { alpha: 0 } });

    const animation = new Sequence()
        .wait(200)
        .effect()
        .file(spherePosition ? iceEffect : fireEffect)
        .atLocation(spawnedCreature)
        .duration(2000)
        .scale(1)
        .animation()
        .on(spawnedCreature)
        .opacity(1.0)

    await animation.play();
    await warpgate.wait(100);
}

const spawningSpheres = async (isHard = false) => {
    if (isHard) {
        for (let x = 0; x < 4; x++) {
            for (let y = 0; y < 4; y++) {
                await spawnSphere(positions[x], positions[y]);
            }
        }
    } else {
        mode = 'normal';
        let spawns = []
        const spawnedPositions = []

        positions.forEach(xPosition => {
            positions.forEach(yPosition => {
                spawns.push({ x: xPosition, y: yPosition });
            })
        })

        for (let x = 0; x < 8; x++) {
            let positionRoll = null;
            do {
                positionRoll = await new Roll(`1d${spawns.length}`).roll();
            } while (spawnedPositions.includes(positionRoll.total));

            spawnedPositions.push(positionRoll.total);

            await spawnSphere(spawns[positionRoll.total - 1].x, spawns[positionRoll.total - 1].y)
        }
    }

    const yshtolaActor = game.actors.find(actor => actor.id === 'atsm1DM68Cdckr0v');
    ChatMessage.create({
        user: null,
        speaker: ChatMessage.getSpeaker({ actor: yshtolaActor }),
        content: `<p><b>you're all going to explode!</b></p>`
    });
}

let spawningDialog = new Dialog({
    title: "Spawning Spheres",
    content: `Choose the mode`,
    buttons: {
        yes: {
            label: "Normal",
            callback: () => spawningSpheres(false)
        },
        no: {
            label: "Hard",
            callback: () => spawningSpheres(true)
        },
    }
});

spawningDialog.render(true);
