import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Avatar, Divider } from "@rneui/themed";
import SizedBox from "../components/SizeBox";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
const windowWidth = Dimensions.get("window").width;
import { CheckBox } from "@rneui/themed";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSelector, useDispatch } from "react-redux";
import {
  userSelector,
  clearState,
  editUser,
  uploadAvatar,
} from "../store/features/userSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Moment from "moment";
import StateCallAPI from "../components/StateCallAPI";
import { useTranslation } from "react-i18next";
// import * as Firebase from "firebase";
import { firebaseConfig } from "../../firebase";

const EditProfile = ({ navigation }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const { avatar } = useSelector(userSelector);

  const {
    phoneNumber,
    fullname,
    birthDay,
    isFetching,
    isSuccess,
    isError,
    message,
  } = useSelector(userSelector);
  const [name, setName] = useState(fullname);
  const [gender, setGender] = useState("Male");
  const [dateOfBirth, setDateOfBirth] = useState(new Date(birthDay));
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState(phoneNumber);

  const [checkFullName, setCheckFullName] = useState(false);

  useEffect(() => {
    dispatch(clearState());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
      navigation.goBack();
    }
    if (isError) {
      setTimeout(() => dispatch(clearState()), 5000);
    }
  }, [isSuccess, isError]);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShow(Platform.OS === "ios");
    setDateOfBirth(currentDate);
  };

  const onSubmit = () => {
    if (name.trim()) {
      const editProfileUser = async () => {
        const accessToken = await AsyncStorage.getItem("accessToken");
        dispatch(
          editUser({
            accessToken,
            data: {
              fullname: name.trim(),
              // gender,
              birthDay: dateOfBirth,
              phoneNumber: phone,
            },
          })
        );
      };
      editProfileUser();
    } else {
      setCheckFullName(true);
    }
  };

  const [selectedImage, setSelectedImage] = React.useState(null);

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (pickerResult.cancelled === true) {
      return;
    }

    setSelectedImage(pickerResult.uri);
  };

  // if (!Firebase.apps.length) {
  //   Firebase.initializeApp(firebaseConfig);
  // }

  const uploadImage = async () => {
    // const blob = await new Promise((resolve, reject) => {
    //   const xhr = new XMLHttpRequest();
    //   xhr.onload = function () {
    //     resolve(xhr.response);
    //   };
    //   xhr.onerror = function () {
    //     reject(new TypeError("Network request failed"));
    //   };
    //   xhr.responseType = "blob";
    //   xhr.open("GET", selectedImage, true);
    //   xhr.send(null);
    // });
    // const ref = Firebase.storage().ref().child(new Date().toISOString());
    // const snapshot = ref.put(blob);
    // snapshot.on(
    //   Firebase.storage.TaskEvent.STATE_CHANGED,
    //   () => {
    //     console.log("pending");
    //   },
    //   (error) => {
    //     console.log(error);
    //     blob.close();
    //     return;
    //   },
    //   () => {
    //     snapshot.snapshot.ref.getDownloadURL().then((url) => {
    //       dispatch(uploadAvatar(url));
    //       blob.close();
    //       return url;
    //     });
    //   }
    // );
  };

  // const options ={
  //   title: 'Select Image',
  //   type: 'library',
  //   options:{
  //     maxHeight: 200,
  //     maxWidth: 200,
  //     selectionLimit: 1,
  //     mediaType: 'photo',
  //     includeBase64: false
  //   }
  // }
  // const openImagePickerAsync = async () => {

  //   const images = await launchImageLibrary(options);

  //   const formdata = new FormData();

  //   formdata.append('file', {
  //     uri: images.assets[0].uri,
  //     type: images.assets[0].type,
  //     name: images.assets[0].fileName
  //   })

  //   setSelectedImage(formdata);

  // };

  useEffect(() => {
    if (selectedImage) {
      uploadImage();

      dispatch(uploadAvatar(selectedImage));
      setSelectedImage(null);
    }
  }, [selectedImage]);

  return (
    <ScrollView style={styles.container}>
      <SizedBox height={20} />
      <View style={styles.avatarContainer}>
        <Avatar
          onPress={openImagePickerAsync}
          rounded
          source={{
            uri: avatar,
          }}
          size={100}
        >
          <Avatar.Accessory rounded onPress={openImagePickerAsync} size={25} />
        </Avatar>
      </View>

      <SizedBox height={30} />
      <Text style={styles.title}>{t("Personalinformation")}</Text>

      <SizedBox height={5} />
      <Divider />

      <TouchableOpacity style={styles.row}>
        <Text style={styles.col1}>{t("Fullname")}</Text>
        <TextInput
          animation={true}
          style={[
            styles.col2,
            {
              borderBottomColor: "#000000",
              borderBottomWidth: 1,
              paddingBottom: 0,
            },
          ]}
          value={name}
          onChangeText={(value) => {
            setName(value);
            setCheckFullName(false);
          }}
        />
        <Feather style={styles.icon} name="edit-3" size={18} color={"#000"} />
      </TouchableOpacity>

      <Divider />

      <TouchableOpacity style={styles.row}>
        <Text style={styles.col1}>{t("Gender")}</Text>

        <View style={styles.col2}>
          <CheckBox
            title={t("Male")}
            center
            checked={gender === "Male"}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => setGender("Male")}
            containerStyle={styles.checkbox}
            textStyle={{
              fontWeight: "400",
              color: "#000",
              fontSize: 16,
              marginRight: 0,
              marginLeft: 5,
            }}
          />

          <CheckBox
            title={t("Female")}
            center
            checked={gender === "Female"}
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => setGender("Female")}
            containerStyle={styles.checkbox}
            textStyle={{
              fontWeight: "400",
              color: "#000",
              fontSize: 16,
              marginRight: 0,
              marginLeft: 5,
            }}
          />
        </View>
      </TouchableOpacity>
      <Divider />

      <TouchableOpacity style={styles.row}>
        <Text style={styles.col1}>{t("Dateofbirth")}</Text>
        <Text onPress={() => setShow(true)} style={styles.col2}>
          {Moment(dateOfBirth).format("DD/MM/YYYY")}
        </Text>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dateOfBirth}
            mode="date"
            display="default"
            onChange={onChange}
          />
        )}

        <Feather style={styles.icon} name="edit-3" size={18} color={"#000"} />
      </TouchableOpacity>
      <Divider />

      <TouchableOpacity style={styles.row}>
        <Text style={styles.col1}>{t("Phone")}</Text>
        <TextInput
          style={[
            styles.col2,
            {
              borderBottomColor: "#000000",
              borderBottomWidth: 1,
              paddingBottom: 0,
            },
          ]}
          value={phone}
          onChangeText={(value) => setPhone(value)}
          keyboardType="numeric"
        />
        <Feather style={styles.icon} name="edit-3" size={18} color={"#000"} />
      </TouchableOpacity>
      <Divider />

      {/* {isFetching && <ActivityIndicator size="large" />} */}
      <StateCallAPI
        isFetching={isFetching}
        isError={isError}
        message={message}
        checkFullName={checkFullName}
      />

      {/* <SizedBox height={20} /> */}

      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={onSubmit}
      >
        <View style={styles.edit}>
          <Ionicons name="save" size={24} color={"#fff"} />
          <SizedBox width={5} />
          <Text style={styles.textEdit}>{t("Savechanges")}</Text>
        </View>
      </TouchableHighlight>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 25,
    fontWeight: "700",
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    marginLeft: 10,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    fontSize: 18,
    alignItems: "center",
    minHeight: 50,
  },

  col1: {
    width: 150,
    fontSize: 16,
  },

  col2: {
    fontSize: 16,
    flexDirection: "row",
    width: windowWidth - 200,
  },

  edit: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0084D0",
    // padding: 12,
    borderRadius: 50,
    height: 40,
    marginHorizontal: 15,
  },

  textEdit: {
    color: "#fff",
    fontSize: 16,
  },

  editLogout: {
    backgroundColor: "#3C3F41",
  },
  icon: {
    position: "absolute",
    top: 18,
    right: 15,
  },
  textDanger: {
    color: "#dc3545",
    textAlign: "center",
  },
  checkbox: {
    padding: 0,
    margin: 0,
    // width: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
    marginLeft: 10,
  },
});
