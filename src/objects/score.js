import { colorPallete } from "../config";
import { addTextBox } from "../helpers";

let score = 0;
let shownScore = 0; // the number currently on screen, catches up to  actual score
let scoreBox = null;
let countTween = null;

export function increaseScore(k, add) {
    score = score + add
    // count up from whatever is showing now, so quick increases chain smoothly
    countTween?.cancel();
    countTween = k.tween(shownScore, score, 0.3, (v) => setShownScore(Math.round(v)), k.easings.easeOutQuad);
    scoreBox.tween(k.vec2(1.2, 0.8), k.vec2(1), 0.3, (s) => scoreBox.scale = s, k.easings.easeOutElastic);
}

export function addScore(k) {
    // upper right: centered 20px in from the right edge, room for a few digits
    scoreBox = addTextBox(k, String(score), 40, colorPallete.red, colorPallete.white, { size: 16 }, [
        k.area(),
        k.outline(2, k.Color.fromHex(colorPallete.white)),
        "score"
    ], 0, k.width() - 20)
    shownScore = score;
    return scoreBox
}

function setShownScore(value) {
    shownScore = value;
    const label = scoreBox.children[0]; // addTextBox puts the text inside the box
    label.text = String(value);
    // grow the box as the number gets more digits
    scoreBox.width = label.width + 8;
}
