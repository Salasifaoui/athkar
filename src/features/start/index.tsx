import { APP_CONFIG } from "@/src/config";
import { client } from "@/src/services/apiService";
import { Button, Text, View } from "react-native";

 
export default function StartScreen() {

  const doPing = async () => {
    try {
      await client.call('GET', new URL('/v1/ping', APP_CONFIG.APPWRITE_API_URL));
    } catch (error) {
      console.log("Server reachable but user creation failed (maybe already exists):", error);
    }
  };
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
        <Button title="Ping" onPress={doPing} />
    </View>
  );
}