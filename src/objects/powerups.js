import { colorPallete } from "../config";
import { addIdleAnim, setBobbing, addHighlight, addTextBox } from "../helpers";
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
                description: "Allow phonetic spellings of words"
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

export function addPowerups(k, { onSelect = () => {}, sceneTransition = () => false } = {}) {
    const dailyPowerups = {
        stick: k.randi(1, 5),
        flower: k.randi(1, 5),
        jar: dailyPotAvailable ? k.randi(1, 5) : k.randi(1, 3)
    }
    let selectedItem = null;
    const addSelectPrompt = () => addTextBox(k, "Her majesty requests you choose, before the work can begin", 220, colorPallete.red, colorPallete.white, { width: 100 }, [
        k.outline(2, k.Color.fromHex(colorPallete.white)),
        "selected"
    ]);
    addSelectPrompt();
    for (const [i, [name, val]] of Object.entries(powerups).entries()) {
        if (!k.getSprite(name)) {
            continue
        }
        const item = k.add([
            k.sprite(name),
            k.pos(val.x, 110),
            k.anchor("center"),
            k.area(),
            k.rotate(0),
            k.timer(),
            k.z(1), // keep powerups on top of the highlight
            name,
            "powerup"
        ]);
        addIdleAnim(k, item, i); 
        k.onClick(name, () => {
            if (sceneTransition()) return;
            if (selectedItem === item) return; // already selected
            const text = val.choices[dailyPowerups[name]]
            k.destroyAll("selected");
            let startScale = 0
            // previous selected powerup needs to go back to bob
            if (selectedItem && selectedItem !== item) {
                setBobbing(k, selectedItem, true);
                startScale = 1
            }
            // this powerup needs to stop bobbing
            setBobbing(k, item, false);
            selectedItem = item;
            addHighlight(k, item);
            const title = addTextBox(k, text.title, 180, colorPallete.lightYellow, colorPallete.darkBrown, { size: 16 }, ["selected"]);
            // wrap description text
            const description = addTextBox(k, text.description, 0, colorPallete.lightYellow, colorPallete.darkBrown, { width: 100 }, ["selected"])
            // description is always 4 pixels below title
            description.pos.y = title.pos.y + (title.height / 2) + (description.height / 2) + 4
            onSelect(startScale);
        })
    }

}