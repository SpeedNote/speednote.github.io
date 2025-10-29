// =====================
// DOM ELEMENTS
// =====================
const editor = document.getElementById("editor");
const notesContainer = document.getElementById("notesContainer");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const saveAllBtn = document.getElementById("saveAllBtn");
const importBtn = document.getElementById("importBtn");
const deleteAllBtn = document.getElementById("deleteAllBtn");
const saveReminder = document.getElementById("saveReminder");
const searchInput = document.getElementById("searchNotes");
const clearHighlightsBtn = document.getElementById("clearHighlightsBtn");


// =====================
// STATE
// =====================
let notes = [];
let editingId = null;

// =====================
// LOCALSTORAGE HELPERS
// =====================
const STORAGE_KEY = "notesAppData";

function saveToLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function loadFromLocal() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) notes = parsed;
    } catch { /* ignore errors */ }
  }
}

// =====================
// NOTE FUNCTIONS
// =====================

// Save or update note
function saveNote() {
  const content = editor.innerText.trim();
  if (!content) return alert("Note cannot be empty.");

  if (editingId) {
    const note = notes.find(n => n.id == editingId);
    if (note) note.content = content;
    editingId = null;
  } else {
    notes.push({ id: Date.now(), content, highlight: null });
  }

  editor.innerText = "";
  renderNotes();
  showSaveReminder();
  saveToLocal(); // save automatically
}

// Show inline save reminder for 3 seconds
function showSaveReminder() {
  saveReminder.classList.remove("hidden");
  setTimeout(() => saveReminder.classList.add("hidden"), 3000);
}

// Render all notes (latest at top)
function renderNotes(searchQuery = "") {
  notesContainer.innerHTML = "";

  // Show newest first
  [...notes].reverse()
    .filter(note => note.content.toLowerCase().includes(searchQuery)) // filter by search
    .forEach(note => {
      const noteDiv = document.createElement("div");
      // Base styles
      noteDiv.className = `text-xl border-4 border-transparent p-3 flex justify-between items-start gap-2 bg-gray-50`;
      noteDiv.style.borderColor = note.highlight || "transparent";


      // Highlight border
      switch (note.highlight) {
        case "yellow":
          noteDiv.classList.add("border-4");
          break;
        case "cyan":
          noteDiv.classList.add("border-4");
          break;
        case "green":
          noteDiv.classList.add("border-4");
          break;
        case "red":
          noteDiv.classList.add("border-4");
          break;
        default:
          noteDiv.classList.add("border-transparent");
          break;
      }

      const text = document.createElement("div");
      text.className = "flex-1 whitespace-pre-wrap";
      text.innerText = note.content;

      const btnGroup = document.createElement("div");
      btnGroup.className = "flex flex-col gap-1 items-end";

      // Highlight buttons
      const colors = [
        { name: "Yellow", value: "yellow" },
        { name: "Cyan", value: "cyan" },
        { name: "Green", value: "#4ade80" },
        { name: "Red", value: "red" },
      ];

      colors.forEach(c => {
        const btn = document.createElement("button");
        // btn.textContent = c.name;
        btn.className = "h-4 w-20 text-sm px-2 py-0.5 hover:border-gray-400 rounded-md";
        btn.style.backgroundColor = c.value;
        btn.addEventListener("click", () => {
          note.highlight = note.highlight === c.value ? null : c.value;
          renderNotes(searchInput.value.trim().toLowerCase());
          saveToLocal();
        });
        btnGroup.appendChild(btn);
      });

      // Edit & Delete
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "w-20 bg-white border text-black text-sm px-2 py-0.5 rounded-md";
      editBtn.addEventListener("click", () => editNote(note.id));

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "w-20 bg-white border text-black text-sm px-2 py-0.5 rounded-md";
      delBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this note? This will also remove it from localStorage.")) {
          notes = notes.filter(n => n.id !== note.id);
          renderNotes(searchInput.value.trim().toLowerCase());
          saveToLocal();
        }
      });

      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(delBtn);

      noteDiv.appendChild(text);
      noteDiv.appendChild(btnGroup);

      notesContainer.appendChild(noteDiv);
    });
}



// Edit note (keep original visible)
function editNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  editor.innerText = note.content;
  editingId = id;
  editor.focus();
}

// Save all notes as JSON
function saveAllNotes() {
  if (notes.length === 0) return alert("No notes to save.");
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "notes.json";
  a.click();
}

// Import notes from JSON
function importNotes() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          notes = imported;
          renderNotes();
          saveToLocal();
        } else {
          alert("Invalid JSON format.");
        }
      } catch {
        alert("Error reading JSON file.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// Delete all notes
function deleteAllNotes() {
  if (confirm("Delete all notes?")) {
    notes = [];
    renderNotes();
    localStorage.removeItem(STORAGE_KEY);
  }
}

// =====================
// SEARCH
// =====================
// Filter and render notes based on search query
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  renderNotes(query);
});


// =====================
// CLEAR ALL HIGHTLIGHTS
// =====================
clearHighlightsBtn.addEventListener("click", () => {
  if (notes.length === 0) return;

  if (confirm("Remove all highlights from all notes?")) {
    notes.forEach(note => note.highlight = null); // remove all highlights
    renderNotes(searchInput.value.trim().toLowerCase());
    saveToLocal(); // update localStorage
  }
});


// =====================
// EVENT LISTENERS
// =====================
saveNoteBtn.addEventListener("click", saveNote);
saveAllBtn.addEventListener("click", saveAllNotes);
importBtn.addEventListener("click", importNotes);
deleteAllBtn.addEventListener("click", deleteAllNotes);

// =====================
// INIT
// =====================
loadFromLocal();
renderNotes();
