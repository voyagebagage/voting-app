import React, { useState, useEffect, useCallback } from "react";

interface Item {
  id: string;
  name: string;
  votes: number;
  category: string;
}

export default function VotingApp() {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newItemName, setNewItemName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`/api/items?category=${selectedCategory}`);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError("Failed to fetch items. Please try again.");
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory) {
      fetchItems();
    }
  }, [selectedCategory, fetchItems]);

  useEffect(() => {
    // Fetch categories
    // Replace with your actual API call
    setCategories(["Category 1", "Category 2", "Category 3"]);
  }, []);

  const handleVote = async (id: string) => {
    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id, category: selectedCategory }),
      });
      if (!response.ok) throw new Error("Failed to vote");
      fetchItems();
    } catch (err) {
      setError("Failed to vote. Please try again.");
    }
  };

  const handleAddItem = async () => {
    if (newItemName.trim()) {
      try {
        // Replace with your actual API endpoint
        const response = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: newItemName,
            category: selectedCategory,
          }),
        });
        if (!response.ok) throw new Error("Failed to add item");
        fetchItems();
        setNewItemName("");
      } catch (err) {
        setError("Failed to add item. Please try again.");
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      // Replace with your actual API call
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Voting App</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-2 border rounded bg-tg-theme-bg-color text-tg-theme-text-color">
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <>
          <ul className="space-y-2 bg-slate-400">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-tg-theme-bg-color p-3 rounded-lg shadow">
                <span className="text-tg-theme-text-color">{item.name}</span>
                <div>
                  <span className="mr-2 text-tg-theme-hint-color">
                    Votes: {item.votes}
                  </span>
                  <button
                    onClick={() => handleVote(item.id)}
                    className="bg-tg-theme-button-color text-tg-theme-button-text-color px-3 py-1 rounded-full text-sm">
                    Vote
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex space-x-2 mt-4">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="New item name"
              className="flex-1 p-2 border rounded bg-tg-theme-bg-color text-tg-theme-text-color"
            />
            <button
              onClick={handleAddItem}
              className="bg-tg-theme-button-color text-tg-theme-button-text-color px-4 py-2 rounded-full">
              Add
            </button>
          </div>
        </>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Add New Category</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-1 p-2 border rounded bg-tg-theme-bg-color text-tg-theme-text-color"
          />
          <button
            onClick={handleAddCategory}
            className="bg-tg-theme-button-color text-tg-theme-button-text-color px-4 py-2 rounded-full">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
