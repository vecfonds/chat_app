import React, { useEffect } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useForm, FormProvider } from "react-hook-form";
import SizedBox from "../components/SizeBox";
import { object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import styles from "../utils/theme/FormStyles";
import { useSelector, useDispatch } from "react-redux";
import {
  clearState,
  resetPassword,
  passwordSelector,
} from "../store/features/passwordSlice";
import StateCallAPI from "../components/StateCallAPI";
import { useTranslation } from "react-i18next";

const ResetPassword = ({ navigation }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const resetPasswordSchema = object({
    newPassword: string()
      .nonempty("Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
    newPasswordConfirm: string().nonempty("Please confirm your password"),
  }).refine((data) => data.newPassword === data.newPasswordConfirm, {
    path: ["newPasswordConfirm"],
    message: "Passwords do not match",
  });

  const methods = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      newPasswordConfirm: "",
    },
  });

  const { isFetching, isSuccess, isError, message } =
    useSelector(passwordSelector);

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isError) {
      dispatch(clearState());
    }

    if (isSuccess) {
      dispatch(clearState());
      navigation.navigate("Login");
    }
    methods.reset();
  }, [isError, isSuccess]);

  const onSubmit = methods.handleSubmit((data) => {
    dispatch(resetPassword({ password: data.newPassword }));
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <Text style={styles.title}>{t("ResetPassword")}</Text>

            <SizedBox height={40} />
            <FormProvider {...methods}>
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
                name={"newPasswordConfirm"}
                placeholder={t("Confirmpassword")}
                secureTextEntry
                returnKeyType="done"
              />

              <StateCallAPI
                isFetching={isFetching}
                isError={isError}
                message={message}
              />

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

export default ResetPassword;
