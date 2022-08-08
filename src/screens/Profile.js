import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { Avatar, Divider } from "@rneui/themed";
import SizedBox from "../components/SizeBox";
import { FontAwesome, Feather, AntDesign } from "@expo/vector-icons";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
import { useSelector, useDispatch } from "react-redux";
import {
  userSelector,
  clearState,
  clearData,
} from "../store/features/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Moment from "moment";
import { AppContext } from "../context/appContext";
import { useTranslation } from "react-i18next";

const Profile = ({ navigation }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { socket } = useContext(AppContext);

  const {
    address,
    _id,
    email,
    password,
    isActive,
    phoneNumber,
    fullname,
    birthDay,
    avatar,
    __v,
    chatgroups,
    isFetching,
    isSuccess,
    isError,
  } = useSelector(userSelector);

  useEffect(() => {
    dispatch(clearState());
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
    dispatch(clearData());

    socket.disconnect();

    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <SizedBox height={20} />
      <View style={styles.avatarContainer}>
        <Avatar rounded source={{ uri: avatar }} size={100}></Avatar>
        <View style={styles.nameView}>
          <Text numberOfLines={2} ellipsizeMode={"tail"} style={styles.name}>
            {fullname}
          </Text>
        </View>
      </View>

      <SizedBox height={20} />

      <Text style={styles.title}>{t("Personalinformation")}</Text>

      <SizedBox height={5} />
      <Divider />

      <TouchableOpacity style={styles.row}>
        <Text style={styles.col1}>{t("Fullname")}</Text>
        <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.col2}>
          {fullname}
        </Text>
      </TouchableOpacity>
      <Divider />

      <TouchableOpacity style={styles.row}>
        <Text style={styles.col1}>{t("Gender")}</Text>
        <Text style={styles.col2}>{t("Male")}</Text>
      </TouchableOpacity>
      <Divider />

      <TouchableOpacity style={styles.row}>
        <Text style={styles.col1}>{t("Dateofbirth")}</Text>
        <Text style={styles.col2}>{Moment(birthDay).format("DD/MM/YYYY")}</Text>
      </TouchableOpacity>
      <Divider />

      <TouchableOpacity style={styles.row}>
        <Text style={styles.col1}>{t("Phone")}</Text>
        <Text numberOfLines={1} ellipsizeMode={"tail"} style={styles.col2}>
          {phoneNumber}
        </Text>
      </TouchableOpacity>
      <Divider />

      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => navigation.navigate("Edit Profile")}
      >
        <View style={styles.edit}>
          <View style={styles.icon}>
            <Feather name="edit-3" size={24} color={"#fff"} />
          </View>
          <SizedBox width={15} />
          <Text style={styles.textEdit}>{t("EditProfile")}</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => navigation.navigate("ChangePassword")}
      >
        <View style={styles.edit}>
          <View style={styles.icon}>
            <FontAwesome name="key" size={24} color={"#fff"} />
          </View>
          <SizedBox width={15} />
          <Text style={styles.textEdit}>{t("Changepassword")}</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => navigation.navigate("Language")}
      >
        <View style={styles.edit}>
          <View style={styles.icon}>
            <FontAwesome name="language" size={24} color={"#fff"} />
          </View>
          <SizedBox width={15} />
          <Text style={styles.textEdit}>{t("Language")}</Text>
        </View>
      </TouchableHighlight>

      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={handleLogout}
      >
        <View style={[styles.edit]}>
          <View style={[styles.icon, styles.editLogout]}>
            <AntDesign name="logout" size={24} color={"#fff"} />
          </View>
          <SizedBox width={15} />
          <Text style={styles.textEdit}>{t("Logout")}</Text>
        </View>
      </TouchableHighlight>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  nameView: {
    width: windowWidth - 100,
    justifyContent: "center",
    alignItems: "center",
  },

  name: {
    fontSize: 24,
    fontWeight: "700",
    paddingHorizontal: 10,
    margin: 10,
    textAlign: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    marginLeft: 10,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 18,
    minHeight: 50,
  },

  col1: {
    width: 150,
    fontSize: 16,
  },

  col2: {
    fontSize: 16,
    width: windowWidth - 180,
  },

  edit: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    minHeight: 60,
  },

  textEdit: {
    color: "#000",
    fontSize: 16,
  },

  editLogout: {
    backgroundColor: "#3C3F41",
  },

  icon: {
    backgroundColor: "#0084D0",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
