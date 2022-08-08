import React, { useEffect } from "react";
import {
  ActivityIndicator,
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
  forgotPassword,
  passwordSelector,
} from "../store/features/passwordSlice";
import StateCallAPI from "../components/StateCallAPI";
import { useTranslation } from "react-i18next";

const ForgotPassword = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();

  const forgotPasswordSchema = object({
    email: string().nonempty(t("Emailisrequired")).email(t("Emailisinvalid")),
  });

  const methods = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
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
      setTimeout(() => dispatch(clearState()), 5000);
    }
    if (isSuccess) {
      dispatch(clearState());
      navigation.navigate("ResetPassword");
    }
    methods.reset();
  }, [isError, isSuccess]);

  const onSubmit = methods.handleSubmit((data) => {
    dispatch(forgotPassword(data));
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <Text style={styles.title}>{t("ForgotPassword")}</Text>

            <SizedBox height={40} />
            <FormProvider {...methods}>
              <FormInput
                label={t("Emailaddress")}
                name={"email"}
                placeholder={t("Email")}
                returnKeyType="done"
                autoFocus
                autoComplete="email"
              />

              <StateCallAPI
                isFetching={isFetching}
                isError={isError}
                message={message}
              />
              {/* 
              <SizedBox height={20} />
              {isFetching && <ActivityIndicator size="large" />}
              {isError && <Text style={styles.textDanger}>{message}</Text>}
              <SizedBox height={20} /> */}

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

export default ForgotPassword;
