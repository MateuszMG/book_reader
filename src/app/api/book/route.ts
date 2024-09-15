import { readBook, readBooksInfo, writeBooksInfo } from "@/helpers/files";
import { NextRequest, NextResponse } from "next/server";
import * as Yup from "yup";

const queryGetSchema = Yup.object({
  bookTitle: Yup.string().required(),
});

const queryPostSchema = Yup.object({
  bookTitle: Yup.string().required(),
});

const CHUNK = 20;

const getChunksFromBook = (
  bookInfo: BookInfo,
  bookTitle: string
): GetBookResponse => {
  const book = readBook(bookTitle).split(/\s+/);

  const start = bookInfo.recentUserWord;
  const end = start + CHUNK;

  const currentChunk = book.slice(start, end).join(" ");
  const nextChunk = book.slice(end, end + CHUNK).join(" ");

  return { currentChunk, nextChunk };
};

export async function GET(req: NextRequest, res: Response) {
  try {
    const searchParams = Object.fromEntries(
      new URL(req.url || "").searchParams.entries()
    );
    const { bookTitle } = await queryGetSchema.validate(searchParams);

    const booksInfo = readBooksInfo();

    const bookInfo = booksInfo.books.find((book) => book.title === bookTitle);
    if (!bookInfo) throw "Invalid book title";

    const dataRes: GetBookResponse = getChunksFromBook(bookInfo, bookTitle);

    return NextResponse.json(dataRes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update book info" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const body = await req.json();
    const { bookTitle } = await queryPostSchema.validate(body);

    const booksInfo = readBooksInfo();

    const bookInfo = booksInfo.books.find((book) => book.title === bookTitle);
    if (!bookInfo) throw new Error("Invalid book title");

    const updatedBookInfo: BookInfo = {
      ...bookInfo,
      recentUserWord: bookInfo.recentUserWord + CHUNK,
    };

    const updatedBooksInfo: BooksInfo = {
      ...booksInfo,
      books: booksInfo.books.map((book) =>
        book.title === bookTitle ? updatedBookInfo : book
      ),
      recent: updatedBookInfo,
    };

    writeBooksInfo(updatedBooksInfo);

    const dataRes: PostBookResponse = {
      ...getChunksFromBook(bookInfo, bookTitle),
      updatedBookInfoAndRecent: updatedBookInfo,
    };

    return NextResponse.json(dataRes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update book info" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, res: Response) {
  try {
    // save user progress after stopButton
    return NextResponse.json({});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update book info" },
      { status: 500 }
    );
  }
}
