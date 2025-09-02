import { ApprovedTranscript } from "@/modules/approvedTranscript/approved.model";
import { NextRequest, NextResponse } from "next/server";

// Need to add this into the into the search indexes of mongodb settings,
// otherwise the search functionality won't work with aggrigate
const searchIndexObject = {
  mappings: {
    dynamic: false,
    fields: {
      title: { type: "string" },
      markdown: { type: "string" },
    },
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("searchValue");

  //pagination
  const page = searchParams.get("page") ?? "1";
  const perPage = 5;
  const start = (Number(page) - 1) * Number(perPage);
  const end = start + Number(perPage);

  if (!searchValue) {
    return NextResponse.json({
      success: false,
      message: "No search params",
    });
  }
  try {
    //basic searching
    // const results = await ApprovedTranscript.find(
    //   { $text: { $search: searchValue } },
    //   { score: { $meta: "textScore" } },
    // )
    //   .sort({ score: { $meta: "textScore" } })
    //   .limit(50);

    //NOTE: to use create a search index in mongodb atlas with the object given above
    const results = await ApprovedTranscript.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: searchValue,
            path: ["markdown", "title"],
            fuzzy: { maxEdits: 1, prefixLength: 1 },
          },
        },
      },
      {
        $addFields: { score: { $meta: "searchScore" } },
      },
      { $sort: { score: -1 } },
      {
        $limit: 50,
      },
    ]);

    const data = results.slice(start, end);
    return NextResponse.json(
      {
        success: true,
        message: "Successfully Retrieved search results",
        data: data,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve search results",
      },
      { status: 500 },
    );
  }
}
