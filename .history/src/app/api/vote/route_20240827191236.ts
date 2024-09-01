import { NextRequest, NextResponse } from "next/server";
// import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import Vote from "@/models/Vote";
// import { verifyToken } from "@/lib/auth";
import dbConnect from "@/app/lib/mongodb";

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { itemId, category } = await request.json();

  if (!itemId || !category) {
    return NextResponse.json(
      { error: "ItemId and category are required" },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    // Check if user has already voted for this category today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingVote = await Vote.findOne({
      userId: decodedToken.userId,
      category,
      createdAt: { $gte: startOfDay },
    });

    if (existingVote) {
      return NextResponse.json(
        { error: "You have already voted in this category today" },
        { status: 400 }
      );
    }

    // Create new vote
    await Vote.create({ userId: decodedToken.userId, itemId, category });

    // Update item's vote count
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      { $inc: { votes: 1 } },
      { new: true }
    );

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error voting:", error);
    return NextResponse.json(
      { error: "Failed to register vote" },
      { status: 500 }
    );
  }
}
