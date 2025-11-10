import { useMemo } from 'react';
import { athkar } from '../data/athkar';

export interface AthkarItem {
  id: number;
  text: string;
  count: number;
  audio: string;
  filename: string;
}

export interface AthkarCategory {
  id: number;
  category: string;
  audio: string;
  filename: string;
  array: AthkarItem[];
}

export function useAthkar(category: string) {
  const categoryData = useMemo(() => {
    return athkar.find((item) => item.category === category);
  }, [category]);

  const items = useMemo(() => {
    return categoryData?.array || [];
  }, [categoryData]);

  return {
    categoryData: categoryData || null,
    items,
  };
}

