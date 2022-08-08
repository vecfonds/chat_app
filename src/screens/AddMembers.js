import { SearchBar } from "@rneui/base";
import React, { useContext, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
import Constants from "expo-constants";
import { Badge, CheckBox, Divider } from "@rneui/themed";
import { useSelector, useDispatch } from "react-redux";
import { allUsersSelector, clearState } from "../store/features/allUsersSlice";
import StateCallAPI from "../components/StateCallAPI";
import { AppContext } from "../context/appContext";
import { addMemberGroup, userSelector } from "../store/features/userSlice";
import SizedBox from "../components/SizeBox";
import { colors } from "../utils/theme/colors";
import SearchList from "../components/SearchList";
import AvatarSlider from "../components/AvatarSlider";
import { useTranslation } from "react-i18next";

const AddMembers = ({ navigation, route }) => {
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
    const members = chatgroups
      .filter((i) => i._id === route.params.roomId)[0]
      .members.map((i) => i._id);
    const data = allUsers.filter((user) => !members.includes(user._id));
    setState((prev) => {
      return {
        ...prev,
        dataSource: [...data],
      };
    });
    setArrayholder([...data]);
  }, []);

  const [selected, setSelected] = useState([]);

  function handleCancel(select) {
    if (select._id !== _id) {
      setSelected((prev) => prev.filter((item) => item !== select));
    }
  }

  function handleSelected(select) {
    if (select._id !== _id) {
      if (selected.includes(select)) {
        setSelected((prev) => prev.filter((item) => item !== select));
      } else {
        setSelected((prev) => [select, ...prev]);
      }
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

  const onSubmit = (data) => {
    data = {
      groupId: route.params.roomId,
      userId: selected.map((item) => item._id),
    };

    dispatch(addMemberGroup(data));
  };

  useEffect(() => {
    if (isSuccess) {
      navigation.goBack();
      dispatch(clearState());
    }
  }, [isSuccess]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
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
        <View style={styles.containerFlatList}>
          <AvatarSlider selected={selected} handleCancel={handleCancel} />
        </View>

        <SizedBox height={5} />

        {isError && <StateCallAPI isError={isError} message={message} />}

        <SearchList
          state={state}
          selected={selected}
          handleSelected={handleSelected}
          typeCheckbox
        />

        <SizedBox height={30} />

        <View style={{ paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={onSubmit}>
            <View style={styles.button}>
              <Text style={styles.buttonTitle}>{t("Add")}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <SizedBox height={50} />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AddMembers;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
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
});
