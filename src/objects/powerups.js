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
            k.add([
                k.text(text.title, { size: 12, font: "yoster" }),
                k.pos(k.width()/2, 200),
                k.anchor("center"),
                k.color(colorPallete.darkBrown),
                "selected"
            ]);
        })
    }
}