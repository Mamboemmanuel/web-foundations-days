# Library REST API Design

This document outlines the REST API design for managing a library's books resource.

## Endpoints

### 1. List All Books
* **Method**: `GET`
* **Path**: `/books`
* **Description**: Retrieves a list of all books available in the library collection.
* **Success Status Code**: `200 OK`

### 2. List Books by Author
* **Method**: `GET`
* **Path**: `/books?author=AuthorName`
* **Description**: Retrieves a filtered list of books written by a specific author using a query parameter.
* **Success Status Code**: `200 OK`

### 3. Get One Book
* **Method**: `GET`
* **Path**: `/books/:id`
* **Description**: Retrieves details for a single book specified by its unique ID.
* **Success Status Code**: `200 OK`

### 4. Create a Book
* **Method**: `POST`
* **Path**: `/books`
* **Description**: Adds a new book to the library collection.
* **Request Body Example**:
  ```json
  {
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "publishedYear": 2008,
    "isbn": "978-0132350884"
  }