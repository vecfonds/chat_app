import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Avatar } from "@rneui/themed";
import {  MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import { userSelector } from "../store/features/userSlice";
import { useTranslation } from "react-i18next";

const Header = ({ navigation }) => {
  const { t } = useTranslation();
  const { avatar } = useSelector(userSelector);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Avatar
          containerStyle={styles.avatar}
          rounded
          source={{ uri: avatar }}
          size={40}
          onPress={() => navigation.navigate("Profile")}
        />
        <Text style={styles.title}>{t("AllChats")}</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.icon}
          onPress={() => navigation.navigate("Create Chat Group")}
        >
          <MaterialIcons name="group-add" size={30} color={"black"} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Constants.statusBarHeight,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    borderRadius: 50,
    backgroundColor: "#FFF",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
    marginVertical: 15,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 25,
    fontWeight: "700",
  },
  avatar: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
});
