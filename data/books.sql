/*
DROP TABLE IF EXISTS tasks;
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  contact VARCHAR(255),
  status VARCHAR(255),
  category VARCHAR(255),
  due DATE NOT NULL DEFAULT NOW()
)
*/
DROP TABLE IF EXISTS books;

CREATE TABLE books(
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  title VARCHAR(255),
  isbn VARCHAR(255),
  image_url VARCHAR(255),
  description TEXT,
  bookshelf VARCHAR(255),
  due DATE NOT NULL DEFAULT NOW()
);

INSERT INTO books (title, author, isbn, image_url, description, bookshelf) 
VALUES('Shame', 'Ahmad M. (aka Shackspear)', 'CDHN12345', 'NOT FOUND', 'Shame is good', 'drama');

INSERT INTO books (title, author, isbn, image_url, description, bookshelf) 
VALUES('The Exile', 'Rashid S.', 'FVR2345', 'NOT FOUND', 'Written by Rashid, its a story', 'action'); 