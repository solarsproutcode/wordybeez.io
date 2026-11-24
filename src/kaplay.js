import kaplay from "kaplay";
import { colorPallete } from "./config";
import { createCrtScreen } from "@glowbox/crt";

// If you want to prevent KAPLAY from importing all functions to global and use a context handle for all KAPLAY functions
export const k = kaplay({
    root: document.getElementById("game"), // sized/framed by index.html
    global: false,
    width: 180,
    height: 320,
    letterbox: true,
    stretch: true,
    font: "sans-serif",
    // canvas: document.querySelector("#mycanvas"),
    background: colorPallete.blue,
    crisp: true,
    texFilter: "nearest",
    pixelDensity: 4,
})

for (const border of document.querySelectorAll(".border")) {
    const pixelDensity = 4
    const img = new Image();
    img.onload = () => {
        border.width = 12 * pixelDensity;
        border.height = 320 * pixelDensity;
        const ctx = border.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, border.width, border.height);
    };
    img.src = border.dataset.src; // set image source
}

// Filter the whole frame
const crt = createCrtScreen(document.getElementById("frame"), {
    curvature: 0,
    scanlines: 0.3,
    mask: 0.1,
    convergence: 0.3,
    persistence: 0.25,
    flicker: 0,
    vignette: 0,
    band: 0,
    noise: 0.03,
    gain: 1.05,
    background: colorPallete.blue,
    events: false,
});
crt.canvas.style.pointerEvents = "none";