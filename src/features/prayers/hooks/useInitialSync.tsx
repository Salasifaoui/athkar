import React, { createContext, ReactNode, useContext, useState } from 'react';

interface InitialSyncContextType {
  isInitialSyncLoading: boolean;
  setInitialSyncLoading: (loading: boolean) => void;
}

const InitialSyncContext = createContext<InitialSyncContextType | undefined>(undefined);

interface InitialSyncProviderProps {
  children: ReactNode;
}

export function InitialSyncProvider({ children }: InitialSyncProviderProps) {
  const [isInitialSyncLoading, setInitialSyncLoading] = useState(false);

  return (
    <InitialSyncContext.Provider value={{ isInitialSyncLoading, setInitialSyncLoading }}>
      {children}
    </InitialSyncContext.Provider>
  );
}

export function useInitialSync() {
  const context = useContext(InitialSyncContext);
  if (context === undefined) {
    throw new Error('useInitialSync must be used within an InitialSyncProvider');
  }
  return context;
}

