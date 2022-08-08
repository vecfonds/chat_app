import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react";
import { Avatar, Badge, ListItem } from "@rneui/themed";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  Actions,
  Bubble,
  GiftedChat,
  InputToolbar,
} from "react-native-gifted-chat";
import uuid from "react-native-uuid";
import Constants from "expo-constants";
import { useSelector, useDispatch } from "react-redux";
import {
  chatSelector,
  clearData,
  clearState,
  loadRoomMessage,
  loadMessageRoom,
  changeOldRoom,
} from "../store/features/chatSlice";
import {
  updateLastMessage,
  updateLastSeen,
  userSelector,
} from "../store/features/userSlice";
import { AppContext } from "../context/appContext";
import Moment from "moment";
var axios = require("axios");
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;

// import * as Firebase from "firebase";
import { firebaseConfig } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { t } from "i18next";

const ChatRoom = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { socket } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const { _id, fullname, avatar, chatgroups } = useSelector(userSelector);

  const {
    roomMessage,
    isError,
    isSuccess,
    isLoading,
    message,
    roomIdSelected,
  } = useSelector(chatSelector);

  const senderUser = {
    _id,
    avatar,
    name: fullname,
  };

  function convertMessageApp(data) {
    return {
      _id: data._id,
      text: data.body,
      createdAt: new Date(data.createAt), //Moment(new Date(data.createAt)).toISOString(),//new Date(data.createAt)
      user: {
        _id: data.author._id,
        name: data.author.fullname,
        avatar: data.author.avatar,
        id: data.author.id,
      },
      image: data.image,
      chatGroupID: data.chatGroupID,
      id: data.id,
    };
  }

  function convertMessageWeb(data) {
    return {
      body: data.text,
      createAt: new Date(data.createdAt), //Moment(new Date(data.createAt)).toISOString(),//new Date(data.createdAt)
      author: {
        _id: data.user._id,
        id: data.user._id,
        fullname: data.user.name,
        avatar: data.user.avatar,
      },
      image: data.image,
      chatGroupID: route.params.roomId,
      // isRead: data.isRead,
    };
  }

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync();

    if (pickerResult.cancelled === true) {
      return;
    }

    let id = uuid.v4();

    setSelectedImage({ localUri: pickerResult.uri, id });
  };

  useEffect(() => {
    const roomIdStorage = async () =>
      await await AsyncStorage.setItem("roomIdStorage", route.params.roomId);

    roomIdStorage();
  }, []);

  useEffect(() => {
    if (roomIdSelected) {
      const callback = (data) => {
        dispatch(loadMessageRoom(data));
      };

      socket.on("messages_room", callback);
    }

    return () => {
      // socket.off("messages_room", callback);
      socket.removeAllListeners("messages_room");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    if (isSuccess) {
      const messagesConvertApp = roomMessage.map((message) =>
        convertMessageApp(message)
      );
      setMessages(messagesConvertApp.reverse());
    }
    dispatch(clearState());
  }, [isSuccess]);

  useEffect(() => {
    if (roomIdSelected) {
      socket.on("receive_message", (data) => {
        if (data.author._id !== _id) {
          let message = convertMessageApp(data);
          setMessages((prev) => [message, ...prev]);
        }
        dispatch(updateLastSeen(roomIdSelected));
      });
    }

    return () => {
      // socket.off("messages_room", callback);
      socket.removeAllListeners("receive_message");
    };
  }, [socket]);

  // if (!Firebase.apps.length) {
  //   Firebase.initializeApp(firebaseConfig);
  // }

  const uploadImage = async () => {
    // const blob = await new Promise((resolve, reject) => {
    //   const xhr = new XMLHttpRequest();
    //   xhr.onload = function () {
    //     resolve(xhr.response);
    //   };
    //   xhr.onerror = function () {
    //     reject(new TypeError("Network request failed"));
    //   };
    //   xhr.responseType = "blob";
    //   xhr.open("GET", selectedImage.localUri, true);
    //   xhr.send(null);
    // });
    // const ref = Firebase.storage().ref().child(new Date().toISOString());
    // const snapshot = ref.put(blob);
    // snapshot.on(
    //   Firebase.storage.TaskEvent.STATE_CHANGED,
    //   () => {
    //     console.log("pending");
    //   },
    //   (error) => {
    //     console.log(error);
    //     blob.close();
    //     return;
    //   },
    //   () => {
    //     snapshot.snapshot.ref.getDownloadURL().then((url) => {
    //       blob.close();
    //       let message = {
    //         createAt: new Date(), //Moment(new Date()),//new Date()
    //         author: {
    //           fullname,
    //           _id,
    //           avatar,
    //           id: _id,
    //         },
    //         image: url,
    //         chatGroupID: route.params.roomId,
    //         body: "",
    //       };
    //       socket.emit("send_message", message);
    //       message["_id"] = selectedImage.id;
    //       message = convertMessageApp(message);
    //       setMessages((previousMessages) =>
    //         GiftedChat.append(previousMessages, message)
    //       );
    //       setSelectedImage(null);
    //       return url;
    //     });
    //   }
    // );
  };

  useEffect(() => {
    if (selectedImage) {
      let sendImage = async () => {
        const url = selectedImage.localUri;
        let message = {
          createAt: new Date(), //Moment(new Date()),//new Date()
          author: {
            fullname,
            _id,
            avatar,
            id: _id,
          },
          image: url,
          chatGroupID: route.params.roomId,
          body: "",
        };
        socket.emit("send_message", message);

        message["_id"] = selectedImage.id;
        message = convertMessageApp(message);

        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, message)
        );
        setSelectedImage(null);
      };
      sendImage();
      // uploadImage();
    }
  }, [selectedImage]);

  const onSend = useCallback((messages = []) => {
    if (messages[0].text.trim()) {
      let message = {
        ...messages[0],
        chatGroupID: route.params.roomId,
      };

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, message)
      );

      message = {
        ...message,
        user: message.user._id,
        createdAt: Moment(message.createdAt).toISOString(),
      };

      dispatch(updateLastMessage(message));
      dispatch(updateLastSeen(roomIdSelected));

      message = convertMessageWeb(messages[0]);

      socket.emit("send_message", message);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableHighlight
          activeOpacity={0.5}
          underlayColor="#DDDDDD"
          onPress={() => {
            dispatch(updateLastSeen(roomIdSelected));
            dispatch(clearData());

            const roomIdStorage = async () =>
              await await AsyncStorage.setItem("roomIdStorage", "");

            roomIdStorage();
            navigation.goBack();
          }}
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
            marginLeft: -5,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={"#0084FF"} />
        </TouchableHighlight>
      ),
      headerTitle: () => (
        <View style={{ marginLeft: 0 }}>
          <ListItem
            Component={TouchableOpacity}
            containerStyle={{
              minWidth: 250,
              paddingVertical: 2,
              paddingHorizontal: 0,
            }}
            onPress={() =>
              navigation.navigate("InfoChatRoom", { data: route.params })
            }
            pad={10}
          >
            <Avatar
              size={40}
              rounded
              source={{
                uri: route.params.roomAvatar,
              }}
              title="Activity"
              containerStyle={{ backgroundColor: "grey" }}
            ></Avatar>

            {/* <Badge
              value={" "}
              status="success"
              containerStyle={{
                position: "absolute",
                bottom: 0,
                left: 28,
              }}
            /> */}

            <View>
              <View
                style={{
                  width: windowWidth - 200,
                }}
              >
                <Text numberOfLines={1} ellipsizeMode={"tail"}>
                  {route.params.roomName}
                </Text>
              </View>
              <Text>{t("Online")}</Text>
            </View>
          </ListItem>
        </View>
      ),
      headerRight: () => (
        <TouchableHighlight
          activeOpacity={0.5}
          underlayColor="#DDDDDD"
          onPress={() =>
            navigation.navigate("InfoChatRoom", { data: route.params })
          }
          style={{
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 100,
          }}
        >
          <MaterialIcons name="info" size={24} color={"#0084FF"} />
        </TouchableHighlight>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={senderUser}
        scrollToBottom
        infiniteScroll
        renderUsernameOnMessage={
          chatgroups.filter((group) => group._id === roomIdSelected)[0].members
            .length > 2
        }
        scrollToBottomStyle={{
          backgroundColor: "yellow",
        }}
        renderActions={(props) => (
          <Actions
            {...props}
            containerStyle={{
              position: "absolute",
              right: 50,
              bottom: 5,
              zIndex: 9999,
            }}
            onPressActionButton={openImagePickerAsync}
            icon={() => <Ionicons name="camera" size={30} color={"#0084FF"} />}
          />
        )}
        timeTextStyle={{ right: { color: "#000" } }}
        renderSend={(props) => {
          const { text, messageIdGenerator, user, onSend } = props;
          return (
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 5,
              }}
              onPress={() => {
                if (text && onSend) {
                  onSend(
                    {
                      text: text.trim(),
                      user,
                      _id: messageIdGenerator(),
                    },
                    true
                  );
                }
              }}
            >
              <Ionicons
                name="send"
                size={20}
                color={"#0084FF"}
                style={{ zIndex: 1000 }}
              />
            </TouchableOpacity>
          );
        }}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{
              paddingTop: 5,
            }}
          />
        )}
        renderBubble={(props) => (
          <Bubble
            {...props}
            textStyle={{ right: { color: "#000" } }}
            wrapperStyle={{
              left: {
                borderWidth: 1,
                borderColor: "#E4E7E9",
                backgroundColor: "#fff",
              },
              right: {
                borderWidth: 1,
                borderColor: "yellow",
                backgroundColor: "#fff",
              },
            }}
          />
        )}
      />
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: -Constants.statusBarHeight,
  },
});
