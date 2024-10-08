export class BookViewer {

    constructor(data, base) {
        this.base = base;
        this.search_base = 'https://openlibrary.org/search.json?isbn=';
        this.data = data;
        this.index = 0;

        this.irudia = document.getElementById("irudia");
        this.egilea = document.getElementById("egilea");
        this.izenburua = document.getElementById("izenburua");
        this.dataElem = document.getElementById("data");
        this.isbn = document.getElementById("isbn");
        this.liburuKopuru = document.getElementById("liburuKopuru");

        this.initButtons();
        this.updateView();
    }

    async searchBookByISBN(isbn) {
        try {
            const response = await fetch(this.search_base + isbn);
            const data = await response.json();
            this.handleSearchData(data);
        } catch (error) {
            alert('Error fetching book data');
        }
    }

    initButtons() {
        document.getElementById('aurrera').addEventListener('click', () => this.nextBook());
        document.getElementById('atzera').addEventListener('click', () => this.prevBook());
        document.getElementById('bilatu').addEventListener('click', () => {
            const isbn = this.isbn.value;
            this.searchBookByISBN(isbn);
        });
    }

    extractBookData = (book) => {
        return {
            filename: book.cover_i ? `${book.cover_i}-M.jpg` : "default-cover.jpg",
            izenburua: book.title || "Unknown Title",
            egilea: book.author_name ? book.author_name[0] : "Unknown Author",
            data: book.first_publish_year || "Unknown Year",
            isbn: book.isbn ? book.isbn[0] : "Unknown ISBN"
        };
    };

    addBookToData = (book, data) => {
        const newIndex = data.length;
        data.push(book);
        return newIndex;
    };

    handleSearchData = (data) => {
        if (data.docs && data.docs.length > 0) {
            const bookData = this.extractBookData(data.docs[0]);
            const newIndex = this.addBookToData(bookData, this.data);
            this.index = newIndex;
            this.updateView();
        } else {
            alert("Liburua ez dago");
        }
    };

    updateView() {
        const book = this.data[this.index];
        this.irudia.src = this.base + book.filename;
        this.izenburua.value = book.izenburua;
        this.egilea.value = book.egilea;
        this.dataElem.value = book.data;
        this.isbn.value = book.isbn;
        this.liburuKopuru.innerText = `${this.index + 1}/${this.data.length}`;
    }

    nextBook() {
        if (this.index < this.data.length - 1) {
            this.index++;
            this.updateView();
        }
    }

    prevBook() {
        if (this.index > 0) {
            this.index--;
            this.updateView();
        }
    }
}