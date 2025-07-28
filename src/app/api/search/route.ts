import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("searchValue");
  console.log(searchValue);
  return NextResponse.json({
    success: true,
    data: searchValue,
  });
}
