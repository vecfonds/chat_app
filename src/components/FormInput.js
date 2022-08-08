import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Controller, useFormContext } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/theme/colors";

const FormInput = ({ label, name, secureTextEntry, ...otherProps }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [passwordVisible, setPasswordVisible] = useState(secureTextEntry);

  return (
    <>
      <View style={styles.form}>
        <Text style={styles.label}>{label}</Text>

        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              style={styles.textInput}
              onChangeText={(value) => onChange(value)}
              {...otherProps}
              secureTextEntry={passwordVisible}
            />
          )}
        />
        <View>
          {name.toLowerCase().indexOf("password") !== -1 && (
            <Ionicons
              style={styles.icon}
              size={24}
              color={colors.borderGray}
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              onPress={() => {
                setPasswordVisible(!passwordVisible);
              }}
            />
          )}
        </View>
      </View>
      {errors[name] && (
        <Text style={styles.textDanger}>{errors[name].message}</Text>
      )}
    </>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  form: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 8,
    flexDirection: "row",
    height: 48,
    borderColor: colors.borderGray,
    borderWidth: 1,
  },

  label: {
    position: "absolute",
    color: colors.borderGray,
    top: -30,
    left: 0,
  },

  icon: {
    position: "absolute",
    right: 10,
    top: -11,
  },

  textInput: {
    color: colors.black,
    flex: 1,
    paddingLeft: 15,
  },

  textDanger: {
    color: colors.danger,
  },
});
