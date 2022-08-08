import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addName } from "../store/setNameSlice";

const Screen1 = ({ navigation }) => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);

  const authentication = (_name) => {
    if (name.length) {
      return true;
    }
    setNameError(true);
    return false;
  };

  const handleInputName = (_name) => {
    setNameError(false);
    setName(_name);
  };

  const handleSubmit = () => {
    if (authentication(name.trim())) {
      setName("");
      dispatch(addName(name));
      navigation.navigate("Screen 2");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.inputView}>
          <TextInput
            style={styles.input}
            onChangeText={handleInputName}
            value={name}
            autoFocus={true}
            placeholder="Name"
          />
          {nameError && <Text style={styles.textDanger}>Name is required</Text>}
        </View>
        <Button 
        title="Submit" onPress={handleSubmit} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Screen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputView: {
    width: "90%",
  },
  input: {
    height: 50,
    fontSize: 16,
    marginBottom: 40,
    borderWidth: 1,
    paddingLeft: 10,
    borderColor: "#AAAAAA",
    backgroundColor: "#fff",
  },

  textDanger: {
    color: "#dc3545",
    fontSize: 10,
    position: "absolute",
    bottom: 20,
  },
});
