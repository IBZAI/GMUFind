# Checking that Browse Items Uses the Items API

The Browse Items page (`web/index.html`) gets its items from the Express server's `GET /api/items` endpoint (`server.js`). You can use these steps to confirm that the page and the API are connected.

## Setup

1. Install [Node.js](https://nodejs.org/) if you don't have it.
2. From the project root, run:
   ```powershell
   npm install
   npm start
   ```
3. Open **http://localhost:3000**.
   Opening `web/index.html` directly from the folder won't work. The page has to be served by the server so it can reach `/api/items`.

## 1. Watch the request in the browser

1. Open http://localhost:3000, press **F12** and go to the **Network** tab.
2. Refresh the page.
3. Find the request named **`items`** (that's `/api/items`). It should have status **200**.
4. Click it and open **Response**. You'll see the same data that's shown on the item cards.

## 2. Add an item and see it appear

With the server running, run this in a separate terminal:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/items -ContentType 'application/json' -Body '{"type":"Keys","description":"Car keys with a blue lanyard","date":"11/12","location":"Fenwick Library","holdingLocation":"Front desk"}'
```

Refresh Browse Items and a **Keys** card appears. The page doesn't store items in the browser, so the card can only have come from the API.

## 3. Stop the server

1. Press **Ctrl+C** in the terminal where the server is running.
2. Refresh the page. It should show:
   > Could not load items. Make sure the server is running and refresh the page.

This shows the page depends on the API. Run `npm start` again to bring the server back. Any items you added will be gone, because the server only keeps them in memory for now (there's no database yet).

## Where this happens in the code

| Step | File | What happens |
|---|---|---|
| 1 | `web/index.html` | Loads `itemService.js`, then `script.js` |
| 2 | `web/script.js` | On the Browse page, calls `loadItems()` |
| 3 | `web/script.js` | `loadItems()` asks `ItemService.getItems()` for items and shows a loading, empty or error message |
| 4 | `web/itemService.js` | `getItems()` runs `fetch("/api/items")`, which is the actual call to the API |
| 5 | `server.js` | `app.get("/api/items")` sends back the stored items as JSON |
| 6 | `server.js` | `const items = []` holds the items in memory |
| 7 | `web/script.js` | `renderItemCard()` builds one card for each item |

**Flow:** `script.js` (UI) → `itemService.js` (API client) → `server.js` (Express API) → `items` array (storage)
