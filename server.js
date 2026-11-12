const express = require("express");
const path = require("node:path");
const Database = require("better-sqlite3");
const app = express();

app.use(express.static(path.join(__dirname, "web")));
app.use(express.json({ limit: "5mb" }));

// Connect to SQLite database
const db = new Database(path.join(__dirname, "items.db"));

// Create items table if it doesn't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        holdingLocation TEXT NOT NULL,
        photo TEXT NOT NULL DEFAULT ''
    )
`);

// GET all items from database
app.get("/api/items", (req, res) => {
    const items = db.prepare(`
        SELECT * FROM items
        ORDER BY id ASC
    `).all();
    res.json(items);
});

// POST a new item into database
app.post("/api/items", (req, res) => {
    const {
        type,
        description,
        date,
        location,
        holdingLocation,
        photo
    } = req.body || {};
    // Validate required fields
    const requiredFields = [
        type,
        description,
        date,
        location,
        holdingLocation
    ];
    for (const field of requiredFields) {
        if (typeof field !== "string" || field.trim() === "") {
            return res.status(400).json({
                error: "Fill in all required fields."
            });
        }
    }
    // Insert item into database
    const insertItem = db.prepare(`
        INSERT INTO items (
            type,
            description,
            date,
            location,
            holdingLocation,
            photo
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = insertItem.run(
        type.trim(),
        description.trim(),
        date.trim(),
        location.trim(),
        holdingLocation.trim(),
        typeof photo === "string" ? photo : ""
    );
    // Retrieve newly saved item
    const savedItem = db.prepare(`
        SELECT * FROM items WHERE id = ?
    `).get(result.lastInsertRowid);
    // Return saved item with generated ID
    res.status(201).json(savedItem);
});

// Start server
app.listen(3000, () => {
    console.log("GMUFind is running in http://localhost:3000");
});
