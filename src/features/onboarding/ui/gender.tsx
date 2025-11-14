import { NavBar } from "@/components/ui/nav-bar";
import { ScreenLayout } from "@/components/ui/screen-layout/screen-layout";
import { ButtonArrowBack } from "@/src/components";
import Step from "./component/step";


export default function Gender() {
  return (
     <ScreenLayout>
      <NavBar title="اختر الجنس">
        <ButtonArrowBack />
      </NavBar>
      <Step currentStep="gender" />
    </ScreenLayout>
  );
}