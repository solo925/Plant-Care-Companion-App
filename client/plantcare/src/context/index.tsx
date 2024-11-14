import { createContext, useEffect, useState } from "react";
import { PlantType, userTypes } from "../Types";

export interface PlantCareContextProps {
  LogoutFunction: () => void;
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
}


export const PlantCareContext = createContext<PlantCareContextProps | undefined>(undefined);

function PlantCareProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plants, setPlants] = useState<PlantType[]>([]);
  // const [user, setUser] = useState<userTypes | null | undefined>(null);
  const [selectedPlant, setSelectedPlant] = useState<PlantType | null>(null);

  const LogoutFunction = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

 
const [user, setUser] = useState<userTypes | null | undefined>(() => {
  // Attempting to load user data from localStorage if available
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
      }}
    >
      {children}
    </PlantCareContext.Provider>
  );
}

export default PlantCareProvider;
