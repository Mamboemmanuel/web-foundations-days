let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

const VALID_CATEGORIES = ["personal", "work", "study"];

/* 1. searchNotes - filter + toLowerCase + includes */
function searchNotes(word) {
  const needle = String(word).toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(needle));
}

/* 2. longestNote - empty array first, then compare lengths */
function longestNote() {
  if (notes.length === 0) return null;
  let longest = notes[0];
  for (const note of notes) {
    if (note.text.length > longest.text.length) longest = note;
  }
  return longest;
}

/* 3. countByCategory - loop and increase a counter in an object */
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

/* 4. getSummary - uses countByCategory + template literal */
function getSummary() {
  const counts = countByCategory();
  const word = notes.length === 1 ? "note" : "notes";
  const parts = Object.entries(counts)
    .map(([category, n]) => `${n} ${category}`)
    .join(", ");
  return `${notes.length} ${word}: ${parts}.`;
}

/* 5. isDuplicate - some(), trimmed lower-case comparison */
function isDuplicate(text) {
  const clean = String(text).trim().toLowerCase();
  return notes.some((note) => note.text.trim().toLowerCase() === clean);
}

/* 6. addNote - length, category and duplicate checks before pushing */
function addNote(text, category) {
  const trimmed = typeof text === "string" ? text.trim() : "";
  if (trimmed.length < 1 || trimmed.length > 200) {
    console.log("addNote rejected: text must be between 1 and 200 characters.");
    return false;
  }
  if (!VALID_CATEGORIES.includes(category)) {
    console.log(`addNote rejected: "${category}" is not one of ${VALID_CATEGORIES.join(", ")}.`);
    return false;
  }
  if (isDuplicate(trimmed)) {
    console.log("addNote rejected: a note with that text already exists.");
    return false;
  }
  const nextId = notes.reduce((max, note) => Math.max(max, note.id), 0) + 1;
  notes.push({ id: nextId, text: trimmed, category });
  console.log(`addNote accepted: added note #${nextId}.`);
  return true;
}

/* ============================================================
   TESTS - each function has a normal case and an edge case
   ============================================================ */

console.log("--- searchNotes ---");
console.log(searchNotes("MILK"));
// expected: [{ id: 1, text: "Buy milk and bread", category: "personal" }]

console.log(searchNotes("zzz"));
// expected: []  (no matches)

console.log("--- longestNote ---");
console.log(longestNote());
// expected: { id: 3, text: "Email the project report to Grace", category: "work" }

const savedNotes = notes;
notes = [];
console.log(longestNote());
// expected: null  (empty array)
notes = savedNotes;

console.log("--- countByCategory ---");
console.log(countByCategory());
// expected: { personal: 2, study: 2, work: 1 }

notes.push({ id: 6, text: "Book dentist appointment", category: "health" });
console.log(countByCategory());
// expected: { personal: 2, study: 2, work: 1, health: 1 }  (unknown category still counted)
notes.pop();

console.log("--- getSummary ---");
console.log(getSummary());
// expected: "5 notes: 2 personal, 2 study, 1 work."

notes = [{ id: 1, text: "Only one note here", category: "work" }];
console.log(getSummary());
// expected: "1 note: 1 work."  (singular "note")
notes = savedNotes;

console.log("--- isDuplicate ---");
console.log(isDuplicate("call MUM"));
// expected: true  (case ignored)

console.log(isDuplicate("   CALL mum   "));
// expected: true  (extra spaces ignored)

console.log(isDuplicate("Water the plants"));
// expected: false

console.log("--- addNote ---");
console.log(addNote("Pay the electricity bill", "personal"));
// logs: addNote accepted: added note #6.
// expected: true

console.log(add