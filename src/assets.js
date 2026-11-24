const spriteOptions = {
    bee: {
        sliceX: 3,
        anims: {
            fly: { from: 0, to: 2, speed: 12, loop: true },
        },
    },
};

export function loadAssets(k) {
    // Scans /public/sprites for all .png files
    const spriteFiles = import.meta.glob('/public/sprites/*.png');

    for (const path in spriteFiles) {
        // Strip '/public' so KAPLAY can load it from the root URL
        const cleanPath = path.replace('/public', '');
        // Extract the filename without extension for the sprite name
        const name = path.split('/').pop().replace('.png', '');

        k.loadSprite(name, cleanPath, spriteOptions[name]);
    }

    // Load font
    k.loadBitmapFont("04b30", "fonts/04b30.png", 16, 16)
    k.loadFont("yoster", "fonts/yoster-island.regular.ttf", { size: 12, filter: "nearest" })

    // Load sfx and music
}