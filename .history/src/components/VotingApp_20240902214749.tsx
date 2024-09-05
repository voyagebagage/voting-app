import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

interface Item {
  id: string;
  name: string;
  votes: number;
  category: string;
}

const VotingApp: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newItemName, setNewItemName] = useState<string>("");
  const { user } = useAuth();

  useEffect(() => {
    // Fetch categories
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Fetch items for selected category
      fetch(`/api/items?category=${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => setItems(data));
    }
  }, [selectedCategory]);

  const handleVote = async (itemId: string) => {
    const response = await fetch("/api/vote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, userId: user?.id }),
    });
    if (response.ok) {
      const updatedItem = await response.json();
      setItems(
        items.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    }
  };

  const handleAddItem = async () => {
    if (newItemName && selectedCategory) {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newItemName, category: selectedCategory }),
      });
      if (response.ok) {
        const newItem = await response.json();
        setItems([...items, newItem]);
        setNewItemName("");
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Voting App</h1>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="mb-4 p-2 border rounded">
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      {selectedCategory && (
        <div className="mb-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="New item name"
            className="p-2 border rounded mr-2"
          />
          <button
            onClick={handleAddItem}
            className="p-2 bg-blue-500 text-white rounded">
            Add Item
          </button>
        </div>
      )}
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="mb-2 p-2 border rounded flex justify-between items-center">
            <span>{item.name}</span>
            <div>
              <span className="mr-2">Votes: {item.votes}</span>
              <button
                onClick={() => handleVote(item.id)}
                className="p-1 bg-green-500 text-white rounded">
                Vote
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotingApp;
