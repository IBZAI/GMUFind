
const reportForm = document.querySelector(".report-form");
const itemsContainer = document.getElementById("items-container");

//Handles submitting a found item
if(reportForm)
    {
    reportForm.addEventListener("submit", function(event) {
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

        //Gets the previously submitted items
        const items = JSON.parse(sessionStorage.getItem("items")) || [];

        //Saves the new item and open the Browse Items page
        function saveItem(){
            items.push(item);
            sessionStorage.setItem("items", JSON.stringify(items));
            window.location.href = "index.html";
        }

        //Reads the uploaded photo if one was actually selected
        if (photo) {
            const reader = new FileReader();

            reader.onload = function() {
                item.photo = reader.result;
                saveItem();
            };

            reader.readAsDataURL(photo);
        } else{
            saveItem();
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
