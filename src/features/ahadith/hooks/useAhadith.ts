import { NAWAOU_AHADITH } from "@/src/features/ahadith/data/ahadith";
import { useMemo, useState } from "react";

export interface Hadith {
  number: number;
  title: string;
  text: string;
  reference: string;
  explanation: string;
}

export function useAhadith(initialIndex: number = 1) {
  const [currentHadithIndex, setCurrentHadithIndex] = useState(initialIndex);
  const totalHadith = NAWAOU_AHADITH.length;

  const currentHadith: Hadith | null = useMemo(() => {
    const hadith = NAWAOU_AHADITH.find((h: Hadith) => h.number === currentHadithIndex);
    return hadith || null;
  }, [currentHadithIndex]);

  const navigateHadith = (direction: "prev" | "next") => {
    if (direction === "prev" && currentHadithIndex > 1) {
      setCurrentHadithIndex(currentHadithIndex - 1);
    } else if (direction === "next" && currentHadithIndex < totalHadith) {
      setCurrentHadithIndex(currentHadithIndex + 1);
    }
  };

  const changeHadith = () => {
    // Randomly select a new Hadith (1 to totalHadith)
    const randomIndex = Math.floor(Math.random() * totalHadith) + 1;
    setCurrentHadithIndex(randomIndex);
  };

  const goToHadith = (index: number) => {
    if (index >= 1 && index <= totalHadith) {
      setCurrentHadithIndex(index);
    }
  };

  return {
    currentHadith,
    currentHadithIndex,
    totalHadith,
    navigateHadith,
    changeHadith,
    goToHadith,
  };
}

