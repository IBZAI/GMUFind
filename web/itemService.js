// ItemService: the single place the UI layer talks to the Items API (server.js).
// UI code calls these methods instead of using fetch() or the URL directly,
// so the page never needs to know how or where items are stored.
const ItemService = {
    API_URL: "/api/items",

    //Gets every reported item from the server (GET /api/items)
    async getItems() {
        const response = await fetch(this.API_URL);

        if (!response.ok) {
            throw new Error("Failed to load items (HTTP " + response.status + ")");
        }

        return response.json();
    }
};
