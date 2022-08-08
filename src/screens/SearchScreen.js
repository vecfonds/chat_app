import { SearchBar } from "@rneui/base";
import React, {
  useContext,
  useEffect,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import {
  Ionicons,
} from "@expo/vector-icons";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
import Constants from "expo-constants";
import { Divider } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import {
  allUsersSelector,
} from "../store/features/allUsersSlice";
import StateCallAPI from "../components/StateCallAPI";
import { addRoomChat, userSelector } from "../store/features/userSlice";
import { changeRoomIdSelected } from "../store/features/chatSlice";
import { AppContext } from "../context/appContext";
import { infoFilter } from "../utils/function";
import { StackActions } from "@react-navigation/native";
import SearchList from "../components/SearchList";
import { useTranslation } from "react-i18next";

const SearchScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { socket } = useContext(AppContext);

  const { isFetching, isSuccess, isError, message, allUsers } =
    useSelector(allUsersSelector);

  const { _id, chatgroups } = useSelector(userSelector);

  const [state, setState] = useState({
    dataSource: [],
    search: "",
  });

  const [arrayholder, setArrayholder] = useState([]);

  useEffect(() => {
    const data = allUsers.filter((user) => user._id !== _id);
    setState((prev) => {
      return {
        ...prev,
        dataSource: [...data],
      };
    });
    setArrayholder([...data]);
  }, []);

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

  function handleSelected(item) {
    const filterUser = chatgroups.filter((user) => {
      if (user.members.length == 2) {
        if (user.members.filter((member) => member._id === item._id).length) {
          return user;
        }
      }
    });

    if (filterUser.length) {
      const { roomAvatar, roomName, lastMessage, roomId } = infoFilter(
        filterUser[0],
        _id
      );

      dispatch(changeRoomIdSelected(roomId));
      navigation.navigate("ChatRoom", {
        roomId,
        roomName,
        roomAvatar,
      });
      const data = {
        socketId: socket.id,
        roomId,
        userId: _id,
      };

      socket.emit("load_room_message", data);
    } else {
      const data = {
        socketId: socket.id,
        userId: _id,
        targetId: item._id,
      };
      socket.emit("create_direct_chat", data);
    }
  }

  useEffect(() => {
    socket.on("direct_chat_created", (data) => {
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
      socket.removeAllListeners("direct_chat_created");
    };
  }, [socket]);

  return (
    <View style={styles.viewStyle}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
        <SearchBar
          onChangeText={(text) => SearchFilterFunction(text)}
          onClear={(text) => SearchFilterFunction("")}
          placeholder={t("Search")}
          value={state.search}
          inputStyle={{ color: "#000" }}
          containerStyle={styles.containerStyle}
          inputContainerStyle={styles.inputContainerStyle}
          leftIconContainerStyle={{ display: "none" }}
        />
      </View>
      <Divider />

      {(isFetching || isError) && (
        <StateCallAPI
          isFetching={isFetching}
          isError={isError}
          message={message}
        />
      )}

      {/* {isFetching && <ActivityIndicator size="large" />} */}

      <SearchList state={state} handleSelected={handleSelected} />
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  viewStyle: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Constants.statusBarHeight,
  },
  textStyle: { padding: 11 },
  view: {
    marginHorizontal: 10,
  },
  containerStyle: {
    backgroundColor: "#fff",
    borderTopWidth: 0,
    borderBottomWidth: 0,
    width: windowWidth - 50,
  },
  inputContainerStyle: {
    backgroundColor: "#fff",
    color: "#000",
  },
});
