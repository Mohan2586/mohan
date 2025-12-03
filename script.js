// Elements
const bookID = document.getElementById("bookID");
const bookTitle = document.getElementById("bookTitle");
const bookAuthor = document.getElementById("bookAuthor");
const bookDept = document.getElementById("bookDept");
const addBookBtn = document.getElementById("addBookBtn");
const bookContainer = document.getElementById("bookContainer");
const searchBook = document.getElementById("searchBook");
const qrDiv = document.getElementById("qrcode");
const clearQR = document.getElementById("clearQR");
const scanResult = document.getElementById("scanResult");

let books = [];

// Add a new book
addBookBtn.addEventListener("click", () => {
  const id = bookID.value.trim();
  const title = bookTitle.value.trim();
  const author = bookAuthor.value.trim();
  const dept = bookDept.value.trim();

  if (!id || !title || !author || !dept) {
    alert("Please fill all book details!");
    return;
  }

  const newBook = { id, title, author, dept };
  books.push(newBook);
  renderBooks();

  bookID.value = "";
  bookTitle.value = "";
  bookAuthor.value = "";
  bookDept.value = "";
});

// Display book list
function renderBooks() {
  bookContainer.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><b>${book.title}</b> by ${book.author} (${book.dept})</span>
      <button onclick="generateQR('${book.id}')">QR Code</button>
    `;
    bookContainer.appendChild(li);
  });
}

// Search filter
searchBook.addEventListener("input", () => {
  const query = searchBook.value.toLowerCase();
  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(query) ||
      b.author.toLowerCase().includes(query)
  );
  bookContainer.innerHTML = "";
  filtered.forEach((book) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><b>${book.title}</b> by ${book.author} (${book.dept})</span>
      <button onclick="generateQR('${book.id}')">QR Code</button>
    `;
    bookContainer.appendChild(li);
  });
});

// Generate QR Code
function generateQR(bookId) {
  const book = books.find((b) => b.id === bookId);
  if (!book) return;
  qrDiv.innerHTML = "";
  new QRCode(qrDiv, {
    text: `Book ID: ${book.id}\nTitle: ${book.title}\nAuthor: ${book.author}\nDept: ${book.dept}`,
    width: 200,
    height: 200,
  });
}

// Clear QR
clearQR.addEventListener("click", () => (qrDiv.innerHTML = ""));

// QR Code Scanner
function onScanSuccess(decodedText) {
  scanResult.innerHTML = `<b>Book Details:</b><br>${decodedText.replace(
    /\n/g,
    "<br>"
  )}`;
}

function onScanError(errorMessage) {
  // Silent error handling
}

const html5QrCode = new Html5Qrcode("reader");
Html5Qrcode.getCameras()
  .then((devices) => {
    if (devices && devices.length) {
      html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 200 },
        onScanSuccess,
        onScanError
      );
    }
  })
  .catch((err) => console.error("Camera error:", err));
