import { readBooksInfo } from "@/helpers/files";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const booksInfo = readBooksInfo();
    return NextResponse.json({ booksInfo });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update book info" },
      { status: 500 }
    );
  }
}
