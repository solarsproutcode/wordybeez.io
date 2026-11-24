import { colorPallete } from "../config";
const powerups = {
    stick: {
        x: 30,
        choices: {
            1: {
                title: "Stir the Pot",
                description: "Allow slang terms to count for your run"
            },
            2: {
                title: "Stik tu et",
                description: "Allow phonetic spellings of words to count the same as actual spellings"
            },
            3: {
                title: "Double Dip",
                description: "Allow two words combined score for one level"
            },
            4: {
                title: "Comb Over",
                description: "Allow words one letter away from a real word"
            }
        },
        
    },
    flower: {
        x: 90,
        choices: {
            1: {
                title: "Full Bloom",
                description: "Change one of your honeycomb letters permanently"
            },
            2: {
                title: "Pollinate",
                description: "Duplicate three letters for one level"
            },
            3: {
                title: "Nectar of the Gods",
                description: "Choose an additional starting tile"
            },
            4: {
                title: "Drunk on Nectar",
                description: "Choose two additional starting tiles, but have only 15 seconds per level"
            }
        }
    },
    jar: {
        x: 152,
        choices: {
            1: {
                title: "Pot of Gold",
                description: "The banned letter rule doesn't apply for your run"
            },
            2: {    
                title: "Golden Elixir",
                description: "The required letter rule doesn't apply for your run"
            },
            3: {
                title: "Honey Pot Police",
                description: "Choose a letter that you didn't play, to be banned tomorrow",
                disclaimer: "This powerup only activates once per day"
            },
            4: {
                title: "Honeymoon",
                description: "Choose a letter that you played, to be required tomorrow",
                disclaimer: "This poiwerup only activates once per day"
            }
        }
    },
}
let dailyPotAvailable = false;
fetch("/api/powerup")
    .then((res) => res.json())
    .then(({ dailyPot }) => {
        dailyPotAvailable = dailyPot;
    });

export function addPowerups(k) {
    const dailyPowerups = {
        stick: k.randi(1, 5), 
        flower: k.randi(1, 5), 
        jar: dailyPotAvailable ? k.randi(1, 5) : k.randi(1, 3)
    }
    let selectedItem = null;

    for (const [i, [name, val]] of Object.entries(powerups).entries()) {
        if (!k.getSprite(name)) {
            continue
        }
        const item = k.add([
            k.sprite(name),
            k.pos(val.x, 120),
            k.anchor("center"),
            k.area(),
            k.rotate(0),
            k.timer(),
            k.z(1), // keep powerups above their selection highlight
            name
        ]);
        addIdleAnim(k, item, i);
        k.onClick(name, () => {
            const text = val.choices[dailyPowerups[name]]
            k.destroyAll("selected");
            // previous selected powerup needs to go back to bob
            if (selectedItem && selectedItem !== item) {
                setBobbing(k, selectedItem, true);
            }
            // this powerup needs to stop bobbing
            setBobbing(k, item, false);
            selectedItem = item;
            addHighlight(k, item);
            const title = addTextBox(k, text.title, 200, colorPallete.lightYellow, colorPallete.darkBrown, { size: 16 });
            // wrap description text
            const description = addTextBox(k, text.description, 0, colorPallete.lightYellow, colorPallete.darkBrown, { width: 100 })
            // description is always 4 pixels below title
            description.pos.y = title.pos.y + (title.height / 2) + (description.height / 2) + 4
        })
    }
}

// i = the item's index
function addIdleAnim(k, item, i) {
    item.baseY = item.pos.y;
    item.bobAmount = 1;

    // float 1.5 pixels up and down
    // item is offset by i for randomness
    item.onUpdate(() => {
        item.pos.y = item.baseY + Math.sin(k.time() * 2.5 + i * 2) * 1.5 * item.bobAmount;
    });
}

// changes to either 0 or 1, easing in between
function setBobbing(k, item, on) {
    item.bobTween?.cancel();
    item.bobTween = item.tween(item.bobAmount, on ? 1 : 0, 0.15,
        (v) => item.bobAmount = v, k.easings.easeOutQuad); // easeOutQuad quick first then slow
}

function addHighlight(k, item) {
    const padding = 4;
    const highlight = k.add([
        k.rect(item.width + padding * 2, item.height + padding * 2, { radius: 4 }),
        k.pos(item.pos.x, item.baseY),
        k.anchor("center"),
        k.color(colorPallete.lightYellow),
        k.outline(2, k.Color.fromHex(colorPallete.hazel)),
        k.opacity(1),
        k.scale(0),
        k.z(0), // draw layer behind text
        k.timer(),
        "selected"
    ]);
    // Pop in
    highlight.tween(0, 1, 0.2, (s) => highlight.scale = k.vec2(s), k.easings.easeOutBack);
    highlight.opacity = 0.75
    return highlight;
}

function addTextBox(k, text, y, color1, color2, options = {}) {
    const box = k.add([
        k.rect(0, 0, { radius: 2 }),
        k.pos(k.width()/2, y),
        k.anchor("center"),
        k.color(color1),
        k.scale(0), // start invisible
        k.timer(),
        "selected"
    ]);
    const label = box.add([
        k.text(text, { 
            size: 12,
            font: "yoster",
            align: "center",
            ... options // concat with options
        }),
        k.anchor("center"),
        k.color(color2),
    ]);
    box.width = label.width + 8;
    box.height = label.height + 4;

    // Pops in, overshooting with easeOutBack
    box.tween(0, 1, 0.25, (s) => box.scale = k.vec2(s), k.easings.easeOutBack);
    return box;
}