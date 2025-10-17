import connectDB from "@/config/db";
import { ApprovedTranscript } from "@/modules/approvedTranscript/approved.model";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

//no autocomplete here anymore
//TODO: need to create a separate api for highlight later
const indexDef = {
  mappings: {
    dynamic: false,
    fields: {
      title: {
        type: "string",
        analyzer: "lucene.english",
      },
      markdown: {
        type: "string",
        analyzer: "lucene.english",
      },
    },
  },
};

//not in use
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

  //TODO: there should be a limit to how big the searchParam can be
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
  //Advanced searching
  const isExactQuery = searchValue.startsWith('"') && searchValue.endsWith('"');
  const cleanSearchValue = isExactQuery
    ? searchValue.slice(1, -1)
    : searchValue;
  const isPhrase = cleanSearchValue?.includes(" ");

  try {
    let shouldArray = [];

    if (isExactQuery) {
      // Exact query
      shouldArray = [
        {
          phrase: {
            query: cleanSearchValue,
            path: "title",
            slop: 0,
            score: { boost: { value: 18 } },
          },
        },
        {
          text: {
            query: cleanSearchValue,
            path: "title",
            score: { boost: { value: 8 } },
          },
        },
        {
          text: {
            query: cleanSearchValue,
            path: "markdown",
            score: { boost: { value: 4 } },
          },
        },
      ];
    } else if (isPhrase) {
      // Phrase
      // TODO: need to have something better for phrases
      shouldArray = [
        {
          phrase: {
            query: cleanSearchValue,
            path: "title",
            slop: 0,
            score: { boost: { value: 14 } },
          },
        },
        {
          phrase: {
            query: cleanSearchValue,
            path: "title",
            slop: 3,
            score: { boost: { value: 12 } },
          },
        },
        {
          phrase: {
            query: cleanSearchValue,
            path: "markdown",
            slop: 4,
            score: { boost: { value: 8 } },
          },
        },
      ];
    } else {
      // single word query
      shouldArray = [
        {
          text: {
            query: cleanSearchValue,
            path: "title",
            score: { boost: { value: 12 } },
          },
        },
        {
          text: {
            query: cleanSearchValue,
            path: "markdown",
            score: { boost: { value: 4 } },
          },
        },
      ];
    }

    const pipeline: any[] = [
      {
        $search: {
          compound: {
            should: shouldArray,
          },
          highlight: {
            path: ["title", "markdown"],
            maxNumPassages: 2, //either I will later remove this or update it to 3
          },
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
