"use client";

import { useState, useEffect } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe: {
          user?: TelegramUser;
        };
        ready: () => void;
        initData: string;
        initDataUnsafe: any;
      };
    };
  }
}

export default function Home() {
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    let info = "";

    if (typeof window !== "undefined") {
      info += "Window object is available.\n";

      if (window.Telegram) {
        info += "Telegram object is available.\n";

        if (window.Telegram.WebApp) {
          info += "WebApp object is available.\n";
          info += `initData: ${window.Telegram.WebApp.initData}\n`;
          info += `initDataUnsafe: ${JSON.stringify(
            window.Telegram.WebApp.initDataUnsafe,
            null,
            2
          )}\n`;

          window.Telegram.WebApp.ready();

          if (
            window.Telegram.WebApp.initDataUnsafe &&
            window.Telegram.WebApp.initDataUnsafe.user
          ) {
            const tUser = window.Telegram.WebApp.initDataUnsafe.user;
            setUser(tUser);
            info += `User data: ${JSON.stringify(tUser, null, 2)}\n`;
          } else {
            info += "User data is not available in initDataUnsafe.\n";
          }
        } else {
          info += "WebApp object is not available.\n";
        }
      } else {
        info += "Telegram object is not available.\n";
      }
    } else {
      info += "Window object is not available (server-side rendering).\n";
    }

    setDebugInfo(info);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Telegram WebApp Debug</h1>
      {user ? (
        <div>
          <h2>Welcome, {user.first_name}!</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <div>No user data available</div>
      )}
      <h3>Debug Information:</h3>
      <pre>{debugInfo}</pre>
    </div>
  );
} // "use client";

// import { useState, useEffect } from "react";

// interface TelegramUser {
//   id: number;
//   first_name: string;
//   last_name?: string;
//   username?: string;
//   language_code?: string;
// }

// declare global {
//   interface Window {
//     Telegram: {
//       WebApp: {
//         initDataUnsafe: {
//           user?: TelegramUser;
//         };
//         ready: () => void;
//       };
//     };
//   }
// }

// export default function Home() {
//   const [user, setUser] = useState<TelegramUser | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [items, setItems] = useState([]);
//   const [category, setCategory] = useState("");
//   const [type, setType] = useState("place");

//   useEffect(() => {
//     if (window.Telegram && window.Telegram.WebApp) {
//       const webApp = window.Telegram.WebApp;
//       webApp.ready();
//       if (webApp.initDataUnsafe && webApp.initDataUnsafe.user) {
//         const tUser = webApp.initDataUnsafe.user;
//         setUser(tUser);
//       } else {
//         console.error("User data is not available.");
//       }
//     } else {
//       console.error("Telegram WebApp is not initialized.");
//     }
//     setIsLoading(false);
//   }, []);

//   const fetchItems = async () => {
//     if (!user) return;
//     const response = await fetch(
//       `/api/items?category=${category}&type=${type}`
//     );
//     if (response.ok) {
//       const data = await response.json();
//       setItems(data);
//     }
//   };

//   const handleVote = async (itemId: string) => {
//     if (!user) return;
//     const response = await fetch("/api/vote", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ itemId, category, userId: user.id }),
//     });
//     if (response.ok) {
//       fetchItems();
//     }
//   };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <div>Please open this app from Telegram.</div>;
//   }

//   return (
//     <div>
//       <h1>Welcome, {user.first_name}!</h1>
//       <input
//         type="text"
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         placeholder="Enter category"
//       />
//       <select value={type} onChange={(e) => setType(e.target.value)}>
//         <option value="place">Place</option>
//         <option value="person">Person</option>
//         <option value="service">Service</option>
//       </select>
//       <button onClick={fetchItems}>Search</button>
//       <ul>
//         {items.map((item: any) => (
//           <li key={item._id}>
//             {item.name} - Votes: {item.votes}
//             <button onClick={() => handleVote(item._id)}>Vote</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";

// // interface Item {
// //   _id: string;
// //   name: string;
// //   category: string;
// //   type: "place" | "person" | "service";
// //   location?: string;
// //   distance?: number;
// //   googleUrl?: string;
// //   description?: string;
// //   contactInfo?: string;
// //   votes: number;
// // }

