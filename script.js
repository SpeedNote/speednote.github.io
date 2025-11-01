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
const categoryFilterDropdown = document.getElementById("categoryFilterDropdown");

let notes = [];
let editingId = null;
let activeCategoryFilter = "";

// =====================
// LOCAL STORAGE
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
    } catch {}
  }
}

// =====================
// SAVE NOTE
// =====================
function saveNote() {
  // Normalize editor content to preserve single user line breaks
  let content = editor.innerHTML
    .replace(/<div><br><\/div>/g, '\n')  // empty divs → single newline
    .replace(/<div>/g, '\n')             // divs → newline
    .replace(/<\/div>/g, '')              // remove closing div
    .replace(/<br\s*\/?>/g, '\n')        // <br> → newline
    .replace(/\r\n?/g, '\n');            // normalize Windows newlines

  // Remove leading & trailing newlines
  content = content.replace(/^\n+/, '').replace(/\n+$/g, '');

  const categories = categoryInput.value
    .split(",")
    .map(c => c.trim())
    .filter(Boolean)
    .join(",");

  if (!content.trim()) return alert("Note cannot be empty.");

  if (editingId) {
    const note = notes.find(n => n.id === editingId);
    if (note) {
      note.content = content;
      note.category = categories;
    }
    editingId = null;
  } else {
    notes.push({
      id: Date.now(),
      content,
      highlight: null,
      category: categories,
      pinned: false
    });
  }

  editor.innerHTML = ""; // clear editor
  categoryInput.value = "";
  activeCategoryFilter = "";
  renderNotes();
  showSaveReminder();
  saveToLocal();
}


// =====================
// SHOW SAVE REMINDER
// =====================
function showSaveReminder() {
  saveReminder.classList.remove("hidden");
  setTimeout(() => saveReminder.classList.add("hidden"), 3000);
}

// =====================
// RENDER NOTES
// =====================
function renderNotes(searchQuery = "", filterCategory = "", strictCategory = false) {
  if (filterCategory) activeCategoryFilter = filterCategory;
  notesContainer.innerHTML = "";

  // Sort: pinned first
  const sortedNotes = [...notes].sort((a, b) => {
    // pinned notes first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    // newest first (higher timestamp first)
    return b.id - a.id;
  });

  // Filter notes
  sortedNotes
    .filter(note => {
      const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeCategoryFilter) {
        if (!note.category) return false;
        const categories = note.category.split(",").map(c => c.trim().toLowerCase());
        return strictCategory
          ? categories.includes(activeCategoryFilter.toLowerCase())
          : categories.some(c => c.includes(activeCategoryFilter.toLowerCase()));
      }

      return matchesSearch;
    })
    .forEach(note => {
      const noteDiv = document.createElement("div");
      noteDiv.className =
        "text-xl border-4 border-transparent py-2 pl-2 pr-1 flex justify-between items-start gap-2 bg-gray-50";
      noteDiv.style.borderColor = note.highlight || "transparent";

      // Text container
      const text = document.createElement("div");
      text.className = "flex-1 whitespace-pre-wrap";

      // Categories above text
      if (note.category) {
        const catContainer = document.createElement("div");
        catContainer.className = "-mt-2 p-0 flex flex-wrap gap-1";

        note.category
          .split(",")
          .map(c => c.trim())
          .filter(Boolean)
          .forEach(catName => {
            const cat = document.createElement("div");
            cat.textContent = catName;
            cat.className =
              "inline-block text-xs my-2 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 cursor-pointer hover:bg-gray-300";
            cat.addEventListener("click", () => {
              activeCategoryFilter = catName;
              categoryFilterDropdown.value = catName;
              renderNotes(searchInput.value.trim().toLowerCase(), catName, true);
            });
            catContainer.appendChild(cat);
          });

        text.appendChild(catContainer);
      }

      // Note content with exact line breaks
      const contentDiv = document.createElement("div");
      contentDiv.className = "whitespace-pre-wrap";
      note.content.split("\n").forEach((line, index, arr) => {
        contentDiv.appendChild(document.createTextNode(line));
        if (index < arr.length - 1) contentDiv.appendChild(document.createElement("br"));
      });
      text.appendChild(contentDiv);

      // Button group
      const btnGroup = document.createElement("div");
      btnGroup.className = "flex flex-col gap-1 items-end";

      // Highlight buttons
      const colors = ["yellow", "cyan", "#4ade80", "red"];
      colors.forEach(c => {
        const btn = document.createElement("button");
        btn.className = "h-4 w-20 text-sm px-2 py-0.5 hover:border-gray-400 rounded-md";
        btn.style.backgroundColor = c;
        btn.addEventListener("click", () => {
          note.highlight = note.highlight === c ? null : c;
          renderNotes(searchInput.value.trim().toLowerCase(), activeCategoryFilter, true);
          saveToLocal();
        });
        btnGroup.appendChild(btn);
      });

      // Pin button
      const pinBtn = document.createElement("button");
      pinBtn.textContent = note.pinned ? "Unpin" : "Pin";
      pinBtn.className = "w-20 bg-white border text-black text-sm px-2 py-0.5 rounded-md";
      pinBtn.addEventListener("click", () => {
        note.pinned = !note.pinned;
        renderNotes(searchInput.value.trim().toLowerCase(), activeCategoryFilter, true);
        saveToLocal();
      });
      btnGroup.appendChild(pinBtn);

      // Edit & Delete
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
          renderNotes(searchInput.value.trim().toLowerCase(), activeCategoryFilter, true);
          saveToLocal();
        }
      });

      btnGroup.appendChild(editBtn);
      btnGroup.appendChild(delBtn);

      noteDiv.appendChild(text);
      noteDiv.appendChild(btnGroup);
      notesContainer.appendChild(noteDiv);
    });

  updateCategoryDropdown();
  renderResetCategoryButton();
}

