import { Avatar, Badge, Icon, withBadge } from "@rneui/themed";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/appContext";

const ActivitySlider = () => {
  const [data, setData] = useState([]);
  const { socket } = useContext(AppContext);

  useEffect(() => {
    socket.on("get-onlineUser", (data) => {
      // console.log("kay .............................");
      // console.log(data);
      setData(data);
    });
  }, [socket]);

  const renderItem = ({ item }) => (
    <View style={styles.userIconContainer}>
      {/* <Avatar
        rounded
        source={{ uri: "https://randomuser.me/api/portraits/men/41.jpg" }}
        size="medium"
      />
      <Badge
        status="success"
        containerStyle={{ position: "absolute", bottom: 25, left: 40 }}
      />
      <Avatar.Accessory size={15} /> */}
      <Avatar
        size={60}
        rounded
        source={{ uri: item.avatar }}
        title="Activity"
        containerStyle={{ backgroundColor: "grey" }}
      >
        <Badge
          value=" "
          status="success"
          containerStyle={{ position: "absolute", bottom: 0, right: 2 }}
        />
      </Avatar>
      <Text style={styles.userName}>{item.name}</Text>
    </View>
  );
  return (
    <View style={{ backgroundColor: "#FFF", paddingVertical: data ? 0 : 15 }}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        horizontal
        data={data}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ActivitySlider;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingVertical: 15,
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
});
