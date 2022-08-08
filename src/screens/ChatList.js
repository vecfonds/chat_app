import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableHighlight,
  Text,
} from "react-native";
import Header from "../components/Header";
import SearchBox from "../components/SearchBox";
import ActivitySlider from "../components/ActivitySlider";
import {
  userSelector,
  clearState,
  fetchUserBytoken,
  updateLastMessage,
  updateLastSeen,
} from "../store/features/userSlice";
import {
  chatSelector,
  changeRoomIdSelected,
  addNotification,
  changeOldRoom,
} from "../store/features/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import { useContext, useEffect } from "react";
import { Avatar, Badge, ListItem } from "@rneui/themed";
import SizeBox from "../components/SizeBox";
import Moment from "moment";
import { AppContext } from "../context/appContext";
import StateCallAPI from "../components/StateCallAPI";
import { getAllUsers } from "../store/features/allUsersSlice";
import { infoFilter } from "../utils/function";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Notification from "../components/Notification";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;

const ChatList = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { socket } = useContext(AppContext);
  const { oldRoomId } = useSelector(chatSelector);
  const {
    _id,
    fullname,
    chatgroups,
    isFetching,
    isSuccess,
    isError,
    lastSeen,
    message,
  } = useSelector(userSelector);

  function showTimeLastMessage(time) {
    if (Moment(time).format("YYYY") === Moment(new Date()).format("YYYY")) {
      //cung nam
      if (Moment(time).format("W") === Moment(new Date()).format("W")) {
        //cung tuan trong nam
        if (Moment(time).format("DDD") === Moment(new Date()).format("DDD")) {
          //cung ngay trong nam
          return Moment(time).format("hh:mm A");
        } else {
          return Moment(time).format("ddd");
        }
      } else {
        return Moment(time).format("MMM D");
      }
    } else {
      return Moment(time).format("DD/MM/YYYY");
    }
  }

  function showLastMessage(item) {
    if (item.members.length == 2) {
      if (item.lastMessage.user === _id) {
        return `Bạn: `;
      } else {
        return "";
      }
    } else {
      return `${
        item.lastMessage.user === _id
          ? "Bạn"
          : item.members.filter((i) => i._id === item.lastMessage.user)[0]
              .fullname
      }: `;
    }
  }

  function handleLastSeen(roomId, item) {
    if (item.lastMessage?.user === _id) {
      return false;
    }

    const roomFliter = lastSeen.filter((i) => i.chatGroupID === roomId);

    if (roomFliter.length) {
      if (
        +new Date(roomFliter[0].time) < +new Date(item.lastMessage?.createdAt)
      ) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    dispatch(fetchUserBytoken());
    dispatch(getAllUsers());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      chatgroups?.forEach((item) => {
        const { roomAvatar, roomName, lastMessage, roomId } = infoFilter(
          item,
          _id
        );
        const data = {
          _id,
          fullname: fullname,
          room: roomId,
        };

        socket.emit("join_room", data);
      });
      dispatch(clearState());
    }
  }, [isSuccess]);

  useEffect(() => {
    socket.on("notification", (data) => {
      async function sendPushNotification(data) {
        const expoPushToken = await AsyncStorage.getItem("expoPushToken");
        const roomIdStorage = await AsyncStorage.getItem("roomIdStorage");

        if (roomIdStorage !== data.chatGroupID) {
          const groupFilter = chatgroups.filter(
            (chatgroup) => chatgroup._id === data.chatGroupID
          )[0];
          let message;
          if (groupFilter.members.length === 2) {
            message = {
              to: expoPushToken,
              sound: "default",
              title: data.author?.fullname,
              body: data.body,
              data: { someData: "goes here" },
            };
          } else {
            message = {
              to: expoPushToken,
              sound: "default",
              title: groupFilter.name,
              body: `${data.author?.fullname}: ${data.body}`,
              data: { someData: "goes here" },
            };
          }

          await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          });
        }
      }
      sendPushNotification(data);

      const message = {
        _id: data._id,
        user: data.author?._id,
        text: data.body,
        chatGroupID: data.chatGroupID,
        createdAt: Moment(data.createdAt).toISOString(),
      };

      dispatch(updateLastMessage(message));
      dispatch(addNotification({ chatGroupID: data.chatGroupID }));
    });

    return () => {
      socket.removeAllListeners("notification");
    };
  }, [socket]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Header navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <SearchBox navigation={navigation} />
        <ActivitySlider />

        {isFetching && <StateCallAPI isFetching={isFetching} />}

        {chatgroups?.map((item) => {
          const { roomAvatar, roomName, lastMessage, roomId } = infoFilter(
            item,
            _id
          );

          return (
            <ListItem
              key={item._id}
              // rightContent={() => (
              //   <FontAwesome5 name="trash-alt" size={24} color="#8E8E8F" />
              // )}
              // rightWidth={60}
              // leftWidth={0}
              // rightStyle={{ justifyContent: "center", alignItems: "center" }}
              Component={TouchableHighlight}
              containerStyle={[
                {
                  paddingVertical: 7,
                  paddingHorizontal: 15,
                },
                // notification[roomId] ? styles.bgNotification : null,
                handleLastSeen(roomId, item) && styles.bgNotification,
              ]}
              disabledStyle={{ opacity: 0.5 }}
              onPress={() => {
                dispatch(changeOldRoom());
                dispatch(changeRoomIdSelected(roomId));
                dispatch(updateLastSeen(roomId));

                const data = {
                  socketId: socket.id,
                  roomId,
                  userId: _id,
                  prevRoomId: oldRoomId,
                };
                socket.emit("load_room_message", data);

                navigation.navigate("ChatRoom", {
                  roomId,
                  roomName,
                  roomAvatar,
                });
              }}
              pad={15}
            >
              <Avatar
                size={55}
                rounded
                source={{
                  uri: roomAvatar,
                }}
                title="D"
                containerStyle={{ backgroundColor: "grey" }}
              >
                <Badge
                  value={" "}
                  status="success"
                  containerStyle={{
                    position: "absolute",
                    bottom: 0,
                    left: 40,
                  }} //right: 2
                />

                {/* <Avatar.Accessory
                  source={{
                    uri: "https://randomuser.me/api/portraits/women/57.jpg",
                  }}
                  size={15}
                /> */}
              </Avatar>

              <ListItem.Content>
                <Text
                  style={[
                    styles.titleListItem,
                    // notification[roomId] ? styles.textNotification : null,
                    handleLastSeen(roomId, item) && styles.textNotification,
                  ]}
                  numberOfLines={1}
                  ellipsizeMode={"tail"}
                >
                  {roomName}
                </Text>

                <SizeBox height={1} />

                <Text
                  numberOfLines={1}
                  ellipsizeMode={"middle"}
                  style={[
                    styles.textLastMessage,
                    // notification[roomId] ? styles.textNotification : null,
                    handleLastSeen(roomId, item) && styles.textNotification,
                  ]}
                >
                  {item.lastMessage
                    ? `${showLastMessage(
                        item
                      )}${lastMessage} - ${showTimeLastMessage(
                        item.lastMessage.createdAt
                      )}`
                    : ""}
                </Text>
              </ListItem.Content>

              {/* <FontAwesome name="check-circle" size={18} color={"#8E8E8F"} /> */}
              {/* <Text>{item.lastMessage?Date(item.lastMessage.createAt):""}</Text> */}
              {/* <Text style={styles.textLastMessage}>
                {item.lastMessage
                  ? showTimeLastMessage(item.lastMessage.createAt)
                  : ""}
              </Text> */}

              {/* {notification[roomId] ? (
                <Badge value={notification[roomId]} status="error" />
              ) : null} */}
            </ListItem>
          );
        })}
      </ScrollView>
      <Notification />
    </SafeAreaView>
  );
};

export default ChatList;

export const styles = new StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  titleListItem: {
    fontSize: 16,
    // fontWeight: "500",
    color: "#3C3F41",
  },
  textLastMessage: {
    width: windowWidth - 105,
    color: "#3C3F41",
  },
  textNotification: {
    fontWeight: "700",
    color: "#000",
  },
  bgNotification: {
    // backgroundColor: "#EEEEEE",
  },
});
