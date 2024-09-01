import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../lib/mongodb";
import Item from "../../lib/models/Item";
import Vote from "@/models/Vote";

export async function POST(request: NextRequest) {
  const { itemId, userId, category } = await request.json();

  if (!itemId || !userId || !category) {
    return NextResponse.json(
      { error: "ItemId, userId, and category are required" },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    // Check if user has already voted for this category today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingVote = await Vote.findOne({
      userId,
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
    await Vote.create({ userId, itemId, category });

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
