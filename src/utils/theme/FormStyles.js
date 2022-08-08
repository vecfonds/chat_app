import { StyleSheet } from "react-native";
import { colors } from "./colors";

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.white,
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 32,
  },
  title: {
    color: "#000000",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
  },
  textButton: {
    color: "#0B69FF",
    fontSize: 15,
    fontWeight: "400",
  },
  button: {
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
  },
  buttonTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "600",
  },
  line: {
    flex: 1,
    borderColor: "#929292",
    height: 1,
    alignSelf: "center",
    borderTopWidth: 1,
  },
  question: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default styles;
