import { colorPallete } from "../config";

// hexagons overlap so no blank space between
const OVERLAP_X = 2; // diagonal tiles
const OVERLAP_Y = 0; // top and bottom tiles

// center tile pop
const POP_GROW_TIME = 0.2;

// the tiles that fly in
const FLY_START = POP_GROW_TIME * 0.5; // when the first tile starts (0 = with the center pop)
const FLY_TIME = 0.4; // how long each flight takes
const FLY_STAGGER = 0.1; // delay between each tile starting

let tileNum = 0

let todayLetters = []
const lettersReady = fetch("/api/letters")
    .then((res) => res.json())
    .then(({ letters }) => {
        todayLetters = letters;
    })
    // still draw the hexagons (blank) if the letters can't be loaded
    .catch((err) => console.error("couldn't load today's letters", err));

export async function addInitHoneycomb(k, centerPos) {
    // tiles need their letters, so wait for the fetch (usually already done by now)
    await lettersReady;
    const centerHex = addHexagon(k, centerPos, 0);
    k.tween(0, 1, POP_GROW_TIME, (s) => centerHex.scale = k.vec2(s), k.easings.easeOutBack);

    const w = centerHex.width - OVERLAP_X;
    const h = centerHex.height - OVERLAP_Y;
    // first 6 tiles
    for (let i = 0; i < 6; i++) {
        const offset = getTileOffset(k, tileNum, w, h);
        const endPos = centerPos.add(offset);
        const startPos = centerPos.add(offset.unit().scale(k.width()));
        const tile = addHexagon(k, startPos);
        flyIn(k, tile, endPos, FLY_START + (tileNum - 1) * FLY_STAGGER);
    }
}

function getTileDirection(k, w, h) {
    return {
        up:        k.vec2(0, -h),
        upRight:   k.vec2(w * 0.75, -h / 2),
        downRight: k.vec2(w * 0.75, h / 2),
        down:      k.vec2(0, h),
        downLeft:  k.vec2(-w * 0.75, h / 2),
        upLeft:    k.vec2(-w * 0.75, -h / 2),
    };
}

// from the center tile, how much to move x / y for index
function getTileOffset(k, index, w, h) {
    if (index === 0) return k.vec2(0, 0);
    const dir = getTileDirection(k, w, h);

    // 1. find which ring the tile is in
    let ring = 1;
    let firstTileInRing = 1;
    while (index >= firstTileInRing + 6 * ring) {
        firstTileInRing += 6 * ring;
        ring++;
    }

    // 2. start at the ring's top tile: move up `ring` times from the center
    let pos = dir.up.scale(ring);

    // 3. walk clockwise around the ring until we reach our tile.
    //    the ring has 6 sides, each `ring` tiles long. from the top tile,
    //    clockwise is heading down-right first, then turning clockwise each side
    const sides = [dir.downRight, dir.down, dir.downLeft, dir.upLeft, dir.up, dir.upRight];
    let tilesToWalk = index - firstTileInRing;
    for (const side of sides) {
        const walk = Math.min(tilesToWalk, ring); // keep going for the entire 'ring' side
        pos = pos.add(side.scale(walk));
        tilesToWalk -= walk;
        if (tilesToWalk === 0) break;
    }
    return pos;
}

function addHexagon(k, pos, scale = 1) {
    // each tile takes the next letter in today's shuffle
    const letter = todayLetters[tileNum] ?? "";
    tileNum++
    const hex = k.add([
        k.sprite("hexagon"),
        k.pos(pos),
        k.anchor("center"),
        k.scale(scale),
        "hexagon",
        { letter },
    ]);
    // a child of the hexagon, so it moves, scales and hides with it
    hex.add([
        k.text(letter, { size: 12, font: "yoster" }),
        k.anchor("center"),
        k.color(colorPallete.darkBrown),
    ]);
    return hex;
}

function flyIn(k, obj, target, delay) {
    // hidden while waiting
    obj.hidden = true;
    k.wait(delay, () => {
        obj.hidden = false;
        k.tween(obj.pos, target, FLY_TIME, (p) => obj.pos = p, k.easings.easeOutBack);
    });
}
