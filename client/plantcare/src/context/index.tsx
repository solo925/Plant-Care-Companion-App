import { createContext, useEffect, useState } from "react";
import { messageType, PlantType, postTypes, roomTypes, userTypes } from "../Types";

export interface PlantCareContextProps {
  LogoutFunction: () => void;
  fetchPlants: () => Promise<void>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  plants: PlantType[];
  setPlants: React.Dispatch<React.SetStateAction<PlantType[]>>;
  user: userTypes | null | undefined; 
  setUser: React.Dispatch<React.SetStateAction<userTypes | null | undefined>>;
  selectedPlant: PlantType | null; 
  setSelectedPlant: React.Dispatch<React.SetStateAction<PlantType | null>>;
  posts: postTypes[];
  setPosts: React.Dispatch<React.SetStateAction<postTypes[]>>;
  messages: messageType[];
  setMessages: React.Dispatch<React.SetStateAction<messageType[]>>;
  rooms: roomTypes[];
  setRooms: React.Dispatch<React.SetStateAction<roomTypes[]>>;
}


export const PlantCareContext = createContext<PlantCareContextProps | undefined>(undefined);

function PlantCareProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plants, setPlants] = useState<PlantType[]>([]);
  const [messages, setMessages] = useState<messageType[]>([]);
  const [rooms, setRooms] = useState<roomTypes[]>([]);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);
  const [posts, setPosts] = useState<postTypes[]>([]);
 

  const LogoutFunction = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const fetchRooms = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/v1/rooms');
            const data = await response.json();
            setRooms(data);
        } catch (error) {
            console.error('Error fetching rooms:', error);
        }
    };

    fetchRooms();
}, []);

  const fetchPlants = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/plants/all');
      const allPlants: PlantType[] = await response.json();

      if (allPlants.length > 0) {
        setPlants(allPlants);
      } else {
        console.log('No plants to display');
      }
    } catch (error) {
      console.error('Error fetching plants:', error);
    }
  };

 
const [user, setUser] = useState<userTypes | null | undefined>(() => {
 
  const savedUser = localStorage.getItem('user');
  console.log(savedUser)
  return savedUser ? JSON.parse(savedUser) : null;
});

  useEffect(() => {
  // This will listen to user updaes
  if (user) {
      localStorage.setItem('user', JSON.stringify(user));
  }
}, [user]);


  return (
    <PlantCareContext.Provider
      value={{
        fetchPlants,
        LogoutFunction,
        loading,
        setLoading,
        error,
        setError,
        plants,
        setPlants,
        user,
        setUser,
        selectedPlant,
        setSelectedPlant,
        posts,
        setPosts,
        messages,
        setMessages,
        rooms,
        setRooms,
      }}
    >
      {children}
    </PlantCareContext.Provider>
  );
}

export default PlantCareProvider;
