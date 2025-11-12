import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { Text } from "@/components/ui/text";
import { ButtonArrowBack } from "@/src/components";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { useAthkar } from "../hooks/useAthkar";

export default function AthkarDetails() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const { categoryData } = useAthkar(name as string)
    const [count, setCount] = useState(0);
    const currentAthkar = categoryData?.array[Number(count)];
    return (
    <ScreenLayout>
        <NavBar title="أذكار" subtitle="أذكار المسلم اليومية">
            <ButtonArrowBack />
        </NavBar>
        <Text>{categoryData?.category}</Text>
    </ScreenLayout>
    )
}