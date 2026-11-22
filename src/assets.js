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
    // 04B_30 rendered at its native size (17pt) with no antialiasing: 16x16 cells, ASCII 32-126
    k.loadBitmapFont("font", "fonts/04b30.png", 16, 16)

    // Load sfx and music
}