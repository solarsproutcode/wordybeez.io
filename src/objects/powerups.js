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
        x: 155,
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
    for (const [name, val] of Object.entries(powerups)) {
        if (!k.getSprite(name)) {
            continue
        }
        k.add([
            k.sprite(name),
            k.pos(val.x, 120),
            k.anchor("center"),
            k.area(),
            name
        ]);
        k.onClick(name, () => {
            const text = val.choices[dailyPowerups[name]]
            k.destroyAll("selected");
            const title = addTextBox(k, text.title, 200, { size: 16 });
            // wrap description text
            const description = addTextBox(k, text.description, 0, { width: 100 })
            // description is always 4 pixels below title
            description.pos.y = title.pos.y + (title.height / 2) + (description.height / 2) + 4
        })
    }
}

function addTextBox(k, text, y, options = {}) {
    const box = k.add([
        k.rect(0, 0, { radius: 2 }),
        k.pos(k.width()/2, y),
        k.anchor("center"),
        k.color(colorPallete.lightYellow),
        k.scale(0), // start invisible
        k.timer(),
        "selected"
    ]);
    const label = box.add([
        k.text(text, { 
            size: 12, // = yoster's native size (loadFont size), so pixels draw 1:1
            font: "yoster",
            align: "center",
            ... options // concat with options
        }),
        k.anchor("center"),
        k.color(colorPallete.darkBrown),
    ]);
    box.width = label.width + 8;
    box.height = label.height + 4;

    // Pops in, overshooting with easeOutBack
    box.tween(0, 1, 0.25, (s) => box.scale = k.vec2(s), k.easings.easeOutBack);
    return box;
}