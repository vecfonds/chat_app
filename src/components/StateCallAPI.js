import { ActivityIndicator, StyleSheet, Text } from "react-native";
import React from "react";
import SizedBox from "./SizeBox";
import { AntDesign } from '@expo/vector-icons';
import { colors } from "../utils/theme/colors";

const StateCallAPI = ({ isFetching, isSuccess, isError, message, checkFullName }) => {
  return (
    <>
      <SizedBox height={20} />
      {isFetching && <ActivityIndicator size="large" />}
      {isSuccess && <Text style={styles.textSuccess}>Sign up success <AntDesign name="check" size={16} color={colors.blue} /></Text>}
      {isError && <Text style={styles.textDanger}>{message}</Text>}

      {checkFullName && (
        <Text style={styles.textDanger}>Full name is required</Text>
      )}

      <SizedBox height={20} />
    </>
  );
};

export default StateCallAPI;

const styles = StyleSheet.create({
  textDanger: {
    color: colors.danger,
    textAlign: "center",
  },
  textSuccess:{
    color: colors.blue,
    textAlign: "center"
  }
});
