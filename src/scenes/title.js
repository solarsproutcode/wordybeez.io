import { colorPallete } from "../config";
import { addPowerups } from "../objects/powerups"

export function title(k) {
    return k.scene("title", () => {
        k.add([
            k.sprite("hive_header"),
            k.pos(0, 35),
            k.anchor("left"),
        ]);
        k.add([
            k.text("WordyBeez", { size: 16, font: "04b30" }),
            k.pos(k.width()/2, 10),
            k.anchor("center"),
            k.color(colorPallete.darkBrown)
        ]);
        addBee(k)
        addPowerups(k)
    })
}

function addBee(k) {
    const b = k.add([
        k.sprite("bee", { anim: "fly" }),
        k.pos(-6, 70),
        k.anchor("center"),
        k.animate()
    ]);
    b.animate("pos", [                  
        k.vec2(-6, 70), 
        k.vec2(50, 70),
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