import { ApprovedTranscript } from "@/modules/approvedTranscript/approved.model";
import { NextRequest, NextResponse } from "next/server";

//TODO: Actually searching from db
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("searchValue");
  if (!searchValue) {
    return NextResponse.json({
      success: false,
      message: "No search params",
    });
  }
  const results = await ApprovedTranscript.find(
    { $text: { $search: searchValue } },
    { score: { $meta: 'textScore' } },
  ).sort({score: {$meta: 'textScore'}});
  console.log("Number of results: ",results.length)
  results.map((result, idx) => console.log(idx+1, ":", result.title, result.score))

  return NextResponse.json({
    success: true,
    data: searchValue,
  });
}
