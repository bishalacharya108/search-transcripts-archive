import connectDB from "@/config/db";
import { ApprovedTranscript } from "@/modules/approvedTranscript/approved.model";
import { NextRequest, NextResponse } from "next/server";

const indexDef = {
  mappings: {
    dynamic: false,
    fields: {
      title: {
        type: "autocomplete",
        tokenization: "edgeGram",
        minGrams: 3,
        maxGrams: 7,
      },
      markdown: {
        type: "autocomplete",
        tokenization: "edgeGram",
        minGrams: 2,
        maxGrams: 15,
      },
    },
  },
};

export async function GET(req: NextRequest) {
  connectDB();
  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("searchValue");
  console.log("Hit:", searchValue);

  //pagination
  const page = searchParams.get("page") ?? "1";
  const perPage = 5;
  const start = (Number(page) - 1) * Number(perPage);
  const end = start + Number(perPage);

  if (!searchValue) {
    // TODO: do a better error handling
    return NextResponse.json({
      success: false,
      message: "No search params",
    });
  }
  try {
    //basic text searching
    // const results = await ApprovedTranscript.find(
    //   { $text: { $search: searchValue } },
    //   { score: { $meta: "textScore" } },
    // )
    //   .sort({ score: { $meta: "textScore" } })
    //   .limit(50);

    // manually add the required json into search index of mongodb to use this
    const results = await ApprovedTranscript.aggregate([
      {
        $search: {
          compound: {
            should: [
              {
                autocomplete: {
                  query: searchValue,
                  path: "title",
                  fuzzy: { maxEdits: 1, prefixLength: 2 },
                },
              },
              {
                autocomplete: {
                  query: searchValue,
                  path: "markdown",
                  fuzzy: { maxEdits: 1, prefixLength: 2 },
                },
              },
            ],
          },
          highlight: {
            path: ["markdown", "title"],
          },
        },
      },
      { $limit: 10 },
      {
        $project: {
          title: 1,
          markdown: 1,
          highlights: { $meta: "searchHighlights" },
        },
      },
    ]);
    console.log("Results count:", results.length);
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
