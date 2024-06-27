import { useContext } from "react";
import { CitiesContext } from "../context/CitiesContext";

export const useCitiesContext = () => {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Cities Context was outside Cities Provider");
  return context;
};
