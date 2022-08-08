import { Avatar } from "@rneui/base";
import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import {  userSelector } from "../store/features/userSlice";
import { Dimensions } from "react-native";
const windowHeight = Dimensions.get("window").height;

const AvatarSlider = ({ selected, handleCancel }) => {
  const { _id } = useSelector(userSelector);

  const [isFetching, setIsFetching] = useState(false);

  const onRefresh = async () => {
    setIsFetching(true);
    await sleep(2000);
    setIsFetching(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.userIconContainer}>
      <Avatar
        size={55}
        rounded
        source={{
          uri: item.avatar,
        }}
        title="D"
        containerStyle={{ backgroundColor: "grey" }}
      >
        <Ionicons
          name="close-circle"
          size={24}
          color={"#3C3F41"}
          style={{ position: "absolute", top: 0, left: 40 }}
          onPress={() => handleCancel(item)}
        />
      </Avatar>
      <View style={styles.viewUserName}>
        <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.userName}>
          {item.fullname.split(" ").pop()}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal
      onRefresh={onRefresh}
      refreshing={isFetching}
      data={selected}
      renderItem={renderItem}
    />
  );
};

export default AvatarSlider;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingTop: Constants.statusBarHeight + 10,
    height: windowHeight - Constants.statusBarHeight,

    // paddingVertical: 15,
    // flex: 1,
  },
  viewUserName: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
  },
  userName: {
    fontSize: 13,
    fontWeight: "400",
    color: "#000",
  },
  userIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  containerStyle: {
    backgroundColor: "#fff",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainerStyle: {
    backgroundColor: "#F6F6F6",
    borderRadius: 50,
  },
  containerFlatList: {
    // paddingHorizontal: 15,
    // paddingVertical: 10,
  },
  checkbox: {
    padding: 0,
    margin: 0,
    width: 0,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#0B69FF",
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
  },
  buttonTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
  },
  label: {
    color: "#B7B7B7",
    left: 15,
    bottom: 5,
  },
  sliderHorizontal: {
    flexDirection: "row",
    flexWrap: "nowrap",
    overflow: "scroll",
  },
});
