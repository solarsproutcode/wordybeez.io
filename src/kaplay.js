import kaplay from "kaplay";
import { colorPallete } from "./config";

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
