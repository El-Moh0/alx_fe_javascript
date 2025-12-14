// ===============================
// Storage Keys & Server URL
// ===============================
const STORAGE_KEY = "dynamicQuotes";
const SESSION_KEY = "lastViewedQuote";
const FILTER_KEY = "selectedCategory";
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Mock API

// ===============================
// Load Quotes from Local Storage
// ===============================
let quotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "JavaScript is the language of the web.", category: "Programming" }
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

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  populateCategories();
  filterQuotes();

  textInput.value = "";
  categoryInput.value = "";

  // Post the new quote to the server
  postQuoteToServer(newQuote);
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
function exportToJsonFile() {
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

      if (!Array.isArray(importedQuotes)) throw new Error("Invalid JSON format");

      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      filterQuotes();

      alert("Quotes imported successfully!");
    } catch (error) {
      alert("Error importing quotes: Invalid file.");
    }
  };

  fileReader.readAsText(event.target.files[0]);
}

// ===============================
// Category Filtering Functions
// ===============================
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  categorySelect.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  const savedFilter = localStorage.getItem(FILTER_KEY);
  if (savedFilter) categorySelect.value = savedFilter;
}

function filterQuotes() {
  const categorySelect = document.getElementById("categoryFilter");
  const selectedCategory = categorySelect.value;

  localStorage.setItem(FILTER_KEY, selectedCategory);

  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  quoteDisplay.innerHTML = "";
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  filteredQuotes.forEach(q => {
    const p = document.createElement("p");
    p.innerHTML = `"${q.text}" <br><small>Category: ${q.category}</small>`;
    quoteDisplay.appendChild(p);
  });
}

// ===============================
// Server Interaction
// ===============================
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    const serverQuotes = data.map(item => ({
      text: item.title || "No text",
      category: item.body || "Uncategorized"
    }));

    let updated = false;

    serverQuotes.forEach(sq => {
      const exists = quotes.some(lq => lq.text === sq.text && lq.category === sq.category);
      if (!exists) {
        quotes.push(sq);
        updated = true;
      }
    });

    if (updated) {
      saveQuotes();
      populateCategories();
      filterQuotes();
      alert("Quotes have been synced with the server!");
    }
  } catch (error) {
    console.error("Error fetching server quotes:", error);
  }
}

async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "appl
