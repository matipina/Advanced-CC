// Get references to our HTML elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const messageEl = document.getElementById('message');
const artworkEl = document.getElementById('artwork');

// Listen for a click on the search button
searchButton.addEventListener('click', performSearch);

async function performSearch() {
    const query = searchInput.value.trim();
    if (query === "") return; // Don't search if the input is empty

    artworkEl.innerHTML = '';
    messageEl.textContent = 'Searching...';

    try {
        const searchResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${query}`);
        const searchData = await searchResponse.json();

        if (!searchData.objectIDs) {
            messageEl.textContent = 'No results found.';
            return;
        }

        const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length);
        const randomObjectID = searchData.objectIDs[randomIndex];

        const objectResponse = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${randomObjectID}`);
        const objectData = await objectResponse.json();

        displayArtwork(objectData);
    } catch (error) {
        messageEl.textContent = 'Error connecting to API.';
        console.error(error);
    }
}

// Function to take the JSON data and build HTML out of it
function displayArtwork(data) {
    messageEl.textContent = '';
    
    let html = '';
    if (data.primaryImageSmall) {
        html += `<img src="${data.primaryImageSmall}" alt="${data.title}">`;
    }
    html += `<h2>${data.title || 'Unknown Title'}</h2>`;
    html += `<h3>${data.artistDisplayName || 'Unknown Artist'}</h3>`;
    
    artworkEl.innerHTML = html;
}