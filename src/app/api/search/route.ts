import connectDB from "@/config/db";
import { ApprovedTranscript } from "@/modules/approvedTranscript/approved.model";
import { Types } from "mongoose";
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

const indexDefWithString = {
  mappings: {
    dynamic: false,
    fields: {
      title: [
        {
          type: "autocomplete",
          tokenization: "edgeGram",
          minGrams: 3,
          maxGrams: 7,
        },
        {
          type: "string",
        },
      ],
      markdown: [
        {
          type: "autocomplete",
          tokenization: "edgeGram",
          minGrams: 2,
          maxGrams: 15,
        },
        {
          type: "string",
        },
      ],
    },
  },
};

// currently we only have load more pagination
//TODO: should have next and previous pagination system
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const searchValue = searchParams.get("searchValue");
  const perPage = 5;
  const lastScore = parseFloat(searchParams.get("lastScore") || "Infinity");
  const lastId = searchParams.get("lastId");

  if (!searchValue) {
    return NextResponse.json({
      success: false,
      message: "No search params",
    });
  }

  try {
    const pipeline: any[] = [
      {
        $search: {
          compound: {
            should: [
              {
                text: {
                  query: searchValue,
                  path: "title",
                  fuzzy: { maxEdits: 1, prefixLength: 3 },
                  score: { boost: { value: 8 } },
                },
              },
              {
                autocomplete: {
                  query: searchValue,
                  path: "title",
                  fuzzy: { maxEdits: 2, prefixLength: 2 },
                  score: { boost: { value: 6 } },
                },
              },
              {
                text: {
                  query: searchValue,
                  path: "markdown",
                  fuzzy: { maxEdits: 1, prefixLength: 2 },
                  score: { boost: { value: 4 } },
                },
              },
              {
                autocomplete: {
                  query: searchValue,
                  path: "markdown",
                  fuzzy: { maxEdits: 1, prefixLength: 2 },
                  score: { boost: { value: 2 } },
                },
              },
            ],
          },
          highlight: { path: ["markdown", "title"] },
        },
      },

      {
        $project: {
          title: 1,
          markdown: 1,
          highlights: { $meta: "searchHighlights" },
          score: { $meta: "searchScore" },
        },
      },
    ];

    if (lastId && lastScore !== Infinity) {
      pipeline.push({
        $match: {
          $or: [
            { score: { $lt: lastScore } },
            { score: lastScore, _id: { $gt: new Types.ObjectId(lastId) } },
          ],
        },
      });
    }

    pipeline.push({ $sort: { score: -1, _id: 1 } });

    pipeline.push({ $limit: perPage + 1 });

    const results = await ApprovedTranscript.aggregate(pipeline);

    const hasNextPage = results.length > perPage;
    const slicedResults = hasNextPage ? results.slice(0, perPage) : results;

    const lastDoc = slicedResults[slicedResults.length - 1];
    const nextPageCursor = hasNextPage
      ? { lastScore: lastDoc.score, lastId: lastDoc._id }
      : null;

    return NextResponse.json({
      success: true,
      results: slicedResults,
      hasNextPage,
      nextPageCursor,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve search results",
      },
      { status: 500 },
    );
  }
}
