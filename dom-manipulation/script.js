// ===============================
// Quotes Data (Array of Objects)
// ===============================
const quotes = [
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
// Show Random Quote Function
// ===============================
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>Category: ${randomQuote.category}</small>
  `;
}

// ===============================
// Add Quote Function (Dynamic)
// ===============================
function addQuote() {
  const quoteTextInput = document.getElementById("newQuoteText");
  const quoteCategoryInput = document.getElementById("newQuoteCategory");

  const text = quoteTextInput.value.trim();
  const category = quoteCategoryInput.value.trim();

  // Validation
  if (text === "" || category === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add new quote to array
  quotes.push({ text, category });

  // Clear input fields
  quoteTextInput.value = "";
  quoteCategoryInput.value = "";

  // Show the newly added quote
  showRandomQuote();
}

// ===============================
// Create Add Quote Form Dynamically
// ===============================
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// ===============================
// Event Listeners
// ===============================
newQuoteBtn.addEventListener("click", showRandomQuote);

// ===============================
// Initialize App
// ===============================
createAddQuoteForm();
showRandomQuote();
