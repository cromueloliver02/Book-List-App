// Book Constructor
class Book {
   constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
   }
}

// UI Constructor
class UI {
   // Get Current Year
   getYear() {
      const year = new Date().getFullYear();

      return year;
   }

   // Hide Book Table
   hideTable() {
      document.getElementById('book-table').classList.remove('d-block');
      document.getElementById('book-table').classList.add('d-none');
   }

   // Show Book Table
   showTable() {
      document.getElementById('book-table').classList.remove('d-none');
      document.getElementById('book-table').classList.add('d-block');
   }

   // Add Book To List
   addBookToList(book) {
      const bookList = document.getElementById('book-list');
      const row = document.createElement('tr');
      row.innerHTML = `
         <td>${book.title}</td>
         <td>${book.author}</td>
         <td>${book.isbn}</td>
         <td>
            <a class="delete-btn text-danger" href="#">
               <i class="fas fa-trash-alt"></i>
            </a>
         </td>
      `;
      bookList.appendChild(row);
   }

   // Clear Fields
   clearFields() {
      document.getElementById('title').value = ''
      document.getElementById('author').value = '';
      document.getElementById('isbn').value = '';
   }

   // Show Message Alert
   showMessage(message, className) {
      if (document.querySelector('.alert') === null) {
         const topBox = document.getElementById('top-box');
         const bookForm = document.getElementById('book-form');
         const div = document.createElement('div');
         div.appendChild(document.createTextNode(message));
         div.className = `alert ${className}`;
         topBox.insertBefore(div, bookForm);

         // Vanishes After 3 Seconds
         setTimeout(function () {
            document.querySelector('.alert').remove();
         }, 3000);
      }
   }

   // Remove Book From The Book List
   removeBookFromBookList(target) {
      if (target.parentElement.classList.contains('delete-btn')) {
         target.parentElement.parentElement.parentElement.remove();
      }
   }
}

// Storage Constructor
class Storage {
   // Check if LS Is Empty
   static isEmpty() {
      if (Storage.getBooksFromLS().length === 0) {
         return true;
      } else {
         return false;
      }
   }

   // Get Books From LS
   static getBooksFromLS() {
      let books;
      if (localStorage.getItem('books') === null) {
         books = [];
      } else {
         books = JSON.parse(localStorage.getItem('books'));
      }

      return books;
   }

   // Add Book To LS
   static addBookToLS(book) {
      const books = Storage.getBooksFromLS();

      books.push(book);

      // Send to LS
      localStorage.setItem('books', JSON.stringify(books));
   }

   // Display Books From LS
   static displayBooksFromLS() {
      const books = Storage.getBooksFromLS();

      books.forEach(function (book) {
         new UI().addBookToList(book);
      });
   }

   // Remove Book From LS
   static removeBookFromLS(isbn) {
      const books = Storage.getBooksFromLS();

      books.forEach(function (book, index) {
         if (book.isbn === isbn) {
            books.splice(index, 1);
         }
      });

      localStorage.setItem('books', JSON.stringify(books));
   }
}

// Add Book Event Listener
document.getElementById('book-form').addEventListener('submit', function (e) {
   // Get Form Values
   const title = document.getElementById('title').value,
      author = document.getElementById('author').value,
      isbn = document.getElementById('isbn').value;

   // Validate Inputs
   if (title === '' || author === '' || isbn === '') {
      // Show Error Message
      new UI().showMessage('Please fill in all the fields!', 'alert-danger');
   } else {
      // Add Book To Book List
      new UI().addBookToList(new Book(title, author, isbn));

      // Add Book To LS
      Storage.addBookToLS(new Book(title, author, isbn));

      // Show Book Table
      new UI().showTable();

      // Show Success Message
      new UI().showMessage('Book Added!', 'alert-success');

      // Clear All Fields
      new UI().clearFields();
   }

   e.preventDefault();
});

// Remove Book Event Listener
document.getElementById('book-list').addEventListener('click', function (e) {
   new UI().removeBookFromBookList(e.target);

   Storage.removeBookFromLS(e.target.parentElement.parentElement.previousElementSibling.textContent);

   if (Storage.isEmpty()) {
      new UI().hideTable();
   }

   e.preventDefault();
});

// Load All Books From LS On Load
document.addEventListener('DOMContentLoaded', function () {
   if (Storage.isEmpty()) {
      new UI().hideTable();
   } else {
      new UI().showTable();

      Storage.displayBooksFromLS()
   }
});

// Display Current Year
document.getElementById('year').textContent = new UI().getYear();