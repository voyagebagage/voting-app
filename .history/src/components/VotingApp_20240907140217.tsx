// src/components/VotingApp.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/providers/ThemeContext";

interface Item {
  id: string;
  name: string;
  votes: number;
}

export default function VotingApp() {
  const { buttonBgClass, buttonTextClass } = useTheme();
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    // Fetch items from your API
    // This is a placeholder, replace with actual API call
    setItems([
      { id: "1", name: "Item 1", votes: 0 },
      { id: "2", name: "Item 2", votes: 0 },
    ]);
  }, []);

  const handleVote = (id: string) => {
    // Update vote count
    // This is a placeholder, replace with actual API call
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  const handleAddItem = () => {
    if (newItemName.trim()) {
      // Add new item
      // This is a placeholder, replace with actual API call
      const newItem = {
        id: Date.now().toString(),
        name: newItemName.trim(),
        votes: 0,
      };
      setItems([...items, newItem]);
      setNewItemName("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="flex-1 p-2 border rounded bg-tg-theme-bg-color text-tg-theme-text-color"
        />
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between bg-tg-theme-bg-color p-2 rounded">
            <span>{item.name}</span>
            <div>
              <span className="mr-2 text-tg-theme-hint-color">
                Votes: {item.votes}
              </span>
              <button
                onClick={() => handleVote(item.id)}
                className={`${buttonBgClass} ${buttonTextClass} px-2 py-1 rounded`}>
                Vote
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="flex space-x-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New item name"
          className="flex-1 p-2 border rounded bg-tg-theme-bg-color text-tg-theme-text-color"
        />
        <button
          onClick={handleAddItem}
          className={`${buttonBgClass} ${buttonTextClass} px-4 py-2 rounded`}>
          Add
        </button>
      </div>
    </div>
  );
}
