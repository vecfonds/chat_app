import { Avatar, ListItem, SearchBar } from "@rneui/base";
import React, { useContext, useEffect, useState } from "react";

import {
  Text,
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  TouchableHighlight,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import {
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";

import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

import Constants from "expo-constants";
import { Badge, CheckBox, Divider } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import {
  allUsersSelector,
  clearState,
  getAllUsers,
} from "../store/features/allUsersSlice";
import StateCallAPI from "../components/StateCallAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { array, object, string } from "zod";
import FormInput from "../components/FormInput";
import { FormProvider, useForm } from "react-hook-form";
import SizedBox from "../components/SizeBox";
import { addRoomChat, userSelector } from "../store/features/userSlice";
import { AppContext } from "../context/appContext";
import { changeRoomIdSelected } from "../store/features/chatSlice";
import { infoFilter } from "../utils/function";
import { StackActions } from "@react-navigation/native";
import { colors } from "../utils/theme/colors";
import SearchList from "../components/SearchList";
import AvatarSlider from "../components/AvatarSlider";
import { useTranslation } from "react-i18next";

const CreateChatGroup = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { socket } = useContext(AppContext);

  const { isSuccess, isError, message, allUsers } =
    useSelector(allUsersSelector);

  const { _id } = useSelector(userSelector);

  const [state, setState] = useState({
    dataSource: [...allUsers],
    search: "",
  });
  const [arrayholder, setArrayholder] = useState([...allUsers]);

  const [selected, setSelected] = useState(() =>
    allUsers.filter((user) => user._id === _id)
  );

  const groupSchema = object({
    groupName: string().trim().nonempty(t("Nameisrequired")).max(70),
  });

  const methods = useForm({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      groupName: "",
    },
  });

  const onSubmit = methods.handleSubmit((data) => {
    data = {
      name: data.groupName,
      members: selected.map((item) => item._id),
    };
    socket.emit("create_group_chat", data);
  });

  useEffect(() => {
    socket.on("group_chat_created", (data) => {
      dispatch(addRoomChat(data));

      const { roomAvatar, roomName, lastMessage, roomId } = infoFilter(
        data,
        _id
      );

      dispatch(changeRoomIdSelected(data._id));

      navigation.dispatch(
        StackActions.replace("ChatRoom", {
          roomId,
          roomName,
          roomAvatar,
        })
      );

      socket.emit("load_room_message", {
        socketId: socket.id,
        roomId,
        userId: _id,
      });
    });
    return () => {
      // socket.off("messages_room", callback);
      socket.removeAllListeners("group_chat_created");
    };
  }, [socket]);

  function handleSelected(select) {
    if (select._id !== _id) {
      if (selected.includes(select)) {
        setSelected((prev) => prev.filter((item) => item !== select));
      } else {
        setSelected((prev) => [select, ...prev]);
      }
    }
  }

  function handleCancel(select) {
    if (select._id !== _id) {
      setSelected((prev) => prev.filter((item) => item !== select));
    }
  }

  function SearchFilterFunction(text) {
    const newData = arrayholder.filter(function (item) {
      const itemData = item.fullname
        ? item.fullname.toUpperCase()
        : "".toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setState({ dataSource: newData, search: text });
  }

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
    }
  }, [isSuccess]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <FormProvider {...methods}>
          <View style={{ paddingHorizontal: 16 }}>
            <FormInput
              label={t("Groupname")}
              name={"groupName"}
              placeholder={t("Groupname")}
              autoComplete="name"
            />
          </View>
        </FormProvider>

        <SizedBox height={20} />

        <View style={styles.containerFlatList}>
          <Text style={styles.label}>{t("Memberslist")}</Text>

          <AvatarSlider selected={selected} handleCancel={handleCancel} />
        </View>

        {/* <SizedBox height={10} /> */}

        <SearchBar
          searchIcon={{ size: 24, marginLeft: 5 }}
          onChangeText={(text) => SearchFilterFunction(text)}
          onClear={(text) => SearchFilterFunction("")}
          placeholder={t("Search")}
          value={state.search}
          inputStyle={{ color: "#000" }}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
        />

        {isError && <StateCallAPI isError={isError} message={message} />}

        <SearchList
          state={state}
          selected={selected}
          handleSelected={handleSelected}
          typeCheckbox
        />

        {/* <SizedBox height={20} />
          {isFetching && <ActivityIndicator size="large" />}
          <SizedBox height={20} /> */}

        <SizedBox height={20} />

        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={onSubmit} disabled={selected.length < 3}>
            <View style={styles.button}>
              <Text style={styles.buttonTitle}>{t("Create")}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <SizedBox height={50} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default CreateChatGroup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingTop: Constants.statusBarHeight + 10,
    height: windowHeight - Constants.statusBarHeight,
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
  containerFlatList: {},
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
