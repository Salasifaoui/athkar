import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { Bell, Heart, Settings, Star, User } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActionSheetItem, CustomActionSheet } from './CustomActionSheet';

export const ActionSheetExample = () => {
  const [showSingleSelect, setShowSingleSelect] = useState(false);
  const [showMultiSelect, setShowMultiSelect] = useState(false);
  const [showSearchable, setShowSearchable] = useState(false);
  const [selectedSingleItem, setSelectedSingleItem] = useState<ActionSheetItem | null>(null);
  const [selectedMultiItems, setSelectedMultiItems] = useState<ActionSheetItem[]>([]);

  // Sample data for different scenarios
  const singleSelectItems: ActionSheetItem[] = [
    {
      id: '1',
      label: 'Profile',
      value: 'profile',
      icon: User,
      description: 'View and edit your profile'
    },
    {
      id: '2',
      label: 'Settings',
      value: 'settings',
      icon: Settings,
      description: 'App settings and preferences'
    },
    {
      id: '3',
      label: 'Notifications',
      value: 'notifications',
      icon: Bell,
      description: 'Manage notification preferences'
    }
  ];

  const multiSelectItems: ActionSheetItem[] = [
    {
      id: '1',
      label: 'Favorites',
      value: 'favorites',
      icon: Heart,
      description: 'Add to favorites'
    },
    {
      id: '2',
      label: 'Starred',
      value: 'starred',
      icon: Star,
      description: 'Mark as starred'
    },
    {
      id: '3',
      label: 'Bookmarked',
      value: 'bookmarked',
      icon: Heart,
      description: 'Save for later'
    },
    {
      id: '4',
      label: 'Shared',
      value: 'shared',
      icon: User,
      description: 'Share with others'
    }
  ];

  const searchableItems: ActionSheetItem[] = [
    { id: '1', label: 'Apple', value: 'apple', description: 'Red fruit' },
    { id: '2', label: 'Banana', value: 'banana', description: 'Yellow fruit' },
    { id: '3', label: 'Orange', value: 'orange', description: 'Citrus fruit' },
    { id: '4', label: 'Grape', value: 'grape', description: 'Small round fruit' },
    { id: '5', label: 'Strawberry', value: 'strawberry', description: 'Red berry fruit' },
    { id: '6', label: 'Mango', value: 'mango', description: 'Tropical fruit' },
    { id: '7', label: 'Pineapple', value: 'pineapple', description: 'Spiky tropical fruit' },
    { id: '8', label: 'Watermelon', value: 'watermelon', description: 'Large green fruit' }
  ];

  const handleSingleSelect = (item: ActionSheetItem) => {
    setSelectedSingleItem(item);
    console.log('Selected item:', item);
  };

  const handleMultiSelect = (items: ActionSheetItem[]) => {
    setSelectedMultiItems(items);
    console.log('Selected items:', items);
  };

  return (
    <VStack className="p-4 space-y-4">
      <Text className="text-xl font-bold mb-4">ActionSheet Examples</Text>
      
      {/* Single Selection Example */}
      <VStack className="space-y-2">
        <Text className="text-lg font-semibold">Single Selection</Text>
        <Button onPress={() => setShowSingleSelect(true)}>
          <ButtonText>Open Single Select</ButtonText>
        </Button>
        {selectedSingleItem && (
          <Text className="text-sm text-gray-600">
            Selected: {selectedSingleItem.label}
          </Text>
        )}
      </VStack>

      {/* Multiple Selection Example */}
      <VStack className="space-y-2">
        <Text className="text-lg font-semibold">Multiple Selection</Text>
        <Button onPress={() => setShowMultiSelect(true)}>
          <ButtonText>Open Multi Select</ButtonText>
        </Button>
        {selectedMultiItems.length > 0 && (
          <Text className="text-sm text-gray-600">
            Selected: {selectedMultiItems.map(item => item.label).join(', ')}
          </Text>
        )}
      </VStack>

      {/* Searchable Example */}
      <VStack className="space-y-2">
        <Text className="text-lg font-semibold">Searchable Items</Text>
        <Button onPress={() => setShowSearchable(true)}>
          <ButtonText>Open Searchable</ButtonText>
        </Button>
      </VStack>

      {/* ActionSheets */}
      <CustomActionSheet
        isOpen={showSingleSelect}
        onClose={() => setShowSingleSelect(false)}
        title="Select an Option"
        subtitle="Choose one option from the list"
        items={singleSelectItems}
        onItemSelect={handleSingleSelect}
        allowMultiple={false}
      />

      <CustomActionSheet
        isOpen={showMultiSelect}
        onClose={() => setShowMultiSelect(false)}
        title="Select Multiple Options"
        subtitle="Choose multiple options from the list"
        items={multiSelectItems}
        selectedItems={selectedMultiItems.map(item => item.id)}
        onItemsSelect={handleMultiSelect}
        allowMultiple={true}
        confirmButtonText="Apply"
        cancelButtonText="Cancel"
      />

      <CustomActionSheet
        isOpen={showSearchable}
        onClose={() => setShowSearchable(false)}
        title="Search Items"
        subtitle="Search and select from the list"
        items={searchableItems}
        onItemSelect={(item) => console.log('Selected:', item)}
        allowMultiple={false}
        showSearch={true}
        searchPlaceholder="Search fruits..."
      />
    </VStack>
  );
};
