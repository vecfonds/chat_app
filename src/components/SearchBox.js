import React from "react";
import { SearchBar } from "@rneui/themed";
import {
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useTranslation } from "react-i18next";

const SearchBox = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("SearchScreen")}
      style={styles.view}
    >
      <SearchBar
        searchIcon={{ size: 24, marginLeft: 5 }}
        placeholder={t("Search")}
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainerStyle}
        labelStyle={{ fontSize: 10 }}
        disabled
      />
    </TouchableOpacity>
  );
};

export default SearchBox;

const styles = StyleSheet.create({
  view: {
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
});