// =====================
// CATEGORY DROPDOWN
// =====================
function updateCategoryDropdown() {
  const allCategories = Array.from(
    new Set(notes.flatMap(note =>
      (note.category || "").split(",").map(c => c.trim()).filter(Boolean)
    ))
  ).sort();

  categoryFilterDropdown.innerHTML = `<option value="">-- Filter by category --</option>`;
  allCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    if (cat.toLowerCase() === activeCategoryFilter.toLowerCase()) opt.selected = true;
    categoryFilterDropdown.appendChild(opt);
  });
}

// Listen to dropdown change
categoryFilterDropdown.addEventListener("change", () => {
  const selected = categoryFilterDropdown.value;
  activeCategoryFilter = selected;
  renderNotes(searchInput.value.trim().toLowerCase(), selected, true);
});

// Reset button
function renderResetCategoryButton() {
  let resetBtn = document.getElementById("resetCategoryBtn");
  if (!resetBtn) {
    resetBtn = document.createElement("button");
    resetBtn.id = "resetCategoryBtn";
    resetBtn.className =
      "px-2 py-0.5 border border-gray-400 rounded-sm text-sm hover:bg-gray-200 mb-2 w-36";
    resetBtn.textContent = "Reset Categories";
    document.getElementById("notesContainer").before(resetBtn);
  }
  resetBtn.style.display = activeCategoryFilter ? "inline-block" : "none";
  resetBtn.onclick = () => {
    activeCategoryFilter = "";
    categoryFilterDropdown.value = "";
    renderNotes(searchInput.value.trim().toLowerCase());
  };
}

// =====================
// EDIT NOTE
// =====================
function editNote(id) {
  const note = notes.find(n => n.id === id);
  if (!note) return;
  editor.innerText = note.content;
  categoryInput.value = note.category || "";
  editingId = id;
  editor.focus();
}

// =====================
// EXPORT / IMPORT
// =====================
function saveAllNotes() {
  if (!notes.length) return alert("No notes to save.");
  const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "speednote.json";
  a.click();
}

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
        } else alert("Invalid JSON format.");
      } catch {
        alert("Error reading JSON file.");
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

// =====================
// DELETE ALL
// =====================
function deleteAllNotes() {
  if (confirm("Delete all notes?")) {
    notes = [];
    renderNotes();
    localStorage.removeItem(STORAGE_KEY);
  }
}

// =====================
// CLEAR HIGHLIGHTS
// =====================
clearHighlightsBtn.addEventListener("click", () => {
  if (!notes.length) return;
  if (confirm("Remove all highlights from all notes?")) {
    notes.forEach(note => (note.highlight = null));
    renderNotes(searchInput.value.trim().toLowerCase());
    saveToLocal();
  }
});

// =====================
// SEARCH
// =====================
searchInput.addEventListener("input", () => {
  renderNotes(searchInput.value.trim().toLowerCase());
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
