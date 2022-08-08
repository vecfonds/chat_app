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
import {
  loginUser,
  authenticationSelector,
  clearState,
} from "../store/features/authenticationSlice";
import { useSelector, useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import FormInput from "../components/FormInput";
import styles from "../utils/theme/FormStyles";
import StateCallAPI from "../components/StateCallAPI";
import { StackActions } from "@react-navigation/native";
import { colors } from "../utils/theme/colors";
import { useTranslation } from "react-i18next";

const Login = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const loginSchema = object({
    email: string()
      .trim()
      .nonempty(t("Emailisrequired"))
      .email(t("Emailisinvalid")),
    password: string()
      .nonempty(t("Passwordisrequired"))
      .min(8, t("Passwordmustbemorethan8characters"))
      .max(32, t("Passwordmustbelessthan32characters")),
  });

  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isFetching, isSuccess, isError, message } = useSelector(
    authenticationSelector
  );

  const onSubmit = methods.handleSubmit((data) => {
    dispatch(loginUser(data));
  });

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isError) {
      setTimeout(() => dispatch(clearState()), 5000);
      methods.reset();
    }

    if (isSuccess) {
      dispatch(clearState());
      navigation.dispatch(StackActions.replace("ChatList"));
      methods.reset();
    }
  }, [isError, isSuccess]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <Text style={styles.title}>{t("Welcome")}</Text>

            <SizedBox height={40} />
            <FormProvider {...methods}>
              <FormInput
                label={t("Emailaddress")}
                name={"email"}
                placeholder={t("Email")}
                returnKeyType="next"
                autoComplete="email"
              />

              <SizedBox height={50} />

              <FormInput
                label={t("Password")}
                name={"password"}
                placeholder={t("Password")}
                secureTextEntry
                returnKeyType="done"
              />

              <View style={styles.forgotPasswordContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Forgot Password")}
                >
                  <Text style={styles.textButton}>{t("Forgotpassword?")}</Text>
                </TouchableOpacity>
              </View>

              <StateCallAPI
                isFetching={isFetching}
                isError={isError}
                message={message}
              />

              <TouchableOpacity onPress={onSubmit}>
                <View style={styles.button}>
                  <Text style={styles.buttonTitle}>{t("Login")}</Text>
                </View>
              </TouchableOpacity>

              <SizedBox height={15} />

              <View style={{ width: "100%", alignItems: "center" }}>
                <View
                  style={{
                    flexDirection: "row",
                    width: "50%",
                  }}
                >
                  <View style={styles.line}></View>
                  <Text style={{ width: 60, textAlign: "center" }}>
                    {" "}
                    {t("OR")}{" "}
                  </Text>
                  <View style={styles.line}></View>
                </View>
              </View>
              <SizedBox height={15} />

              <View style={styles.question}>
                <Text>{t("Don'thaveanaccount?")} </Text>

                <Text
                  onPress={() => navigation.navigate("SignUp")}
                  style={{ color: colors.blue }}
                >
                  {t("Signup")}
                </Text>
              </View>
            </FormProvider>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
