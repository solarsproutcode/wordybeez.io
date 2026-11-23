import kaplay from "kaplay";
import { colorPallete } from "./config";
import { createCrtScreen } from "@glowbox/crt";

// If you want to prevent KAPLAY from importing all functions to global and use a context handle for all KAPLAY functions
export const k = kaplay({ 
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
    pixelDensity: 1,
})
const crt = createCrtScreen(k.canvas.parentElement || k.canvas, {
    curvature: 0,
    scanlines: 0.3,
    mask: 0.1,
    convergence: 0.85,
    persistence: 0.25,
    flicker: 0,
    vignette: 0,
    noise: 0.03,
    gain: 1.25,
    events: false,
});
crt.canvas.style.pointerEvents = "none";