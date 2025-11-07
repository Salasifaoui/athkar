import { StyleSheet, View, ViewProps } from "react-native";

interface ZixCartProps extends Omit<ViewProps, 'children'> {
  children: React.ReactNode;
}

export const ZixCart: React.FC<ZixCartProps> = ({ children, ...rest }) => {

  return (
    <View
    style={styles.container}
      {...rest}
    >
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    padding: 10,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
  },
});

export default ZixCart;