
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


//Displays submitted items on the Browse Items page, loaded from GET /api/items
if(itemsContainer)
    {
    loadItems();
}

//Asks the ItemService for the items, then renders them (or a status message)
async function loadItems() {
    showMessage("Loading items...");

    try {
        const items = await ItemService.getItems();

        if (items.length === 0) {
            showMessage("No items have been reported yet.");
            return;
        }

        itemsContainer.replaceChildren();
        items.forEach(renderItemCard);
    } catch (error) {
        console.error(error);
        showMessage("Could not load items. Make sure the server is running and refresh the page.");
    }
}

//Replaces the item list with a single status message
function showMessage(text) {
    const message = document.createElement("p");
    message.className = "items-message";
    message.textContent = text;
    itemsContainer.replaceChildren(message);
}

//Builds one item card and adds it to the Browse Items page
function renderItemCard(item)
    {
        const card = document.createElement("div");
        card.className = "item-card";

        const heading = document.createElement("h2");
        heading.textContent = item.type;
        card.appendChild(heading);

        //Displays the uploaded photo
        if (item.photo)
        {
            const image = document.createElement("img");
            image.src = item.photo;
            image.alt = "Found item";
            card.appendChild(image);
        }

        //Displays the item details
        const details=[
            ["Description", item.description],
            ["Date Found", item.date],
            ["Location Found", item.location],
            ["Location Held", item.holdingLocation]
        ];

        details.forEach(function(detail) {
            const paragraph=document.createElement("p");
            const label=document.createElement("strong");

            label.textContent=detail[0] + ": ";
            paragraph.appendChild(label);
            paragraph.appendChild(document.createTextNode(detail[1]));

            card.appendChild(paragraph);
        });

        itemsContainer.appendChild(card);
}