import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Controller, useForm, FormProvider } from "react-hook-form";
import { FontAwesome5 } from "@expo/vector-icons";
import SizedBox from "../components/SizeBox";

import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import styles from "../utils/theme/FormStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  changePassword,
  clearState,
  forgotPassword,
  passwordSelector,
} from "../store/features/passwordSlice";
import { useTranslation } from "react-i18next";

const ChangePassword = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  const resetPasswordSchema = object({
    oldPassword: string()
      .nonempty(t("Passwordisrequired"))
      .min(8, t("Passwordmustbemorethan8characters"))
      .max(32, t("Passwordmustbelessthan32characters")),
    newPassword: string()
      .nonempty(t("Passwordisrequired"))
      .min(8, t("Passwordmustbemorethan8characters"))
      .max(32, t("Passwordmustbelessthan32characters")),
    confirmPassword: string().nonempty(t("Pleaseconfirmyourpassword")),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: t("Passwordsdonotmatch"),
  });

  const methods = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isFetching, isSuccess, isError, message } =
    useSelector(passwordSelector);

  useEffect(() => {
    if (isError) {
      setTimeout(() => dispatch(clearState()), 3000);
      methods.reset();
    }

    if (isSuccess) {
      dispatch(clearState());
      navigation.reset({
        index: 0,
        routes: [{ name: "ChatList" }],
      });
      methods.reset();
    }
  }, [isError, isSuccess]);

  const onSubmit = methods.handleSubmit((data) => {
    dispatch(changePassword({ data }));
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <Text style={styles.title}>{t("Changepassword")}</Text>

            <SizedBox height={40} />
            <FormProvider {...methods}>
              <FormInput
                label={t("Oldpassword")}
                name={"oldPassword"}
                placeholder={t("Oldpassword")}
                secureTextEntry
                returnKeyType="next"
                autoFocus
              />

              <SizedBox height={50} />

              <FormInput
                label={t("Newpassword")}
                name={"newPassword"}
                placeholder={t("Newpassword")}
                secureTextEntry
                returnKeyType="next"
                autoFocus
              />

              <SizedBox height={50} />

              <FormInput
                label={t("Confirmpassword")}
                name={"confirmPassword"}
                placeholder={t("Confirmpassword")}
                secureTextEntry
                returnKeyType="done"
              />

              <SizedBox height={20} />
              {isFetching && <ActivityIndicator size="large" />}
              {isError && <Text style={styles.textDanger}>{message}</Text>}
              <SizedBox height={20} />

              <TouchableOpacity onPress={onSubmit}>
                <View style={styles.button}>
                  <Text style={styles.buttonTitle}>{t("Submit")}</Text>
                </View>
              </TouchableOpacity>
            </FormProvider>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChangePassword;
