export function bee(k) {
    const b = k.add([
        k.sprite("bee", { anim: "fly" }),
        k.pos(-6, 70),
        k.anchor("center"),
        k.animate(),
    ]);
    b.animate("pos", [
        k.vec2(-6, 70), 
        k.vec2(186, 70)
    ], { duration: 4 });
}