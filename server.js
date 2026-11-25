import "dotenv/config";
import express from "express";
import { createClient } from "redis";
import { createShuffledBag } from "./src/objects/letters.js";

const app = express();
const redis = await createClient({ url: process.env.REDIS_URL }).connect();

function nextMidnightUTC() {
    const now = new Date();
    const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
    return Math.floor(midnight / 1000);
}

app.get("/api/powerup", async (req, res) => {
    res.json({ available: !(await redis.exists("dailyPot")) });
});

app.post("/api/powerup", async (req, res) => {
    const ok = await redis.set("dailyPot", "1", {
        NX: true,
        EXAT: nextMidnightUTC(), // expire time
    });
    res.json({ allowed: ok === "OK" });
});

app.get("/api/letters", async (req, res) => {
    let letters = await redis.get("dailyLetters");
    if (!letters) {
        // first request of the day
        await redis.set("dailyLetters", createShuffledBag().join(""), {
            NX: true,
            EXAT: nextMidnightUTC(),
        });
        letters = await redis.get("dailyLetters");
    }
    res.json({ letters: letters.split("") });
});

app.use(express.static("dist"));
app.listen(process.env.PORT || 3000);