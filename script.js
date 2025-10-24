// ===============================
// GLOBAL VARIABLES
// ===============================
const menuLinks = document.querySelectorAll(".menu-link");
const contentDiv = document.getElementById("dynamic-content");

// ===============================
// LOAD DATA FROM JSON
// ===============================
async function loadData() {
    try {
        const response = await fetch("data.json");
        const data = await response.json();
        return data;
    } catch (error) {
        contentDiv.innerHTML = `<p>Error loading topics. Please check data.json file.</p>`;
        console.error("Error fetching data.json:", error);
    }
}

// ===============================
// DISPLAY TOPICS + WORKSHEETS
// ===============================
async function displayClassTopics(className) {
    const data = await loadData();

    if (data && data[className]) {
        let htmlContent = `<h3>${className} Topics</h3><ul class="topic-list">`;

        data[className].topics.forEach(topic => {
            htmlContent += `
                <li class="topic-item">
                    ${topic}
                    <a href="worksheets/${className}/${topic.replace(/ /g, '_')}.pdf" class="worksheet-btn" target="_blank">
                        <span class="download-icon">📄</span>Download Worksheet
                    </a>
                </li>`;
        });

        htmlContent += `</ul>`;

        contentDiv.innerHTML = htmlContent;
    } else {
        contentDiv.innerHTML = `<p>No topics found for ${className}. Please check data.json.</p>`;
    }
}

// ===============================
// EVENT LISTENERS FOR MENU LINKS
// ===============================
menuLinks.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        const className = this.getAttribute("data-class");
        displayClassTopics(className);
    });
});

// ===============================
// DEFAULT LOAD (Optional: Show homepage content or Playschool automatically)
// ===============================
contentDiv.innerHTML = `<p>Select a class from the menu to view topics.</p>`;
// ===============================
// SEARCH FEATURE
// ===============================
document.getElementById("search-input").addEventListener("input", async function() {
    const query = this.value.toLowerCase().trim();
    const data = await loadData();

    if (query === "") {
        contentDiv.innerHTML = `<p>Start typing to search topics...</p>`;
        return;
    }

    let results = `<h3>Search Results for "${query}"</h3><ul class="topic-list">`;
    let found = false;

    for (const className in data) {
        data[className].topics.forEach(topic => {
            if (topic.toLowerCase().includes(query)) {
                found = true;
                results += `
                    <li class="topic-item">
                        ${topic} <br>
                        <span style="font-size: 13px; color: #777;">(${className})</span>
                        <a href="worksheets/${className}/${topic.replace(/ /g, '_')}.pdf" class="worksheet-btn" target="_blank">
                            📄 Download Worksheet
                        </a>
                    </li>
                `;
            }
        });
    }

    results += `</ul>`;

    if (!found) {
        results = `<p>No topics found for "${query}". Try another word.</p>`;
    }

    contentDiv.innerHTML = results;
});
