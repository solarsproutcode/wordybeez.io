import { colorPallete } from "../config";
import { addPowerups } from "../objects/powerups"
import { addTextBox } from "../helpers"
import { addBackground } from "./background"

export function title(k) {
    return k.scene("title", () => {
        addBackground(k)
        k.add([
            k.sprite("picnic"),
            k.pos(k.width()/2, 220),
            k.anchor("center"),
        ]);
        let fadeOut = false;
        const onStartFn = () => {
            if (fadeOut) return;
            fadeOut = true;
            slideOutTitle(k, () => k.go("game"));
        };
        // shown faded from the start, comes to full opacity once a powerup is picked
        const startGame = addStartButton(k, onStartFn);
        addPowerups(k, {
            onSelect: () => setStartReady(startGame),
            sceneTransition: () => fadeOut,
        })
    })
}

function addStartButton(k, onStart) {
    const startGame = addTextBox(k, "Start the Day", 300, colorPallete.red, colorPallete.white, { size: 16 }, [
        k.area(),
        k.outline(2, k.Color.fromHex(colorPallete.white)),
        k.opacity(0.4),
        "startGame",
        { ready: false },
    ], 1)
    // the text doesn't take the box's opacity, so give it its own
    startGame.children[0].use(k.opacity(0.4));

    startGame.onClick(() => {
        if (!startGame.ready) return; // no powerup picked yet
        startGame.tween(k.vec2(1.2, 0.8), k.vec2(1), 0.3, (s) => startGame.scale = s, k.easings.easeOutElastic);
        startGame.wait(0.3, onStart);
    });
    return startGame
}

// full opacity and clickable
function setStartReady(startGame) {
    startGame.ready = true;
    startGame.opacity = 1;
    startGame.children[0].opacity = 1;
}

function slideOutTitle(k, onDone) {
    const duration = 0.5;
    const stagger = 0.15;
    const startDelay = 0.4;
    const objs = k.get("*").filter((obj) => obj.has("pos") && !obj.is("background"));
    for (const obj of objs) {
        // start button leaves last
        const delay = obj.is("startGame")
            ? startDelay
            // left most will be less delay, right will be more
            : k.clamp(obj.pos.x / k.width(), 0, 1) * stagger;
        k.wait(delay, () => {
            const startX = obj.pos.x;
            // ensure all objs move at same speed
            const endX = startX - k.width() - obj.width;
            k.tween(startX, endX, duration, (x) => obj.pos.x = x, k.easings.easeInBack);
        });
    }
    k.wait(duration + startDelay, onDone);
}
