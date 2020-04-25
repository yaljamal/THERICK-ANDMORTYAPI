DROP TABLE IF EXISTS test3;

CREATE TABLE test3(
   id SERIAL PRIMARY KEY,
    authors VARCHAR(255),
    title VARCHAR(255),
    isbn VARCHAR(255),
    smallThumbnail VARCHAR(255),
    description TEXT,
    bookshelf VARCHAR(255)
);