import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";
import { CheckBox } from "@rneui/themed";
import SizedBox from "../components/SizeBox";

const Language = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  const languages = [
    { name: "en", label: "English" },
    { name: "vi", label: "Việt Nam" },
  ];

  const LanguageItem = ({ name, label }) => (
    <CheckBox
      title={label}
      center
      checked={language === name}
      checkedIcon="dot-circle-o"
      uncheckedIcon="circle-o"
      onPress={() => {
        i18n.changeLanguage(name);
        setLanguage(name);
      }}
      textStyle={{
        fontWeight: "400",
        color: "#000",
        fontSize: 16,
        marginRight: 0,
        marginLeft: 5,
      }}
      containerStyle={{
        alignItems: "flex-start",
        marginVertical: 0,
      }}
    />
  );

  return (
    <View style={styles.container}>
      <SizedBox height={5} />
      {languages.map((lang) => (
        <LanguageItem {...lang} key={lang.name} />
      ))}
    </View>
  );
};

export default Language;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
});
