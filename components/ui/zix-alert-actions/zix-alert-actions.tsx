import React, { useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

export interface ZixAlertAction {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export interface ZixAlertActionsProps {
  children?: React.ReactNode;
  childrenContent?: React.ReactNode;
  closeButton: boolean;
  visible?: boolean;
  onClose?: () => void;
}

export const ZixAlertActions: React.FC<ZixAlertActionsProps> = ({
  children,
  childrenContent,
  closeButton,
  visible = false,
  onClose,
}) => {
  const [modalVisible, setModalVisible] = useState(visible);

  // Update modal visibility when visible prop changes
  React.useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const handleClose = () => {
    setModalVisible(false);
    onClose?.();
  };

  if (!closeButton) {
    return <View>{children}</View>;
  }

  return (
    <View>
      {children}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={handleClose}
        transparent={true}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.contentContainer}>
              {childrenContent}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: 'transparent',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    gap: 16,
  },
});

export default ZixAlertActions;
