"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Item {
  _id: string;
  name: string;
  category: string;
  type: "place" | "person" | "service";
  location?: string;
  distance?: number;
  googleUrl?: string;
  description?: string;
  contactInfo?: string;
  votes: number;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"place" | "person" | "service">("place");
  const [location, setLocation] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const fetchItems = async () => {
    const response = await fetch(
      `/api/items?category=${category}&type=${type}${
        location ? `&location=${location}` : ""
      }`
    );
    const data = await response.json();
    setItems(data);
  };

  const handleVote = async (itemId: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId, category }),
    });

    if (response.ok) {
      fetchItems(); // Refresh items after voting
    } else {
      const error = await response.json();
      alert(error.error);
    }
  };

  const addNewItem = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newItemName,
        category,
        type,
        description: newItemDescription,
        addedBy: "user", // Replace with actual userId
      }),
    });

    if (response.ok) {
      fetchItems(); // Refresh items after adding new item
      setNewItemName("");
      setNewItemDescription("");
    } else {
      const error = await response.json();
      alert(error.error);
    }
  };

  return (
    <div>
      <h1>Best {category} Voting</h1>
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <select
        value={type}
        onChange={(e) =>
          setType(e.target.value as "place" | "person" | "service")
        }>
        <option value="place">Place</option>
        <option value="person">Person</option>
        <option value="service">Service</option>
      </select>
      {type === "place" && (
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      )}
      <button onClick={fetchItems}>Search</button>

      <div>
        <h2>Add New Item</h2>
        <input
          type="text"
          placeholder="Name"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={newItemDescription}
          onChange={(e) => setNewItemDescription(e.target.value)}
        />
        <button onClick={addNewItem}>Add Item</button>
      </div>

      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <h3>{item.name}</h3>
            {item.type === "place" && (
              <>
                <p>Location: {item.location}</p>
                {item.distance && (
                  <p>Distance: {item.distance.toFixed(2)} km</p>
                )}
                {item.googleUrl && (
                  <a
                    href={item.googleUrl}
                    target="_blank"
                    rel="noopener noreferrer">
                    View on Google Maps
                  </a>
                )}
              </>
            )}
            {(item.type === "person" || item.type === "service") && (
              <>
                <p>Description: {item.description}</p>
                {item.contactInfo && <p>Contact: {item.contactInfo}</p>}
              </>
            )}
            <p>Votes: {item.votes}</p>
            <button onClick={() => handleVote(item._id)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
