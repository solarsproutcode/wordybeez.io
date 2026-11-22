import { colorPallete } from "../config";
import { bee } from "../objects/bee.js";

export function title(k) {
    return k.scene("title", () => {
        k.add([
            k.sprite("hive_header"),
            k.pos(0, 35),
            k.anchor("left"),
        ]);

        k.add([
            k.text("WordyBeez", { size: 16, font: "font" }),
            k.pos(k.width()/2, 10),
            k.anchor("center"),
            k.color(colorPallete.darkBrown)
        ]);

        bee(k);

    })
}