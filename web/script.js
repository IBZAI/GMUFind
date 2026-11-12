
const reportForm = document.querySelector(".report-form");
const itemsContainer = document.getElementById("items-container");

//Handles submitting a found item
if(reportForm)
    {
    reportForm.addEventListener("submit", async function(event) {
        event.preventDefault();
        const photoInput = document.getElementById("item-photo");
        const photo = photoInput.files[0];
        //Collects the information from the form itself
        const item = {
            type: document.getElementById("item-type").value,
            description: document.getElementById("item-desc").value,
            date: document.getElementById("item-date").value,
            location: document.getElementById("item-location").value,
            holdingLocation: document.getElementById("holding-location").value,
            photo: ""
        };

        //The reported item is sent to the Express server
        async function saveItem(){
            try {
                const response=await fetch("/api/items", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(item)
                });

                //The item is redirected if it was submitted successfully
                if(response.ok)
                {
                    window.location.href="index.html";
                } else {
                    const error=await response.json();
                    alert(error.error||"Could not submit the item.");
                }
            } catch (error) {
                alert("Could not connect to the server.");
            }
        }

        //Reads the uploaded photo if one was actually selected
        if (photo) {
            const reader = new FileReader();
            reader.onload = async function() {
                item.photo = reader.result;
                await saveItem(item);
            };
            reader.readAsDataURL(photo);
        } else {
            await saveItem(item);
        }
    });
}

// Saves item to SQLite through the backend
async function saveItem(item) {
    try {
        const response = await fetch("/api/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(item)
        });
        if (!response.ok) {
            throw new Error("Failed to save item");
        }
        const savedItem = await response.json();
        console.log("Saved item:", savedItem);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error saving item:", error);
        alert("Unable to save item: " + error.message);
    }
}

// Displays submitted items on the Browse Items page
if (itemsContainer) {
    async function loadItems() {
        try {
            const response = await fetch("/api/items");
            if (!response.ok) {
                throw new Error("Failed to retrieve items");
            }
            const items = await response.json();
            items.forEach(function(item) {
                const card = document.createElement("div");
                card.className = "item-card";
                const heading = document.createElement("h2");
                heading.textContent = item.type;
                card.appendChild(heading);
                // Displays uploaded photo
                if (item.photo) {
                    const image = document.createElement("img");
                    image.src = item.photo;
                    image.alt = "Found item";
                    card.appendChild(image);
                }
                // Displays item details
                const details = [
                    ["Description", item.description],
                    ["Date Found", item.date],
                    ["Location Found", item.location],
                    ["Location Held", item.holdingLocation]
                ];
                details.forEach(function(detail) {
                    const paragraph = document.createElement("p");
                    const label = document.createElement("strong");
                    label.textContent = detail[0] + ": ";
                    paragraph.appendChild(label);
                    paragraph.appendChild(
                        document.createTextNode(detail[1])
                    );
                    card.appendChild(paragraph);
                });
                itemsContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error:", error);
            itemsContainer.textContent = "Unable to load items.";
        }
    }
    loadItems();
}
