import { readBooksInfo } from "@/helpers/files";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
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
