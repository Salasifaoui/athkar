import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";

interface ZixDialogueBoxProps {
  isOpen: boolean;
  onClose: () => void;
  header?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function ZixDialogueBox({
  isOpen,
  onClose,
  header,
  children,
  footer,
}: ZixDialogueBoxProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose} size="lg" className="rounded-none border-none">
      <AlertDialogBackdrop />
      <AlertDialogContent className="p-0">
        {header && <AlertDialogHeader className="bg-primary-500 w-full">{header}</AlertDialogHeader>}
        <AlertDialogBody>{children}</AlertDialogBody>
        {footer && <AlertDialogFooter className="p-5">{footer}</AlertDialogFooter>}
      </AlertDialogContent>
    </AlertDialog>
  );
}
