import { HStack } from "@/components/ui/hstack";
import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ButtonArrowBack } from "@/src/components";
import { useMemo } from "react";
import { FlatList } from "react-native";
import { athkar } from "../data/athkar";
import FavoriteCadre from "./component/favorite-cadre";
import SimpleCadre from "./component/simple-cadre";

export default function AthkarScreen() {
  const categories = useMemo(() => {
    return athkar.map((item) => item.category);
  }, []);

  const favoriteCategorie = useMemo(() => {
    if (categories.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  }, [categories]);

  const ListHeaderComponent = () => (
    <>
      {favoriteCategorie && <FavoriteCadre name={favoriteCategorie} />}
      <VStack className="gap-4 mt-4">
        <HStack className="gap-4 items-center justify-between px-3">
          <Text className="text-gray-500 text-sm font-normal">
            {athkar.length} فئة
          </Text>
          <Text className="text-primary-500 text-lg font-bold">فئات</Text>
        </HStack>
      </VStack>
    </>
  );

  return (
    <ScreenLayout>
      <NavBar title="أذكار" subtitle="أذكار المسلم اليومية">
        <ButtonArrowBack />
      </NavBar>
      <FlatList
        data={categories}
        renderItem={({ item }) => <SimpleCadre name={item} />}
        keyExtractor={(item) => item}
        ListHeaderComponent={ListHeaderComponent}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={{ gap: 16, paddingHorizontal: 16 }}
        contentContainerStyle={{ gap: 16, paddingBottom: 86 }}
      />
    </ScreenLayout>
  );
}
