import { colorPallete } from "../config";

export function addBackground(k) {
    k.destroyAll("background");
    k.add([
        k.sprite("background"),
        k.pos(0, 0),
        k.stay(), // stay is so new scenes don't clear this
        "background",
    ]);
    k.add([
        k.sprite("hive_header"),
        k.pos(0, 35),
        k.anchor("left"),
        k.stay(),
        "background"
    ]);
    k.add([
        k.text("WordyBeez", { size: 16, font: "04b30" }),
        k.pos(k.width()/2, 10),
        k.anchor("center"),
        k.color(colorPallete.darkBrown),
        k.stay(),
        "background"
    ]);
    addBee(k)
}

function addBee(k) {
    const b = k.add([
        k.sprite("bee", { anim: "fly" }),
        k.pos(-6, 60),
        k.anchor("center"),
        k.animate(),
        k.stay(),
        "background"
    ]);
    b.onUpdate(() => {
        if (k.getSceneName() !== "title" && b.pos.x >= 199) {
            b.destroy();
            return;
        }
    });
    b.animate("pos", [
        k.vec2(-6, 60),
        k.vec2(50, 60),
        k.vec2(40, 35),
        k.vec2(80, 45),
        k.vec2(200, 70)
    ], {
        duration: 4,
        timing: [0, 0.4, 0.6, 0.8, 1],
        easing: k.easings.easeInOutSine,
    });
    return b
}
