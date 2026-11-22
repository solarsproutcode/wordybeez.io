import { loadAssets } from "./assets.js";
import { k } from "./kaplay.js";
import { title } from "./scenes/title.js"

k.loadRoot("./"); // A good idea for Itch.io publishing later
loadAssets(k)
title(k)

k.go("title");