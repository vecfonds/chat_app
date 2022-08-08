import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ChatList from "../screens/ChatList";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Profile from "../screens/Profile";
import EditProfile from "../screens/EditProfile";
import ForgotPassword from "../screens/ForgotPassword";
import ResetPassword from "../screens/ResetPassword";
import ChangePassword from "../screens/ChangePassword";
import ChatRoom from "../screens/ChatRoom";
import CreateChatGroup from "../screens/CreateChatGroup";
import SearchScreen from "../screens/SearchScreen";
import AddMembers from "../screens/AddMembers";
import InfoChatRoom from "../screens/InfoChatRoom";
import { useTranslation } from "react-i18next";
import Language from "../screens/Language";

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { t, i18n } = useTranslation();
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Forgot Password"
        component={ForgotPassword}
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{
          headerTitle: "",
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitleAlign: "center",
          headerTitle: `${t("Profile")}`,
        }}
      />
      <Stack.Screen
        name="Edit Profile"
        component={EditProfile}
        options={{
          headerTitleAlign: "center",
          headerTitle: `${t("EditProfile")}`,
        }}
      />
      <Stack.Screen
        name="ChatList"
        component={ChatList}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          headerBackTitleStyle: {
            color: "#FFF",
          },
          headerBackVisible: false,
        }}
      />

      <Stack.Screen
        name="InfoChatRoom"
        component={InfoChatRoom}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Create Chat Group"
        component={CreateChatGroup}
        options={{
          headerTitleAlign: "center",
          headerTitle: `${t("CreateChatGroup")}`,
        }}
      />

      <Stack.Screen
        name="AddMembers"
        component={AddMembers}
        options={{
          headerTitleAlign: "center",
          headerTitle: `${t("Addmembers")}`,
        }}
      />

      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Language"
        component={Language}
        options={{
          headerTitleAlign: "center",
          headerTitle: `${t("Language")}`,
        }}
      />
    </Stack.Navigator>
  );
}
