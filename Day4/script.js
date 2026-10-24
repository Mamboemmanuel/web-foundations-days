const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

function updateCounts() {
  const text = noteText.value;
  const charLength = text.length;
  
  // Count words by splitting on whitespace
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  charCount.textContent = `${charLength} / 200 characters`;
  wordCount.textContent = `${words} words`;

  // Reset classes and apply warning/over states
  charCount.classList.remove("warning", "over");

  if (charLength > 200) {
    charCount.classList.add("over");
  } else if (charLength > 180) {
    charCount.classList.add("warning");
  }
}

// Save draft and update counts on input
noteText.addEventListener("input", () => {
  updateCounts();
  localStorage.setItem("noteDraft", noteText.value);
});

// Clear functionality for button and Escape key
function clearAll() {
  noteText.value = "";
  localStorage.removeItem("noteDraft");
  updateCounts();
}

clearBtn.addEventListener("click", clearAll);

noteText.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearAll();
  }
});

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  if (isDark) {
    themeToggle.textContent = "Light mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "Dark mode";
    localStorage.setItem("theme", "light");
  }
});

// Restore state on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedDraft = localStorage.getItem("noteDraft");
  if (savedDraft !== null) {
    noteText.value = savedDraft;
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "Light mode";
  } else {
    document.body.classList.remove("dark");
    themeToggle.textContent = "Dark mode";
  }

  updateCounts();
});