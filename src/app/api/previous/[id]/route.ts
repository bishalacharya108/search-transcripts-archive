import connectDB from "@/config/db";
import { Transcript } from "@/modules/transcription/transcriptions.model";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  console.log("hit");

  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });

  if (!token?._id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();

  const { id } = params;
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor");
  const limit = parseInt(searchParams.get("limit") || "10");

  const query: any = { createdBy: new ObjectId(token._id) };
  if (cursor) query._id = { $lt: new ObjectId(cursor) };

  const transcripts = await Transcript.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1); 

  const hasNextPage = transcripts.length > limit;
  if (hasNextPage) transcripts.pop(); // remove extra doc

  return NextResponse.json({
    data: transcripts,
    nextCursor: hasNextPage ? transcripts[transcripts.length - 1]._id : null,
  });
}

