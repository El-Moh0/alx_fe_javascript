// ===============================
// Storage Keys
// ===============================
const STORAGE_KEY = "dynamicQuotes";
const SESSION_KEY = "lastViewedQuote";

// ===============================
// Load Quotes from Local Storage
// ===============================
let quotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    category: "Motivation"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life"
  },
  {
    text: "JavaScript is the language of the web.",
    category: "Programming"
  }
];

// ===============================
// DOM Elements
// ===============================
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// ===============================
// Save Quotes to Local Storage
// ===============================
function saveQuotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
}

// ===============================
// Show Random Quote
// ===============================
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>Category: ${randomQuote.category}</small>
  `;

  // Save last viewed quote in session storage
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(randomQuote));
}

// ===============================
// Add New Quote
// ===============================
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please enter both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  textInput.value = "";
  categoryInput.value = "";

  showRandomQuote();
}

// ===============================
// Create Add Quote Form Dynamically
// ===============================
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addBtn);

  document.body.appendChild(formDiv);
}

// ===============================
// Export Quotes to JSON File
// ===============================
function exportToJson() {
  const jsonData = JSON.stringify(quotes, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();

  URL.revokeObjectURL(url);
}

// ===============================
// Import Quotes from JSON File
// ===============================
function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);

      if (!Array.isArray(importedQuotes)) {
        throw new Error("Invalid JSON format");
      }

      quotes.push(...importedQuotes);
      saveQuotes();

      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing quotes: Invalid file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// ===============================
// Create Import / Export Controls
// ===============================
function createImportExportControls() {
  const container = document.createElement("div");

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes (JSON)";
  exportBtn.addEventListener("click", exportToJson);

  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.accept = ".json";
  importInput.addEventListener("change", importFromJsonFile);

  container.appendChild(exportBtn);
  container.appendChild(importInput);

  document.body.appendChild(container);
}

// ===============================
// Event Listeners
// ===============================
newQuoteBtn.addEventListener("click", showRandomQuote);

// ===============================
// Initialize Application
// ===============================
createAddQuoteForm();
createImportExportControls();

// Restore last viewed quote (session storage)
const lastQuote = sessionStorage.getItem(SESSION_KEY);
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  quoteDisplay.innerHTML = `
    <p>"${quote.text}"</p>
    <small>Category: ${quote.category}</small>
  `;
} else {
  showRandomQuote();
}
