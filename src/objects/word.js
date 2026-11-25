import { colorPallete } from "../config";
import { addLetter, POP_GROW_TIME } from "./hexagons";

const WORD_Y = 120;
const WORD_MARGIN = 4; // space kept free at each screen edge
let wordHexes = [];

// adds a copy of the clicked hex to the end of the word
export function addToWord(k, sourceHex) {
    const letter = sourceHex.letter;
    const newHex = k.add([
        k.sprite("hexagon"),
        k.pos(k.width() / 2, WORD_Y),
        k.anchor("center"),
        k.scale(0), // starts invisible
        "wordHex",
        { letter, sourceHex }, 
    ]);
    addLetter(k, newHex, letter, colorPallete.darkBrown);
    wordHexes.push(newHex);
    arrangeWord(k, newHex);
}

// removes the last letter, lets honeycomb tile be clicked again
export function removeLastLetter(k) {
    const last = wordHexes.pop();
    if (!last) return; // word is already empty
    last.destroy();

    const source = last.sourceHex;
    source.clicked = false;
    k.tween(source.opacity, 0.70, 0.1, (p) => source.opacity = p, k.easings.easeOutQuad);

    arrangeWord(k);
}

// moves every letter to its spot, newHex pops in, the rest slide
function arrangeWord(k, newHex = null) {
    if (wordHexes.length === 0) return;
    const w = wordHexes[0].width;
    const h = wordHexes[0].height;

    const scale = getWordScale(k, w);
    wordHexes.forEach((hex, i) => {
        const spot = getWordSpot(k, i, w, h, scale);
        if (hex === newHex) {
            // the new letter appears at its spot and pops in
            hex.pos = spot;
            k.tween(0, scale, POP_GROW_TIME, (s) => hex.scale = k.vec2(s), k.easings.easeOutBack);
        } else {
            // letters already there slide to their new spot
            k.tween(hex.pos, spot, 0.15, (p) => hex.pos = p, k.easings.easeOutQuad);
            hex.scale = k.vec2(scale);
        }
    });
}

// how big each letter should be
function getWordScale(k, w) {
    // letters overlap, so each one after the first adds 3/4 of a width
    const wordWidth = w + (wordHexes.length - 1) * w * 0.75;
    const room = k.width() - WORD_MARGIN * 2;
    return Math.min(1, room / wordWidth);
}

function getWordSpot(k, i, w, h, scale) {
    // x: 3/4 of a tile apart, with the whole word centered on the screen
    const stepX = w * 0.75 * scale;
    const firstX = (k.width() / 2) - (((wordHexes.length - 1) * stepX) / 2);
    const x = firstX + i * stepX;

    // y: neighbours are half a tile apart vertically
    if (wordHexes.length === 1) return k.vec2(x, WORD_Y);
    const quarterTile = h / 4 * scale;
    const isLow = i % 2 === 0;
    const y = isLow ? WORD_Y + quarterTile : WORD_Y - quarterTile;

    return k.vec2(x, y);
}
