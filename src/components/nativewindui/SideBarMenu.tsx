import { Button, ButtonIcon } from "@/components/ui/button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { VStack } from "@/components/ui/vstack";
import { useAuth } from "@/src/features/auth/hooks/useAuth";
import { ListCategoriesScreen } from "@/src/features/category/ui/ListCategoriesScreen";
import { useColorScheme } from "@/src/hooks/useColorSchema";
import { useRouter } from "expo-router";
import { ArrowRight, Moon, Plus, Sun, User } from "lucide-react-native";

export default function SideBarMenu({
  showAddModal,
  setShowAddModal,
}: {
  showAddModal: boolean;
  setShowAddModal: (showAddModal: boolean) => void;
}) {
  const router = useRouter();
  const { isAuthenticated, session } = useAuth();
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const toggleColorScheme = () => {
    setColorScheme(isDarkColorScheme ? 'light' : 'dark');
  }
  return (
    <>
      <Drawer
        anchor="left"
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
        }}
      >
        {/* <DrawerBackdrop /> */}
        <DrawerContent>
          <DrawerHeader className="mt-8 justify-center flex-col gap-2">
            <Button variant="link" action="secondary" onPress={() => {
              setShowAddModal(false);
            }}>
              <ButtonIcon action="secondary" as={ArrowRight} style={{ width: 25, height: 25 }} className="text-primary-400" />
            </Button>
          </DrawerHeader>
          <DrawerBody contentContainerClassName="gap-2">
            <ListCategoriesScreen setShowAddModal={setShowAddModal} />
          </DrawerBody>
          <DrawerFooter>
            <VStack className="w-full gap-2">
            <Button
              className="p-10"
              variant="link"
              onPress={() => {
                setShowAddModal(false);
                if(isAuthenticated && session) {
                  router.push('/create-category');
                } else {
                  router.replace('/(auth)/auth-model');
                }
              }}
            >
              <ButtonIcon as={Plus} style={{ width: 30, height: 30 }} />
            </Button>
            <Button
              className="bg-primary-200 rounded-full w-20 h-20"
              variant="solid"
              onPress={toggleColorScheme}
            >
              <ButtonIcon as={ isDarkColorScheme ? Moon : Sun} style={{ width: 30, height: 30 }} />
            </Button>
            <Button
              className="bg-primary-200 rounded-full p-1 w-20 h-20"
              variant="solid"
              onPress={() => {
                if (isAuthenticated && session) {
                  router.replace('/(profile)/profile'); 
                } else {
                  router.replace('/(auth)/auth-model'); 
                }
                setShowAddModal(false)}}
            >
              <ButtonIcon as={User} style={{ width: 30, height: 30 }} />
            </Button>
            </VStack>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
