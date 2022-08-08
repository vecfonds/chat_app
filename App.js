import { StatusBar } from "expo-status-bar";
import Navigation from "./src/navigation";
import { Provider } from "react-redux";
import store from "./src/store/store";
import { AppContext, socket } from "./src/context/appContext";
import "./i18n.config";

export default function App() {
  return (
    <AppContext.Provider value={{ socket }}>
      <Provider store={store}>
        <Navigation />
        <StatusBar style="auto" />
      </Provider>
    </AppContext.Provider>
  );
}
