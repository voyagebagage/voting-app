import React, { useState, useEffect, useCallback } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

const api = {
  cache: new Map(),
  lastFetchTime: new Map(),

  async fetchPlaces(category, location) {
    const cacheKey = `${category}-${location}`;
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (
      this.cache.has(cacheKey) &&
      now - this.lastFetchTime.get(cacheKey) < oneWeek
    ) {
      return this.cache.get(cacheKey);
    }

    // Simulated API call (replace with actual Google Maps API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData = [
      {
        id: 1,
        name: "Place 1",
        votes: Math.floor(Math.random() * 20),
        googleMapsId: "ChIJ...",
        distance: 1.2,
      },
      {
        id: 2,
        name: "Place 2",
        votes: Math.floor(Math.random() * 20),
        googleMapsId: "ChIJ...",
        distance: 0.8,
      },
      {
        id: 3,
        name: "Place 3",
        votes: Math.floor(Math.random() * 20),
        googleMapsId: null,
        distance: 2.5,
      },
    ].sort((a, b) => b.votes - a.votes);

    this.cache.set(cacheKey, mockData);
    this.lastFetchTime.set(cacheKey, now);

    return mockData;
  },

  vote(category, location, placeId) {
    const cacheKey = `${category}-${location}`;
    const places = this.cache.get(cacheKey);
    if (places) {
      const updatedPlaces = places
        .map((place) =>
          place.id === placeId ? { ...place, votes: place.votes + 1 } : place
        )
        .sort((a, b) => b.votes - a.votes);
      this.cache.set(cacheKey, updatedPlaces);
      return updatedPlaces;
    }
    return null;
  },

  async checkPlaceExists(placeName, location) {
    // Simulated Google Maps API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Randomly decide if the place exists (for simulation purposes)
    return Math.random() > 0.5
      ? { placeId: "ChIJ..." + Date.now(), distance: Math.random() * 5 }
      : null;
  },

  async addPlace(category, location, newPlace, googleMapsId, distance) {
    const cacheKey = `${category}-${location}`;
    const places = this.cache.get(cacheKey) || [];
    const newPlaceObj = {
      id: Date.now(),
      name: newPlace,
      votes: 0,
      googleMapsId,
      distance,
    };
    const updatedPlaces = [...places, newPlaceObj].sort(
      (a, b) => b.votes - a.votes
    );
    this.cache.set(cacheKey, updatedPlaces);
    return updatedPlaces;
  },
};

const VotingApp = () => {
  const [categories, setCategories] = useState([
    "Croissant",
    "Pizza",
    "Coffee",
    "Pad Thai",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const location = "Koh Phangan, Thailand";

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      api
        .fetchPlaces(selectedCategory, location)
        .then((fetchedPlaces) => {
          setPlaces(fetchedPlaces);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch places. Please try again.");
          setLoading(false);
        });
    }
  }, [selectedCategory, location]);

  const addCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory === "") {
      setError("Category name cannot be empty.");
      return;
    }

    const categoryRegex = new RegExp(`^${trimmedCategory}$`, "i");
    if (categories.some((cat) => categoryRegex.test(cat))) {
      setError("This category already exists.");
      return;
    }

    setCategories((prevCategories) => [...prevCategories, trimmedCategory]);
    setSelectedCategory(trimmedCategory); // Auto-select the new category
    setNewCategory("");
    setError("");
  };

  const handleVote = useCallback(
    (placeId) => {
      const updatedPlaces = api.vote(selectedCategory, location, placeId);
      if (updatedPlaces) {
        setPlaces(updatedPlaces);
      }
    },
    [selectedCategory, location]
  );

  const addPlace = async () => {
    const trimmedPlace = searchTerm.trim();
    if (trimmedPlace === "") {
      setError("Place name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const placeInfo = await api.checkPlaceExists(trimmedPlace, location);
      const updatedPlaces = await api.addPlace(
        selectedCategory,
        location,
        trimmedPlace,
        placeInfo?.placeId || null,
        placeInfo?.distance || null
      );
      setPlaces(updatedPlaces);
      setSearchTerm("");
      setError("");
    } catch (err) {
      setError("Failed to add place. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredPlaces = places.filter((place) =>
    place.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getGoogleMapsLink = (place) => {
    if (place.googleMapsId) {
      return `https://www.google.com/maps/place/?q=place_id:${place.googleMapsId}`;
    }
    return null;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">What is your best</h1>
      <div className="flex items-center mb-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-2">in {location}?</span>
      </div>
      <div className="mb-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
          />
          <button onClick={addCategory}>Add Category</button>
        </div>
      </div>
      {selectedCategory && (
        <div className="mb-4">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search or add new place"
          />
          {filteredPlaces.length === 0 && (
            <div className="mt-2">
              <button onClick={addPlace}>Add New Place</button>
            </div>
          )}
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="mt-2 mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {filteredPlaces.map((place) => (
            <li key={place.id} className="bg-gray-100 p-2 rounded">
              <div className="flex items-center justify-between">
                <div>
                  {place.googleMapsId ? (
                    <a
                      href={getGoogleMapsLink(place)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline">
                      {place.name}
                    </a>
                  ) : (
                    <span>{place.name}</span>
                  )}
                  {place.distance !== null && (
                    <h6 className="text-xs text-gray-500">
                      {place.distance.toFixed(1)} km away
                    </h6>
                  )}
                </div>
                <div>
                  <span className="mr-2 text-sm text-gray-600">
                    Votes: +{place.votes}
                  </span>
                  <button onClick={() => handleVote(place.id)}>Vote</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VotingApp;
