import { colorPallete } from "../config";
import { addTextBox, flyBee } from "../helpers";
import { LETTER_POINTS } from "./letters";
import { increaseScore } from "./score";

const TALLY_STAGGER = 0.25; // delay between each letter being counted
const BEE_LEAD_IN = 0.3; // time for the bee to fly in

export function addDeliverButton(k, wordHexes) {
    const deliver = addTextBox(k, "Deliver to Queen", 70, colorPallete.red, colorPallete.white, { size: 16 }, [
        k.area(),
        k.outline(2, k.Color.fromHex(colorPallete.white)),
        "deliver"
    ])
    deliver.onClick(() => {
        if (deliver.delivered) return; // only deliver once
        deliver.delivered = true;
        k.destroyAll("oops");
        deliver.tween(k.vec2(1.2, 0.8), k.vec2(1), 0.3, (s) => deliver.scale = s, k.easings.easeOutElastic);
        // disappear once done
        deliver.wait(0.3, () => deliver.destroy());
        tallyScore(k, wordHexes)
        k.wait(BEE_LEAD_IN + (wordHexes.length - 1) * TALLY_STAGGER + 0.6, () => slideOutWord(k, wordHexes));

        // animate bees / change to next level
    });
    return deliver
}

function tallyScore(k, wordHexes) {
    const bee = k.add([
        k.sprite("bee", { anim: "fly" }),
        k.pos(-10, wordHexes[0].sourceHex.pos.y),
        k.anchor("center"),
        k.timer(), // for flyBee
        k.z(2), // above the honeycomb tiles
    ]);
    // the bee visits each tile
    flyBee(k, bee, wordHexes[0].sourceHex.pos, BEE_LEAD_IN);

    wordHexes.forEach((hex, i) => {
        k.wait(BEE_LEAD_IN + i * TALLY_STAGGER, () => {
            const points = LETTER_POINTS[hex.letter];
            addPlusPoints(k, hex, points);
            increaseScore(k, points);

            // head to the next letter
            const next = wordHexes[i + 1];
            if (next) {
                flyBee(k, bee, next.sourceHex.pos, TALLY_STAGGER);
            } else {
                flyBee(k, bee, k.vec2(k.width() + 10, hex.sourceHex.pos.y), 0.4, () => bee.destroy());
            }
        });
    });
}

// slides every word tile off the left edge
function slideOutWord(k, wordHexes) {
    // splice(0) empties the word's list
    const tiles = wordHexes.splice(0);
    for (const hex of tiles) {
        const source = hex.sourceHex;
        source.clicked = false;
        k.tween(source.opacity, 0.70, 0.1, (p) => source.opacity = p, k.easings.easeOutQuad);

        const endX = hex.pos.x - k.width() - hex.width;
        k.tween(hex.pos.x, endX, 0.5, (x) => hex.pos.x = x, k.easings.easeInBack)
            .onEnd(() => hex.destroy());
    }
}

function addPlusPoints(k, hex, points) {
    const plus = k.add([
        k.text(`+${points}`, { size: 12, font: "yoster" }),
        k.pos(hex.pos.x, hex.pos.y - hex.height * hex.scale.y / 2),
        k.anchor("center"),
        k.color(colorPallete.red),
        k.opacity(1),
    ]);
    k.tween(plus.pos.y, plus.pos.y - 12, 0.6, (y) => plus.pos.y = y, k.easings.easeOutQuad);
    k.tween(1, 0, 0.6, (o) => plus.opacity = o).onEnd(() => plus.destroy());
}
