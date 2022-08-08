import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./languages/en.json";
import vi from "./languages/vi.json";

const resources = {
  en,
  vi,
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  compatibilityJSON: "v3",
});

export default i18n;
