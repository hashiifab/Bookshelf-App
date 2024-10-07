let books = [];
let currentEditingBookId = null;

// Simpan data buku ke localStorage
function saveToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

// Memuat data buku dari localStorage
function loadFromLocalStorage() {
  let storedBooks = localStorage.getItem("books");
  if (storedBooks) {
    books = JSON.parse(storedBooks);
    displayBooks();
  }
}

// Fungsi untuk menambah buku baru
function addBook() {
  let title = document.getElementById("bookFormTitle").value;
  let author = document.getElementById("bookFormAuthor").value;
  let year = parseInt(document.getElementById("bookFormYear").value);
  let isComplete = document.getElementById("bookFormIsComplete").checked;

  let newBook = {
    id: Date.now(),
    title: title,
    author: author,
    year: year,
    isComplete: isComplete,
  };

  books.push(newBook);
  saveToLocalStorage();
  displayBooks();
  showNotification(`Buku "${title}" berhasil disimpan!`);

  // Reset form setelah buku ditambahkan
  document.getElementById("bookForm").reset();
}

// Menampilkan daftar buku pada halaman
function displayBooks() {
  let incompleteBookList = document.getElementById("incompleteBookList");
  let completeBookList = document.getElementById("completeBookList");

  // Bersihkan list sebelum menambah data baru
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  // Menampilkan setiap buku sesuai dengan status selesai dibaca atau belum
  books.forEach((book) => {
    let bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.classList.add("book-item");
    bookItem.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button onclick="toggleComplete(${
                  book.id
                })" data-testid="bookItemIsCompleteButton">
                    ${book.isComplete ? "Belum Selesai" : "Selesai"}
                </button>
                <button onclick="confirmDelete(${
                  book.id
                })" data-testid="bookItemDeleteButton">Hapus</button>
                <button onclick="openEditModal(${book.id})">Edit</button>
            </div>
        `;

    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
}

// Konfirmasi penghapusan buku
function confirmDelete(bookId) {
  let confirmAction = confirm("Apakah Anda yakin ingin menghapus buku ini?");
  if (confirmAction) {
    deleteBook(bookId);
  }
}

// Hapus buku dari daftar
function deleteBook(bookId) {
  let bookToDelete = books.find((book) => book.id === bookId);
  books = books.filter((book) => book.id !== bookId);
  saveToLocalStorage();
  displayBooks();
  showNotification(`Buku "${bookToDelete.title}" berhasil dihapus!`);
}

// Toggle status selesai dibaca
function toggleComplete(bookId) {
  let book = books.find((book) => book.id === bookId);
  book.isComplete = !book.isComplete;
  saveToLocalStorage();
  displayBooks();
  showNotification(`Status buku "${book.title}" diperbarui!`);
}

// Cari buku berdasarkan judul, penulis, atau tahun
function searchBooks() {
  let searchQuery = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  let filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery) ||
      book.author.toLowerCase().includes(searchQuery) ||
      book.year.toString().includes(searchQuery)
  );
  displayFilteredBooks(filteredBooks);
}

// Tampilkan buku yang dicari
function displayFilteredBooks(filteredBooks) {
  let incompleteBookList = document.getElementById("incompleteBookList");
  let completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    let bookItem = document.createElement("div");
    bookItem.setAttribute("data-bookid", book.id);
    bookItem.setAttribute("data-testid", "bookItem");
    bookItem.classList.add("book-item");
    bookItem.innerHTML = `
            <h3 data-testid="bookItemTitle">${book.title}</h3>
            <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
            <p data-testid="bookItemYear">Tahun: ${book.year}</p>
            <div>
                <button onclick="toggleComplete(${
                  book.id
                })" data-testid="bookItemIsCompleteButton">
                    ${book.isComplete ? "Belum Selesai" : "Selesai"}
                </button>
                <button onclick="confirmDelete(${
                  book.id
                })" data-testid="bookItemDeleteButton">Hapus</button>
                <button onclick="openEditModal(${book.id})">Edit</button>
            </div>
        `;

    if (book.isComplete) {
      completeBookList.appendChild(bookItem);
    } else {
      incompleteBookList.appendChild(bookItem);
    }
  });
}

// Notifikasi pop-up
function showNotification(message) {
  let notification = document.getElementById("notification");
  notification.textContent = message;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Modal edit buku
function openEditModal(bookId) {
  let bookToEdit = books.find((book) => book.id === bookId);
  document.getElementById("editBookFormTitle").value = bookToEdit.title;
  document.getElementById("editBookFormAuthor").value = bookToEdit.author;
  document.getElementById("editBookFormYear").value = bookToEdit.year;
  document.getElementById("editBookFormIsComplete").checked =
    bookToEdit.isComplete;

  currentEditingBookId = bookId;
  document.getElementById("editModal").style.display = "block";
}

// Tutup modal edit
function closeEditModal() {
  document.getElementById("editModal").style.display = "none";
}

// Update buku setelah edit
function updateBook() {
  let title = document.getElementById("editBookFormTitle").value;
  let author = document.getElementById("editBookFormAuthor").value;
  let year = parseInt(document.getElementById("editBookFormYear").value);
  let isComplete = document.getElementById("editBookFormIsComplete").checked;

  let bookToUpdate = books.find((book) => book.id === currentEditingBookId);
  bookToUpdate.title = title;
  bookToUpdate.author = author;
  bookToUpdate.year = year;
  bookToUpdate.isComplete = isComplete;

  saveToLocalStorage();
  displayBooks();
  showNotification(`Buku "${title}" berhasil diperbarui!`);
  closeEditModal();
}

// Event listener untuk form dan tombol
document.getElementById("bookForm").addEventListener("submit", function (e) {
  e.preventDefault();
  addBook();
});

document.getElementById("searchBook").addEventListener("submit", function (e) {
  e.preventDefault();
  searchBooks();
});

document
  .getElementById("editBookForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    updateBook();
  });

// Memuat data buku saat pertama kali halaman dibuka
loadFromLocalStorage();
