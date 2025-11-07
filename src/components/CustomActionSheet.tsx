import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetVirtualizedList,
} from "@/components/ui/actionsheet";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Check, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";

export interface ActionSheetItem {
  id: string;
  label: string;
  value?: any;
  item: any;
  icon?: React.ComponentType<any>;
  disabled?: boolean;
  description?: string;
}

export interface CustomActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  items: ActionSheetItem[];
  selectedItems?: string[];
  onItemSelect?: (item: ActionSheetItem) => void;
  onItemsSelect?: (items: ActionSheetItem[]) => void;
  allowMultiple?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm?: (selectedItems: ActionSheetItem[]) => void;
  onCancel?: () => void;
  maxHeight?: number;
  // renderItem?: (item: ActionSheetItem, isSelected: boolean, onPress: () => void) => React.ReactNode;
}

export const CustomActionSheet = ({
  isOpen,
  onClose,
  title = "Select Item",
  subtitle,
  items,
  selectedItems = [],
  onItemSelect,
  onItemsSelect,
  allowMultiple = false,
  showSearch = false,
  searchPlaceholder = "Search...",
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  onConfirm,
  onCancel,
  maxHeight = 800,
  // renderItem,
}: CustomActionSheetProps) => {
  const [internalSelectedItems, setInternalSelectedItems] = useState<string[]>(selectedItems);
  const [searchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState<ActionSheetItem[]>(items);

  // Update internal state when selectedItems prop changes
  useEffect(() => {
    setInternalSelectedItems(selectedItems);
  }, [selectedItems]);

  // Filter items based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = items.filter(item =>
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items);
    }
  }, [searchQuery, items]);

  const handleItemPress = (item: ActionSheetItem) => {
    if (item.disabled) return;

    if (allowMultiple) {
      const newSelectedItems = internalSelectedItems.includes(item.id)
        ? internalSelectedItems.filter(id => id !== item.id)
        : [...internalSelectedItems, item.id];
      
      setInternalSelectedItems(newSelectedItems);
      
      // Return complete objects with all their properties
      const selectedItemsObjects = items.filter(i => newSelectedItems.includes(i.id));
      onItemsSelect?.(selectedItemsObjects);
    } else {
      setInternalSelectedItems([item.id]);
      onItemSelect?.(item);
      onClose();
    }
  };

  const handleConfirm = () => {
    // Return complete objects with all their properties
    const selectedItemsObjects = items.filter(item => internalSelectedItems.includes(item.id));
    onConfirm?.(selectedItemsObjects);
    onClose();
  };

  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const isItemSelected = (itemId: string) => internalSelectedItems.includes(itemId);


  const renderItemComponent = (item: ActionSheetItem) => {
    const isSelected = isItemSelected(item.id);
    const onPress = () => handleItemPress(item);
    return (<Pressable
      onPress={onPress}
      disabled={item.disabled}
      className={`p-4 border-b border-gray-200 ${
        item.disabled ? 'opacity-50' : 'opacity-100'
      } ${isSelected ? 'bg-blue-50' : 'bg-white'}`}
    >
      <HStack className="items-center justify-between">
        <HStack className="items-center flex-1">
          {/* {item.icon && (
            <Box className="mr-3">
              <Icon as={item.icon} size="lg" className="text-gray-600" />
            </Box>
          )} */}
          <VStack className="flex-1">
            <Text className={`text-base font-medium ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
              {item.label}
            </Text>
            {item.description && (
              <Text className="text-sm text-gray-500 mt-1">
                {item.description}
              </Text>
            )}
          </VStack>
        </HStack>
        {isSelected && (
          <Icon as={Check} size="lg" className="text-primary-600" />
        )}
      </HStack>
    </Pressable>)
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent className="px-5" style={{ height: maxHeight }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <HStack className="justify-between w-full mt-3 mb-4">
          <VStack className="flex-1">
            <Heading size="md" className="font-semibold">
              {title}
            </Heading>
            {subtitle && (
              <Text size="sm" className="text-gray-500 mt-1">
                {subtitle}
              </Text>
            )}
          </VStack>
          <Pressable onPress={onClose} className="p-2">
            <Icon as={X} size="lg" className="stroke-gray-500" />
          </Pressable>
        </HStack>

         {/* Search Bar */}
         {showSearch && (
          <Box className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Search</Text>
            <Box className="border border-gray-300 rounded-lg p-3">
              <Text className="text-gray-500">
                {searchPlaceholder}
              </Text>
            </Box>
          </Box>
        )}

        <ActionsheetVirtualizedList
            className="h-56"
            data={filteredItems}
            initialNumToRender={5}
            renderItem={({ item }) => renderItemComponent(item as ActionSheetItem) as React.ReactElement}
            keyExtractor={(item: unknown, index: number) => index.toString()}
            getItemCount={(data) => data.length}
            getItem={(data, index) => data[index]}
          />
        

       


        {/* Action Buttons */}
        {allowMultiple && (
          <HStack className="space-x-3 mb-4">
            <Button
              variant="outline"
              className="flex-1"
              onPress={handleCancel}
            >
              <ButtonText>{cancelButtonText}</ButtonText>
            </Button>
            <Button
              className="flex-1"
              onPress={handleConfirm}
              disabled={internalSelectedItems.length === 0}
            >
              <ButtonText>
                {confirmButtonText} {internalSelectedItems.length > 0 && `(${internalSelectedItems.length})`}
              </ButtonText>
            </Button>
          </HStack>
        )}
      </ActionsheetContent>
    </Actionsheet>
  );
};
