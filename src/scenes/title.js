import { colorPallete } from "../config";
import { addPowerups } from "../objects/powerups"
import { addTextBox } from "../helpers"
import { addBackground } from "./background"

export function title(k) {
    return k.scene("title", () => {
        let fadeOut = false;
        
        const onStartFn = () => {
            if (fadeOut) return;
            fadeOut = true;
            slideOutTitle(k, () => k.go("game"));
        };

        addBackground(k)
        k.add([
            k.sprite("picnic"),
            k.pos(k.width()/2, 220),
            k.anchor("center"),
        ]);
        addPowerups(k, {
            onSelect: (startScale) => addStartButton(k, startScale, onStartFn),
            sceneTransition: () => fadeOut,
        })
    })
}

function addStartButton(k, startScale, onStart) {
    const startGame = addTextBox(k, "Start the Day", 300, colorPallete.red, colorPallete.white, { size: 16 }, [
        k.area(),
        k.outline(2, k.Color.fromHex(colorPallete.white)),
        "startGame"
    ], startScale)
    startGame.onUpdate(() => {
        if (startGame.isHovering()) return;
        startGame.scale = k.vec2(k.wave(0.95, 1.05, k.time() * 2));
    });
    startGame.onClick(() => {
        startGame.tween(k.vec2(1.2, 0.8), k.vec2(1), 0.3, (s) => startGame.scale = s, k.easings.easeOutElastic);
        startGame.wait(0.3, onStart);
    });
    return startGame
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
