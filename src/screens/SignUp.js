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
import { useSelector, useDispatch } from "react-redux";
import {
  signupUser,
  authenticationSelector,
  clearState,
} from "../store/features/authenticationSlice";
import { object, string } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "../components/FormInput";
import styles from "../utils/theme/FormStyles";
import StateCallAPI from "../components/StateCallAPI";
import { colors } from "../utils/theme/colors";
import { useTranslation } from "react-i18next";

const SignUp = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const signupSchema = object({
    fullname: string().trim().nonempty(t("Nameisrequired")).max(70),
    email: string()
      .trim()
      .nonempty(t("Emailisrequired"))
      .email(t("Emailisinvalid")),
    password: string()
      .nonempty(t("Passwordisrequired"))
      .min(8, t("Passwordmustbemorethan8characters"))
      .max(32, t("Passwordmustbelessthan32characters")),
    passwordConfirm: string().nonempty(t("Pleaseconfirmyourpassword")),
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: t("Passwordsdonotmatch"),
  });

  const methods = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const { isFetching, isSuccess, isError, message } = useSelector(
    authenticationSelector
  );

  const onSubmit = methods.handleSubmit((data) => {
    dispatch(signupUser(data));
  });

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
      navigation.navigate("Login");
      methods.reset();
    }
    if (isError) {
      setTimeout(() => dispatch(clearState()), 5000);
      methods.reset();
    }
  }, [isSuccess, isError]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.root}>
        <SafeAreaView style={styles.safeAreaView}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.content}
          >
            <Text style={styles.title}>{t("Signup")}</Text>

            <SizedBox height={40} />
            <FormProvider {...methods}>
              <FormInput
                label={t("Fullname")}
                name={"fullname"}
                placeholder={t("Fullname")}
                returnKeyType="next"
                autoComplete="name"
              />

              <SizedBox height={50} />

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
                returnKeyType="next"
              />

              <SizedBox height={50} />

              <FormInput
                label={t("Confirmpassword")}
                name={"passwordConfirm"}
                placeholder={t("Confirmpassword")}
                secureTextEntry
                returnKeyType="done"
              />

              <StateCallAPI
                isFetching={isFetching}
                isError={isError}
                isSuccess={isSuccess}
                message={message}
              />

              <TouchableOpacity onPress={onSubmit}>
                <View style={styles.button}>
                  <Text style={styles.buttonTitle}>{t("Submit")}</Text>
                </View>
              </TouchableOpacity>
            </FormProvider>

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
              <Text>{t("Haveanaccount?")} </Text>

              <Text
                onPress={() => navigation.goBack()}
                style={{ color: colors.blue }}
              >
                {t("Login")}
              </Text>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
