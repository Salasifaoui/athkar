import { useMemo } from 'react';
import { names } from '../data/names';

export interface NameItem {
  id: number;
  name: string;
  text: string;
}

export function useNames() {
  const allNames = useMemo(() => {
    return names;
  }, []);

  return {
    names: allNames,
  };
}

