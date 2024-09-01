"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("place");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchItems();
    }
  }, [router]);

  const fetchItems = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `/api/items?category=${category}&type=${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setItems(data);
    } else if (response.status === 401) {
      router.push("/login");
    }
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
      fetchItems();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Voting App</h1>
      <input
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Enter category"
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="place">Place</option>
        <option value="person">Person</option>
        <option value="service">Service</option>
      </select>
      <button onClick={fetchItems}>Search</button>
      <ul>
        {items.map((item: any) => (
          <li key={item._id}>
            {item.name} - Votes: {item.votes}
            <button onClick={() => handleVote(item._id)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
