import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import SizedBox from "../components/SizeBox";
import {
  Ionicons,
  Fontisto,
  MaterialIcons,
} from "@expo/vector-icons";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
import { Avatar, Dialog, Divider, ListItem } from "@rneui/themed";
import Constants from "expo-constants";
import { useSelector } from "react-redux";
import {
  chatSelector,
} from "../store/features/chatSlice";
import { userSelector } from "../store/features/userSlice";
import { useTranslation } from "react-i18next";

const InfoChatRoom = ({ navigation, route }) => {
  const { t } = useTranslation();

  const {
    roomMessage,
    isError,
    isSuccess,
    isLoading,
    message,
    roomIdSelected,
  } = useSelector(chatSelector);

  const [visible, setVisible] = useState(false);

  const { chatgroups } = useSelector(userSelector);

  return (
    <ScrollView style={styles.container}>
      <TouchableHighlight
        activeOpacity={0.5}
        underlayColor="#DDDDDD"
        onPress={() => {
          navigation.goBack();
        }}
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 100,
          marginLeft: 10,
        }}
      >
        <Ionicons name="arrow-back" size={24} color={"#000"} />
      </TouchableHighlight>
      <SizedBox height={30} />
      <View style={styles.avatarContainer}>
        <Avatar
          rounded
          source={{ uri: route.params.data.roomAvatar }}
          size={100}
        >
        </Avatar>
        <SizedBox height={10} />
        <View style={styles.nameView}>
          <Text numberOfLines={2} ellipsizeMode={"tail"} style={styles.name}>
            {route.params.data.roomName}
          </Text>
        </View>
      </View>
      <SizedBox height={20} />

      {chatgroups.filter((i) => i._id === route.params.data.roomId)[0].members
        .length > 2 && (
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#DDDDDD"
          onPress={() =>
            navigation.navigate("AddMembers", {
              roomId: route.params.data.roomId,
            })
          }
        >
          <View style={styles.edit}>
            <View style={styles.icon}>
              <MaterialIcons name="person-add-alt-1" size={30} color={"#000"} />
            </View>
            <SizedBox width={15} />
            <Text style={styles.textEdit}>{t("Addmembers")}</Text>
          </View>
        </TouchableHighlight>
      )}

      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => setVisible(!visible)}
      >
        <View style={styles.edit}>
          <View style={styles.icon}>
            <Fontisto name="nav-icon-list-a" size={20} color={"#000"} />
          </View>
          <SizedBox width={15} />
          <Text style={styles.textEdit}>{t("Memberslist")}</Text>
        </View>
      </TouchableHighlight>

      <Dialog
        isVisible={visible}
        onBackdropPress={() => setVisible(!visible)}
        // containerStyle={{ width: 100 }}
        // style={{ width: 100 }}
        // fullScreen
        // backdropStyle={{ width: 100 }}
        overlayStyle={{
          width: windowWidth,
          paddingHorizontal: 0,
          paddingVertical: 0,
        }}
      >
        <Dialog.Title
          title={t("Memberslist")}
          titleStyle={{
            paddingHorizontal: 15,
            paddingVertical: 10,
            backgroundColor: "#0084D0",
            color: "#fff",
            marginBottom: 0,
          }}
        />
        <Divider />
        <View style={{ maxHeight: 300 }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {chatgroups
              .filter((i) => i._id === route.params.data.roomId)[0]
              .members.map((item) => (
                <ListItem
                  key={item._id}
                  Component={TouchableOpacity}
                  containerStyle={{
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  }}
                  pad={15}
                >
                  <Avatar
                    size={40}
                    rounded
                    source={{
                      uri: item.avatar,
                    }}
                    title="D"
                    containerStyle={{ backgroundColor: "grey" }}
                  ></Avatar>

                  <Text
                    numberOfLines={1}
                    ellipsizeMode={"tail"}
                    style={{ width: windowWidth - 85 }}
                  >
                    {item.fullname}
                  </Text>
                </ListItem>
              ))}
          </ScrollView>
        </View>
      </Dialog>
    </ScrollView>
  );
};

export default InfoChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
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
    backgroundColor: "#DDDDDD",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
});
