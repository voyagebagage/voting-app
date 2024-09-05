"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
// import "../app/global.css";
// import { global } from "styled-jsx/css";

interface Item {
  id: string;
  name: string;
  votes: number;
  category: string;
}

const VotingApp: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<string[]>([
    "Croissant",
    "Pizza",
    "Coffee",
    "Pad Thai",
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newItemName, setNewItemName] = useState<string>("");
  const { user } = useAuth();
  // const [items, setItems] = useState<Item[]>([]);
  const [category, setCategory] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [type, setType] = useState('place');

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
    // <div className="p-4">
    //   <h1 className="text-2xl font-bold mb-4">Voting App</h1>
    //   <select
    //     value={selectedCategory}
    //     onChange={(e) => setSelectedCategory(e.target.value)}
    //     className="mb-4 tg-select w-full">
    //     <option value="">Select a category</option>
    //     {categories.map((category) => (
    //       <option key={category} value={category}>
    //         {category}
    //       </option>
    //     ))}
    //   </select>
    //   {selectedCategory && (
    //     <div className="mb-4 flex">
    //       <input
    //         type="text"
    //         value={newItemName}
    //         onChange={(e) => setNewItemName(e.target.value)}
    //         placeholder="New item name"
    //         className="tg-input flex-grow mr-2"
    //       />
    //       <button
    //         onClick={handleAddItem}
    //         className="tg-button tg-button-primary">
    //         Add Item
    //       </button>
    //     </div>
    //   )}
    //   <ul>
    <div className="p-4 bg-tg-theme-bg-color text-tg-theme-text-color">
      <h1 className="text-2xl font-bold mb-4">Voting App</h1>
      <div className="flex mb-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            className="w-full p-2 border rounded-l"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-t-0 rounded-b">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => setCategory(suggestion)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="p-2 border border-l-0 rounded-r"
        >
          <option value="place">Place</option>
          <option value="person">Person</option>
          <option value="service">Service</option>
        </select>
      </div>
      <button
        // onClick={fetchItems}
        className="w-full p-2 bg-tg-theme-button-color text-tg-theme-button-text-color rounded mb-4"
      >
        Search
      </button>
        {items.map((item) => (
          <li key={item.id} className="tg-list-item">
            <span>{item.name}</span>
            <div>
              <span className="mr-2">Votes: {item.votes}</span>
              <button
                onClick={() => handleVote(item.id)}
                className="tg-button tg-button-primary">
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
