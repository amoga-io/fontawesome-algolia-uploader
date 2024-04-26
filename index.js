require("dotenv").config();
const express = require("express");
const algoliasearch = require("algoliasearch");
const fs = require("fs").promises; // Using Node.js File System module with promises

const app = express();
const port = 3000;

// Algolia setup
const client = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
);
const index = client.initIndex(process.env.ALGOLIA_INDEX_NAME);

// Function to read JSON data from file, transform it, and upload to Algolia
async function uploadIconsToAlgolia() {
  try {
    const data = await fs.readFile("data/icons.json", "utf-8");
    const icons = JSON.parse(data);
    const records = Object.keys(icons).map((key) => ({
      objectID: key, // Assign the key directly to objectID
      terms: icons[key].search.terms, // Storing terms as an array
      styles: icons[key].styles, // Storing styles as an array
      label: icons[key].label,
      unicode: icons[key].unicode,
    }));
    const algoliaResponse = await index.saveObjects(records, {
      autoGenerateObjectIDIfNotExist: true,
    });
    console.log("Data uploaded to Algolia successfully:", algoliaResponse);
  } catch (error) {
    console.error(
      "Error reading from file or uploading data to Algolia:",
      error
    );
  }
}

// Endpoint to trigger upload manually
app.get("/upload-icons", async (req, res) => {
  try {
    await uploadIconsToAlgolia();
    res.send("Icons uploaded successfully");
  } catch (error) {
    res.status(500).send("Failed to upload icons to Algolia");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
