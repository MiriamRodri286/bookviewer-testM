import { BookViewer } from "../js/bookviewer.js";
import { datubasea } from "../js/datubasea.js";

describe("BookViewer", () => {

    let bookViewer;
    let base = "https://covers.openlibrary.org/b/id/";

    beforeEach(() => {
        // Setup Mock HTML elements
        document.body.innerHTML = `
            <img id="irudia" />
            <input id="egilea" />
            <input id="izenburua" />
            <input id="data" />
            <input id="isbn" />
            <button id="aurrera"></button>
            <button id="atzera"></button>
            <button id="bilatu"></button>
            <span id="liburuKopuru"></span>
        `;

        bookViewer = new BookViewer(datubasea, base);
    });

    test("should initialize correctly", () => {
        expect(bookViewer.index).toBe(0);
        expect(bookViewer.data).toEqual(datubasea);
        expect(bookViewer.base).toBe(base);
        expect(bookViewer.irudia.src).toBe(base + datubasea[0].filename);
    });

    test("should go to next book and update view correctly", () => {
        bookViewer.nextBook();
        expect(bookViewer.index).toBe(1);
        expect(bookViewer.irudia.src).toBe(base + datubasea[1].filename);
    });

    test("should not go beyond the last book", () => {
        bookViewer.index = datubasea.length - 1;
        bookViewer.nextBook();
        expect(bookViewer.index).toBe(datubasea.length - 1);
    });

    test("should go to previous book and update view correctly", () => {
        bookViewer.index = 1;
        bookViewer.prevBook();
        expect(bookViewer.index).toBe(0);
        expect(bookViewer.irudia.src).toBe(base + datubasea[0].filename);
    });

    test("should not go beyond the first book", () => {
        bookViewer.index = 0;
        bookViewer.prevBook();
        expect(bookViewer.index).toBe(0);
    });


    test("should add book to data", () => {
        const bookViewer = new BookViewer(datubasea, "base-url");
        
        const newBook = {
            filename: 'new-book.jpg',
            izenburua: 'New Book',
            egilea: 'Author Name',
            data: '2023',
            isbn: '1234567890'
        };
        
        const initialLength = bookViewer.data.length;
        const index = bookViewer.addBookToData(newBook, bookViewer.data);
        
        expect(bookViewer.data.length).toBe(initialLength + 1);
        expect(index).toBe(initialLength);
        expect(bookViewer.data[index]).toEqual(newBook);
    });

    test("should handle search data", () => {
        const bookViewer = new BookViewer(datubasea, "base-url");
        
        const book = {
            cover_i: 'cover-id',
            title: 'Test Book',
            author_name: 'Test Author',
            first_publish_year: '2023'
        };
        
        const initialLength = bookViewer.data.length;
        bookViewer.handleSearchData({ docs: [book] });
        
        expect(bookViewer.data.length).toBe(initialLength + 1);
        expect(bookViewer.index).toBe(initialLength);
        expect(bookViewer.izenburua.value).toBe(book.title);
    });

    test("should fetch and display book data based on ISBN", async () => {
        const bookViewer = new BookViewer(datubasea, "base-url");
        
        const mockSuccessResponse = {
            docs: [{
                cover_i: 'cover-id',
                title: 'Test Book',
                author_name: 'Test Author',
                first_publish_year: '2023'
            }]
        };
        const mockJsonPromise = Promise.resolve(mockSuccessResponse);
        const mockFetchPromise = Promise.resolve({ json: () => mockJsonPromise });
        
        global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
        
        bookViewer.isbn.value = '1234567890';
        document.querySelector('#bilatu').click();
        
        // Since we are dealing with Promises, we need to wait for them to resolve
        await new Promise(r => setTimeout(r, 0));

        expect(global.fetch).toHaveBeenCalledWith(bookViewer.search_base + '1234567890');
        expect(bookViewer.izenburua.value).toBe('Test Book');
    });

});
