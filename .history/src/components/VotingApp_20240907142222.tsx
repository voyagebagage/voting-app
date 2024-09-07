import React, { useState } from "react";
import { useTheme } from "@/providers/ThemeContext";

interface Item {
  id: string;
  name: string;
  votes: number;
}

interface Category {
  id: string;
  name: string;
  items: Item[];
}

const mockCategories: Category[] = [
  {
    id: "1",
    name: "Restaurants",
    items: [
      { id: "1", name: "Pizza Place", votes: 5 },
      { id: "2", name: "Sushi Bar", votes: 3 },
      { id: "3", name: "Burger Joint", votes: 7 },
    ],
  },
  {
    id: "2",
    name: "Beaches",
    items: [
      { id: "4", name: "Sunset Beach", votes: 10 },
      { id: "5", name: "Palm Cove", votes: 8 },
      { id: "6", name: "Hidden Bay", votes: 6 },
    ],
  },
];

export default function VotingApp() {
  const { buttonBgClass, buttonTextClass } = useTheme();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");

  const handleVote = (categoryId: string, itemId: string) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              items: category.items.map((item) =>
                item.id === itemId ? { ...item, votes: item.votes + 1 } : item
              ),
            }
          : category
      )
    );
  };

  const handleAddItem = () => {
    if (newItemName.trim() && selectedCategory) {
      setCategories(
        categories.map((category) =>
          category.id === selectedCategory
            ? {
                ...category,
                items: [
                  ...category.items,
                  {
                    id: Date.now().toString(),
                    name: newItemName.trim(),
                    votes: 0,
                  },
                ],
              }
            : category
        )
      );
      setNewItemName("");
    }
  };

  return (
    <div className="p-4 bg-tg-theme-bg-color text-tg-theme-text-color">
    <h1 className="text-2xl font-bold mb-4">Voting App</h1>
    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="mb-4 tg-select w-full">
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full ${
              selectedCategory === category.id
                ? buttonBgClass + " " + buttonTextClass
                : "bg-gray-200 text-gray-800"
            }`}>
            {category.name}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <>
          <ul className="space-y-2">
            {categories
              .find((c) => c.id === selectedCategory)
              ?.items.sort((a, b) => b.votes - a.votes)
              .map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-opacity-10 bg-gray-500 p-2 rounded">
                  <span>{item.name}</span>
                  <div>
                    <span className="mr-2 text-sm opacity-70">
                      Votes: {item.votes}
                    </span>
                    <button
                      onClick={() => handleVote(selectedCategory, item.id)}
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
              className="flex-1 p-2 border rounded bg-transparent"
            />
            <button
              onClick={handleAddItem}
              className={`${buttonBgClass} ${buttonTextClass} px-4 py-2 rounded`}>
              Add
            </button>
          </div>
        </>
      )}
    </div>
  );
}
