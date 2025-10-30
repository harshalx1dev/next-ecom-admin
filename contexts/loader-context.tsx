"use client";
import Loader from "@/components/ui/loader";
import React, { createContext, useContext, useState } from "react";

type LoaderContextType = {
  setLoading: (val: boolean) => void;
};

const LoaderContext = createContext<LoaderContextType>({
  setLoading: () => {},
});

export const LoaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoaderContext.Provider value={{ setLoading }}>
      <Loader loading={loading} />
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);
