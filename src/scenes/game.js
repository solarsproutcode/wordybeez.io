import { addInitHoneycomb } from "../objects/hexagons";

export function game(k) {
    return k.scene("game", () => {
        // sprite size is only known once assets have loaded
        k.onLoad(() => addInitHoneycomb(k, k.vec2(k.width() / 2, 220)));
    })
}
