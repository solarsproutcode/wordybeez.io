import { colorPallete } from "../config";
import { flyBee } from "../helpers";

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

// each stop on the bee's path: where it flies to, and how long that hop takes
const BEE_START = [-6, 60];
const BEE_PATH = [
    { x: 50, y: 60, time: 1.6 },
    { x: 40, y: 35, time: 0.8 },
    { x: 80, y: 45, time: 0.8 },
    { x: 200, y: 70, time: 0.8 },
];

function addBee(k) {
    const b = k.add([
        k.sprite("bee", { anim: "fly" }),
        k.pos(...BEE_START),
        k.anchor("center"),
        k.timer(), // for flyBee
        k.stay(),
        "background"
    ]);
    flyBeePath(k, b, 0);
    return b
}

// flies hop i of the path, then the next. loops while on the title screen
function flyBeePath(k, b, i) {
    if (i === BEE_PATH.length) {
        // finished the path (off the right edge): once we've left the title, the bee is done
        if (k.getSceneName() !== "title") return b.destroy();
        b.pos = k.vec2(...BEE_START);
        i = 0;
    }
    const { x, y, time } = BEE_PATH[i];
    flyBee(k, b, k.vec2(x, y), time, () => flyBeePath(k, b, i + 1));
}
