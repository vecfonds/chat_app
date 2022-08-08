import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";

const Screen2 = ({ navigation }) => {
  const name = useSelector((state) => state.setName.value);
  return (
    <View style={styles.container}>
      <Text style={styles.nameText}>{name}</Text>
    </View>
  );
};

export default Screen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nameText:{
    fontSize: 30,
    fontWeight: "bold"
  }
});
