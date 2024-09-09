import React, { useState, useEffect, useCallback } from "react";
import WebApp from "@/app/lib/twa-sdk";
import { ChevronLeft, ThumbsUp, MapPin, Plus, AlertCircle } from "lucide-react";
import { useTheme } from "@/providers/ThemeContext";

// Type definitions
interface Place {
  id: number;
  name: string;
  votes: number;
  googleMapsId: string | null;
  distance: number | null;
}

interface PlaceInfo {
  placeId: string;
  distance: number;
}

interface ApiInterface {
  cache: Map<string, Place[]>;
  lastFetchTime: Map<string, number>;
  fetchPlaces: (category: string, location: string) => Promise<Place[]>;
  vote: (category: string, location: string, placeId: number) => Place[] | null;
  checkPlaceExists: (
    placeName: string,
    location: string
  ) => Promise<PlaceInfo | null>;
  addPlace: (
    category: string,
    location: string,
    newPlace: string,
    googleMapsId: string | null,
    distance: number | null
  ) => Promise<Place[]>;
}

// Shadcn/ui v0 components
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ children, className, ...props }) => {
  return (
    <div
      role="alert"
      className={`relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11 ${className}`}
      {...props}>
      {children}
    </div>
  );
};

interface AlertDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const AlertDescription: React.FC<AlertDescriptionProps> = ({
  className,
  ...props
}) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props} />
);

const api: ApiInterface = {
  cache: new Map(),
  lastFetchTime: new Map(),

  async fetchPlaces(category: string, location: string): Promise<Place[]> {
    const cacheKey = `${category}-${location}`;
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (
      this.cache.has(cacheKey) &&
      now - (this.lastFetchTime.get(cacheKey) || 0) < oneWeek
    ) {
      return this.cache.get(cacheKey) || [];
    }

    // Simulated API call (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockData: Place[] = [
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

  vote(category: string, location: string, placeId: number): Place[] | null {
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

  async checkPlaceExists(
    placeName: string,
    location: string
  ): Promise<PlaceInfo | null> {
    // Simulated Google Maps API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Randomly decide if the place exists (for simulation purposes)
    return Math.random() > 0.5
      ? { placeId: "ChIJ..." + Date.now(), distance: Math.random() * 5 }
      : null;
  },

  async addPlace(
    category: string,
    location: string,
    newPlace: string,
    googleMapsId: string | null,
    distance: number | null
  ): Promise<Place[]> {
    const cacheKey = `${category}-${location}`;
    const places = this.cache.get(cacheKey) || [];
    const newPlaceObj: Place = {
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

const VotingApp: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([
    "Croissant",
    "Pizza",
    "Coffee",
    "Pad Thai",
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { bgClass } = useTheme();
  const location = "Koh Phangan, Thailand";

  useEffect(() => {
    WebApp?.ready();
    WebApp?.expand();

    WebApp?.MainButton.setText("Add New Place");
    WebApp?.MainButton.hide();

    return () => {
      WebApp?.MainButton.offClick(addPlace);
    };
  }, []);

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

  useEffect(() => {
    if (selectedCategory && searchTerm && filteredPlaces.length === 0) {
      WebApp?.MainButton.show();
      WebApp?.MainButton.onClick(addPlace);
    } else {
      WebApp?.MainButton.hide();
    }

    return () => {
      WebApp?.MainButton.offClick(addPlace);
    };
  }, [selectedCategory, searchTerm]);
  // filteredPlaces
  const addCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory === "") {
      setError("Category name cannot be empty.");
      return;
    }

    const categoryRegex = new RegExp(`^${trimmedCategory}$, "i"`);
    if (categories.some((cat) => categoryRegex.test(cat))) {
      setError("This category already exists.");
      return;
    }

    setCategories((prevCategories) => [...prevCategories, trimmedCategory]);
    setSelectedCategory(trimmedCategory);
    setNewCategory("");
    setError("");
  };

  const handleVote = useCallback(
    (placeId: number) => {
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

  const getGoogleMapsLink = (place: Place): string | null => {
    if (place.googleMapsId) {
      return `https://www.google.com/maps/place/?q=place_id:${place.googleMapsId}`;
    }
    return null;
  };

  return (
    <div
      className={`text-white min-h-screen p-4`}
      // style={{ backgroundColor: 'black' }}
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory("")}
              className="mr-2 text-[#64B5F6]">
              <ChevronLeft size={24} />
            </button>
          )}
          Best Places in {location}
        </h1>

        {!selectedCategory ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Choose a category:</h2>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setSelectedCategory(category)}
                    className="w-full text-left p-3 bg-[#17212B] rounded-lg hover:bg-[#1F2936] transition-colors">
                    {category}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newCategory}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewCategory(e.target.value)
                }
                placeholder="New category"
                className="flex-grow bg-[#17212B] text-white border-[#2C3A4A]"
              />
              <Button
                onClick={addCategory}
                className="bg-[#64B5F6] text-[#0E1621] hover:bg-[#4CA3E7]">
                <Plus size={16} />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              placeholder="Search or add new place"
              className="w-full bg-[#17212B] text-white border-[#2C3A4A]"
            />

            {error && (
              <Alert className="bg-[#4F1B1D] border-[#8B3E3E] text-[#F8D7DA]">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <ul className="space-y-2">
                {filteredPlaces.map((place) => (
                  <li key={place.id} className="bg-[#17212B] p-3 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        {place.googleMapsId ? (
                          <a
                            // href={getGoogleMapsLink(place)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#64B5F6] hover:underline">
                            {place.name}
                          </a>
                        ) : (
                          <span>{place.name}</span>
                        )}
                        {place.distance !== null && (
                          <div className="text-xs text-[#8A9AA9] flex items-center mt-1">
                            <MapPin size={12} className="mr-1" />
                            {place.distance.toFixed(1)} km away
                          </div>
                        )}
                      </div>
                      <div className="flex items-center">
                        <span className="mr-2 text-sm text-[#8A9AA9]">
                          +{place.votes}
                        </span>
                        <Button
                          onClick={() => handleVote(place.id)}
                          className="bg-[#64B5F6] text-[#0E1621] hover:bg-[#4CA3E7] p-2">
                          <ThumbsUp size={16} />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingApp;
