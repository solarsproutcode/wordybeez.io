import { colorPallete } from "./config";

// i = the item's index
export function addIdleAnim(k, item, i) {
    item.baseY = item.pos.y;
    item.bobAmount = 1;

    // float 1.5 pixels up and down
    // item is offset by i for randomness
    item.onUpdate(() => {
        item.pos.y = item.baseY + Math.sin(k.time() * 2.5 + i * 2) * 1.5 * item.bobAmount;
    });
}

// changes to either 0 or 1, easing in between
export function setBobbing(k, item, on) {
    item.bobTween?.cancel();
    item.bobTween = item.tween(item.bobAmount, on ? 1 : 0, 0.15,
        (v) => item.bobAmount = v, k.easings.easeOutQuad); // easeOutQuad quick first then slow
}

export function addHighlight(k, item) {
    const padding = 4;
    const highlight = k.add([
        k.rect(item.width + padding * 2, item.height + padding * 2, { radius: 4 }),
        k.pos(item.pos.x, item.baseY),
        k.anchor("center"),
        k.color(colorPallete.lightYellow),
        k.outline(2, k.Color.fromHex(colorPallete.hazel)),
        k.opacity(0.75),
        k.scale(0),
        k.z(0), // draw layer behind powerups
        k.timer(),
        "selected"
    ]);
    // Pop in
    highlight.tween(0, 1, 0.2, (s) => highlight.scale = k.vec2(s), k.easings.easeOutBack);
    return highlight;
}

// flies the bee to target over `time` seconds, then calls onDone. the bee needs k.timer()
export function flyBee(k, bee, target, time, onDone = () => {}) {
    bee.tween(bee.pos, target, time, (p) => bee.pos = p, k.easings.easeInOutSine).onEnd(onDone);
}

export function addTextBox(k, text, y, color1, color2, textOptions = {}, extraComps = [], startScale = 0, x = k.width() / 2) {
    const box = k.add([
        k.rect(0, 0, { radius: 2 }),
        k.pos(x, y),
        k.anchor("center"),
        k.color(color1),
        k.scale(startScale),
        k.timer(),
        ...extraComps // extra components and tags, e.g. k.area(), "selected"
    ]);
    const label = box.add([
        k.text(text, {
            size: 12,
            font: "yoster",
            align: "center",
            ...textOptions
        }),
        k.anchor("center"),
        k.color(color2),
    ]);
    k.onLoad(() => {
        box.width = label.width + 8;
        box.height = label.height + 4;
    });

    // Pops in, overshooting with easeOutBack
    if (startScale < 1) {
        box.tween(startScale, 1, 0.25, (s) => box.scale = k.vec2(s), k.easings.easeOutBack);
    }
    return box;
}
