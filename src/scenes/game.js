import { colorPallete } from "../config";
import { addTextBox } from "../helpers";
import { addInitHoneycomb } from "../objects/hexagons";
import { removeLastLetter } from "../objects/word";
import { addScore } from "../objects/score";

export function game(k) {
    return k.scene("game", () => {
        // sprite size is only known once assets have loaded
        k.onLoad(() => {
            addInitHoneycomb(k, k.vec2(k.width() / 2, 220));
            addOopsButton(k);
            addScore(k);
        });
    })
}

// bottom right, removes the last letter of the word. styled like the title's start button
function addOopsButton(k) {
    const oops = addTextBox(k, "Oops", 300, colorPallete.lightYellow, colorPallete.darkBrown, { size: 16 }, [
        k.area(),
        "oops"
    ])
    // move to the bottom right corner, 6px in from the edge
    oops.pos.x = k.width() - oops.width / 2 - 6;
    oops.onClick(() => {
        oops.tween(k.vec2(1.2, 0.8), k.vec2(1), 0.3, (s) => oops.scale = s, k.easings.easeOutElastic);
        removeLastLetter(k);
    });
    return oops
}