// // export default function Home() {
// //   const [items, setItems] = useState<Item[]>([]);
// //   const [category, setCategory] = useState("");
// //   const [type, setType] = useState<"place" | "person" | "service">("place");
// //   const [location, setLocation] = useState("");
// //   const [newItemName, setNewItemName] = useState("");
// //   const [newItemDescription, setNewItemDescription] = useState("");
// //   const router = useRouter();

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       router.push("/login");
// //     }
// //   }, [router]);

// //   const fetchItems = async () => {
// //     const response = await fetch(
// //       `/api/items?category=${category}&type=${type}${
// //         location ? `&location=${location}` : ""
// //       }`
// //     );
// //     const data = await response.json();
// //     setItems(data);
// //   };

// //   const handleVote = async (itemId: string) => {
// //     const token = localStorage.getItem("token");
// //     const response = await fetch("/api/vote", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({ itemId, category }),
// //     });

// //     if (response.ok) {
// //       fetchItems(); // Refresh items after voting
// //     } else {
// //       const error = await response.json();
// //       alert(error.error);
// //     }
// //   };

// //   const addNewItem = async () => {
// //     const token = localStorage.getItem("token");
// //     const response = await fetch("/api/items", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         Authorization: `Bearer ${token}`,
// //       },
// //       body: JSON.stringify({
// //         name: newItemName,
// //         category,
// //         type,
// //         description: newItemDescription,
// //         addedBy: "user", // Replace with actual userId
// //       }),
// //     });

// //     if (response.ok) {
// //       fetchItems(); // Refresh items after adding new item
// //       setNewItemName("");
// //       setNewItemDescription("");
// //     } else {
// //       const error = await response.json();
// //       alert(error.error);
// //     }
// //   };

// //   return (
// //     <div>
// //       <h1>Best {category} Voting</h1>
// //       <input
// //         type="text"
// //         placeholder="Category"
// //         value={category}
// //         onChange={(e) => setCategory(e.target.value)}
// //       />
// //       <select
// //         value={type}
// //         onChange={(e) =>
// //           setType(e.target.value as "place" | "person" | "service")
// //         }>
// //         <option value="place">Place</option>
// //         <option value="person">Person</option>
// //         <option value="service">Service</option>
// //       </select>
// //       {type === "place" && (
// //         <input
// //           type="text"
// //           placeholder="Location"
// //           value={location}
// //           onChange={(e) => setLocation(e.target.value)}
// //         />
// //       )}
// //       <button onClick={fetchItems}>Search</button>

// //       <div>
// //         <h2>Add New Item</h2>
// //         <input
// //           type="text"
// //           placeholder="Name"
// //           value={newItemName}
// //           onChange={(e) => setNewItemName(e.target.value)}
// //         />
// //         <textarea
// //           placeholder="Description"
// //           value={newItemDescription}
// //           onChange={(e) => setNewItemDescription(e.target.value)}
// //         />
// //         <button onClick={addNewItem}>Add Item</button>
// //       </div>

// //       <ul>
// //         {items.map((item) => (
// //           <li key={item._id}>
// //             <h3>{item.name}</h3>
// //             {item.type === "place" && (
// //               <>
// //                 <p>Location: {item.location}</p>
// //                 {item.distance && (
// //                   <p>Distance: {item.distance.toFixed(2)} km</p>
// //                 )}
// //                 {item.googleUrl && (
// //                   <a
// //                     href={item.googleUrl}
// //                     target="_blank"
// //                     rel="noopener noreferrer">
// //                     View on Google Maps
// //                   </a>
// //                 )}
// //               </>
// //             )}
// //             {(item.type === "person" || item.type === "service") && (
// //               <>
// //                 <p>Description: {item.description}</p>
// //                 {item.contactInfo && <p>Contact: {item.contactInfo}</p>}
// //               </>
// //             )}
// //             <p>Votes: {item.votes}</p>
// //             <button onClick={() => handleVote(item._id)}>Vote</button>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // }
