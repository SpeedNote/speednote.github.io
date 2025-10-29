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
const categoryInput = document.getElementById("categoryInput");
const showAllBtn = document.getElementById("showAllBtn");

// =====================
// STATE
// =====================
let notes = [];
let editingId = null;
let currentCategory = "";

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
    if (note) {
      note.content = content;
      note.category = categoryInput.value.trim();
    }
    editingId = null;
  } else {
    notes.push({
      id: Date.now(),
      content,
      highlight: null,
      category: categoryInput.value.trim() || ""
    });
  }

  editor.innerText = "";
  categoryInput.value = "";
  currentCategory = "";
  renderNotes();
  showSaveReminder();
  saveToLocal();
}

// Save reminder
function showSaveReminder() {
  saveReminder.classList.remove("hidden");
  setTimeout(() => saveReminder.classList.add("hidden"), 3000);
}

// Render notes (with optional search and category filter)
function renderNotes(searchQuery = "", categoryFilter = "") {
  notesContainer.innerHTML = "";

  if (categoryFilter) {
    showAllBtn.classList.remove("hidden");
  } else {
    showAllBtn.classList.add("hidden");
  }

  [...notes].reverse()
    .filter(note => {
      const matchesSearch = note.content.toLowerCase().includes(searchQuery);
      const matchesCategory = categoryFilter ? note.category === categoryFilter : true;
      return matchesSearch && matchesCategory;
    })
    .forEach(note => {
      const noteDiv = document.createElement("div");
      noteDiv.className = `text-xl border-4 border-transparent py-2 pl-2 pr-1 flex justify-between items-start gap-2 bg-gray-50`;
      noteDiv.style.borderColor = note.highlight || "transparent";

      const text = document.createElement("div");
      text.className = "flex-1 whitespace-pre-wrap";

      // Category label first (above text)
      if (note.category) {
        const catContainer = document.createElement("div");
        catContainer.className = "-mt-2 p-0"
        const cat = document.createElement("div");
        cat.textContent = note.category;
        cat.className = "inline-block text-xs mb-2 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300";
        cat.addEventListener("click", () => {
          renderNotes("", note.category);
        });
        catContainer.appendChild(cat);
        text.appendChild(catContainer);
        // text.appendChild(document.createElement("br"));
      }

      // Then the note text
      const contentSpan = document.createElement("span");
      contentSpan.innerText = note.content;
      text.appendChild(contentSpan);


      const btnGroup = document.createElement("div");
      btnGroup.className = "flex flex-col gap-1 items-end";

      const colors = [
        { value: "yellow" },
        { value: "cyan" },
        { value: "#4ade80" },
        { value: "red" },
      ];

      colors.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "h-4 w-20 text-sm px-2 py-0.5 hover:border-gray-400 rounded-md";
        btn.style.backgroundColor = c.value;
        btn.addEventListener("click", () => {
          note.highlight = note.highlight === c.value ? null : c.value;
          renderNotes(searchInput.value.trim().toLowerCase(), categoryFilter);
          saveToLocal();
        });
        btnGroup.appendChild(btn);
      });

      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "w-20 bg-white border text-black text-sm px-2 py-0.5 rounded-md";
      editBtn.addEventListener("click", () => editNote(note.id));

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "w-20 bg-white border text-black text-sm px-2 py-0.5 rounded-md";
      delBtn.addEventListener("click", () => {
        if (confirm("Delete this note?")) {
          notes = notes.filter(n => n.id !== note.id);
          renderNotes(searchInput.value.trim().toLowerCase(), categoryFilter);
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

// Edit note
function editNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  editor.innerText = note.content;
  categoryInput.value = note.category || "";
  currentCategory = note.category || "";
  editingId = id;
  editor.focus();
}

// Export notes
function saveAllNotes() {
  if (notes.length === 0) return alert("No notes to save.");
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "notes.json";
  a.click();
}

// Import notes
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

// Delete all
function deleteAllNotes() {
  if (confirm("Delete all notes?")) {
    notes = [];
    renderNotes();
    localStorage.removeItem(STORAGE_KEY);
  }
}

// Clear all highlights
clearHighlightsBtn.addEventListener("click", () => {
  if (notes.length === 0) return;
  if (confirm("Remove all highlights from all notes?")) {
    notes.forEach(note => note.highlight = null);
    renderNotes(searchInput.value.trim().toLowerCase());
    saveToLocal();
  }
});

// Search
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  renderNotes(query);
});

// Show all
showAllBtn.addEventListener("click", () => renderNotes());

// Category tracking
categoryInput.addEventListener("input", () => {
  currentCategory = categoryInput.value.trim();
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
