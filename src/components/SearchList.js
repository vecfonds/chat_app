import { Avatar, ListItem } from "@rneui/base";
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
} from "react-native";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
import { CheckBox } from "@rneui/themed";
import SizedBox from "../components/SizeBox";
import { colors } from "../utils/theme/colors";

const SearchList = ({
  state,
  selected,
  handleSelected,
  typeCheckbox,
}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {state.dataSource.map((item) => (
        <ListItem
          key={item._id}
          Component={TouchableHighlight}
          containerStyle={{
            paddingVertical: 10,
            paddingHorizontal: 15,
          }}
          onPress={() => handleSelected(item)}
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

          {typeCheckbox ? (
            <View
              style={{
                flexDirection: "row",
                width: windowWidth - 85,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                numberOfLines={1}
                ellipsizeMode={"tail"}
                style={{ width: windowWidth - 125 }}
              >
                {item.fullname}
              </Text>

              <SizedBox width={15} />

              <CheckBox
                center
                checked={
                  selected.filter((i) => i.fullname === item.fullname).length
                }
                checkedColor={colors.blue}
                onPress={() => handleSelected(item)}
                containerStyle={styles.checkbox}
              />
            </View>
          ) : (
            <View
              style={{
                width: windowWidth - 85,
              }}
            >
              <Text numberOfLines={1} ellipsizeMode={"tail"}>
                {item.fullname}
              </Text>
            </View>
          )}
        </ListItem>
      ))}
    </ScrollView>
  );
};

export default SearchList;

const styles = StyleSheet.create({
  checkbox: {
    padding: 0,
    margin: 0,
    width: 0,
  },
});
