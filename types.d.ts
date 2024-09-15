interface BookInfo {
  title: string;
  wordsTotal: number;
  recentUserWord: number;
}
interface BooksInfo {
  bookTitles: string[];
  books: BookInfo[];
  recent: BookInfo;
}

interface GetBookResponse {
  currentChunk: string;
  nextChunk: string;
}

interface PostBookResponse extends GetBookResponse {
  updatedBookInfoAndRecent: BookInfo;
}
