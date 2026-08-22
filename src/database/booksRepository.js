import { dbGet, dbPut, dbGetAll } from './db.js';
import { updateAxisConfig } from './axisConfigRepository.js';

export async function addBook(book) {
  // book: { title, totalPages, category }
  const id = crypto.randomUUID();
  const newBook = {
    id,
    ...book,
    pagesRead: 0,
    status: 'not_started',
    dateStarted: null,
    dateFinished: null
  };
  await dbPut('books', newBook);
  return id;
}

export async function getBook(id) {
  return await dbGet('books', id);
}

export async function getAllBooks() {
  return await dbGetAll('books');
}

export async function updateBookStatus(id, status, dateStr) {
  const book = await getBook(id);
  if (!book) return;

  book.status = status;
  if (status === 'in_progress' && !book.dateStarted) {
    book.dateStarted = dateStr;
  } else if (status === 'finished') {
    book.dateFinished = dateStr;
    // Update pagesRead to max if finishing early
    book.pagesRead = book.totalPages; 
  }

  await dbPut('books', book);
  await checkAndUpdateStrategyPause();
}

export async function updateBookPagesRead(id, pagesAdded) {
  const book = await getBook(id);
  if (!book) return;

  book.pagesRead += pagesAdded;
  if (book.pagesRead >= book.totalPages) {
    book.pagesRead = book.totalPages;
    // Note: status update to 'finished' should ideally be triggered explicitly or handled here
  }
  await dbPut('books', book);
}

// Side-effect wiring for Strategy axis
async function checkAndUpdateStrategyPause() {
  const allBooks = await getAllBooks();
  const isStrategyActive = allBooks.some(b => 
    (b.category === 'history_biography' || b.category === 'strategy') && 
    b.status === 'in_progress'
  );
  
  await updateAxisConfig('strategy', { paused: !isStrategyActive });
}
