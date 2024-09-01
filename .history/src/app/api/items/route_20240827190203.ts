import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import { fetchPlacesFromGoogle } from "@/lib/googleMapsApi"; // You'll need to implement this

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type");
  const location = searchParams.get("location");

  if (!category || !type) {
    return NextResponse.json(
      { error: "Category and type are required" },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    let items = await Item.find({ category, type });

    if (items.length === 0 && type === "place" && location) {
      const googlePlaces = await fetchPlacesFromGoogle(category, location);
      items = await Item.insertMany(
        googlePlaces.map((place) => ({
          ...place,
          type: "place",
          addedBy: "system",
        }))
      );
    }

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { name, category, type, description, contactInfo, addedBy } =
    await request.json();

  if (!name || !category || !type || !addedBy) {
    return NextResponse.json(
      { error: "Name, category, type, and addedBy are required" },
      { status: 400 }
    );
  }

  await dbConnect();

  try {
    const newItem = await Item.create({
      name,
      category,
      type,
      description,
      contactInfo,
      addedBy,
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Error adding new item:", error);
    return NextResponse.json(
      { error: "Failed to add new item" },
      { status: 500 }
    );
  }
}
