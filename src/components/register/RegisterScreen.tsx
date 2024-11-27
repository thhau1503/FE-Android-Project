import React, { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AntDesign,
  EvilIcons,
  Feather,
  FontAwesome,
  Fontisto,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const RegisterScreen = ({ navigation }: any) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const [isAgreeTerms, setIsAgreeTerms] = useState(false);
  const [selectImage, setSelectImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbzwf4BLLOYmioPDykqjFiyJ9Nk1jFscdf7A&s"
  );

  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [errorUserName, setErrorUserName] = useState<string>("");
  const [errorEmail, setErrorEmail] = useState<string>("");
  const [errorPassword, setErrorPassword] = useState<string>("");
  const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>("");
  const [errorAddress, setErrorAddress] = useState<string>("");
  const [errorPhone, setErrorPhone] = useState<string>("");
  const [errorIsAgreeTerms, setErrorIsAgreeTerms] = useState<string>("");

  const handleSignUp = async () => {
    let formData = {
      _userName: userName,
      _email: email,
      _password: password,
      _confirmPassword: confirmPassword,
      _address: address,
      _phone: phone,
      _isAgreeTerms: isAgreeTerms,
    };
    let regexEmail = new RegExp(
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
    );
    if (regexEmail.test(formData._email)) {
      setErrorEmail("");
    } else {
      setErrorEmail("Invalid email");
    }
    formData._password === ""
      ? setErrorPassword("Invalid password")
      : setErrorPassword("");
    formData._confirmPassword === ""
      ? setErrorConfirmPassword("Invalid confirm password")
      : setErrorConfirmPassword("");

    formData._phone === ""
      ? setErrorPhone("Invalid phone number")
      : setErrorPhone("");

    formData._userName === ""
      ? setErrorUserName("Invalid userName")
      : setErrorUserName("");

    formData._address === ""
      ? setErrorAddress("Invalid address")
      : setErrorAddress("");

    formData._isAgreeTerms === false
      ? setErrorIsAgreeTerms("You must agree the terms and conditions")
      : setErrorIsAgreeTerms("");

    if (formData._phone.length !== 10) {
      setErrorPhone("Invalid phone number");
    }

    if (formData._password.length < 6) {
      setErrorPassword("Password must be at least 6 characters");
      setErrorConfirmPassword("Password must be at least 6 characters");
    }

    if (formData._password !== formData._confirmPassword) {
      setErrorConfirmPassword("Password is incorrect");
    }
    console.log(formData);
    let apiData = {
      username: formData._userName,
      email: formData._email,
      password: formData._password,
      phone: formData._phone,
      address: formData._address,
    };
    try {
      const response = await axios.post(
        "https://be-android-project.onrender.com/api/auth/register",
        apiData
      );
      if (response.status === 200 || response.status === 201) {
        Alert.alert(
          "Success",
          "Register successful! Redirecting to OTP screen..."
        );

        navigation.navigate("otpVerification", { email: email });
      }
    } catch (error) {
      // Handle errors
      if (axios.isAxiosError(error)) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Registration failed"
        );
      } else {
        Alert.alert("Error", "An unknown error occurred");
      }
    }
  };

  const handleImageSelection = async () => {
    let result = ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    console.log(result);
    if (!(await result).canceled) {
      setSelectImage((await result).assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ marginTop: 30, alignItems: "center" }}>
          <Text style={{ fontWeight: "bold", fontSize: 30, color: "black" }}>
            Register
          </Text>
          <Text>By signing up your are agreeing</Text>
          <View style={{ flexDirection: "row" }}>
            <Text>our</Text>
            <TouchableOpacity onPress={() => Alert.alert("changing form")}>
              <Text style={{ color: "#1bcdff" }}>Term and privacy policy</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flex: 1, marginHorizontal: 22 }}>
          <View style={{ alignItems: "center", marginVertical: 22 }}>
            <TouchableOpacity onPress={() => handleImageSelection()}>
              <Image
                source={{ uri: selectImage }}
                style={{
                  height: 170,
                  width: 170,
                  borderRadius: 999,
                  borderWidth: 2,
                  borderColor: "#2775b6",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 10,
                  zIndex: 9999,
                }}
              >
                <MaterialIcons name="photo-camera" size={32} color={"black"} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 8,
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <SimpleLineIcons name="user" size={24} color="black" />
              <Text style={{ fontSize: 16, fontWeight: 400, marginLeft: 5 }}>
                Username
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: 48,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22,
              }}
            >
              <TextInput
                placeholder="Enter your userName"
                placeholderTextColor={"black"}
                keyboardType="default"
                style={{ width: "100%" }}
                onChangeText={(value) => setUserName(value)}
              />
            </View>
            <Text style={{ color: "red", marginTop: 1, fontSize: 10 }}>
              {errorUserName}
            </Text>
          </View>
          <View style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 8,
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Fontisto name="email" size={24} color="black" />
              <Text style={{ fontSize: 16, fontWeight: 400, marginLeft: 5 }}>
                Email Address
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: 48,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22,
              }}
            >
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={"black"}
                keyboardType="email-address"
                style={{ width: "100%" }}
                onChangeText={(value) => setEmail(value)}
              />
            </View>
            <Text style={{ color: "red", marginTop: 1, fontSize: 10 }}>
              {errorEmail}
            </Text>
          </View>
          <View style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 8,
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <SimpleLineIcons name="location-pin" size={24} color="black" />
              <Text style={{ fontSize: 16, fontWeight: 400, marginLeft: 5 }}>
                Address
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: 48,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 22,
              }}
            >
              <TextInput
                placeholder="Enter your address"
                placeholderTextColor={"black"}
                keyboardType="email-address"
                style={{ width: "100%" }}
                onChangeText={(value) => setAddress(value)}
              />
            </View>
            <Text style={{ color: "red", marginTop: 1, fontSize: 10 }}>
              {errorAddress}
            </Text>
          </View>
          <View style={{ marginBottom: 12 }}>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 8,
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <Feather name="phone" size={24} color="black" />
              <Text
                style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}
              >
                Mobile Number
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                height: 48,
                borderColor: "black",
                borderWidth: 1,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "space-between",
                flexDirection: "row",
                paddingLeft: 22,
              }}
            >
              <TextInput
                placeholder="+84"
                placeholderTextColor={"black"}
                keyboardType="numeric"
                editable={false}
                style={{
                  width: "12%",
                  borderRightWidth: 1,
                  borderLeftColor: "grey",
                  height: "100%",
                }}
              />
              <TextInput
                placeholder="Enter your phone number"
                placeholderTextColor={"black"}
                keyboardType="numeric"
                style={{ width: "80%" }}
                onChangeText={(value) => setPhone(value)}
              />
            </View>
            <Text style={{ color: "red", marginTop: 1, fontSize: 10 }}>
              {errorPhone}
            </Text>

            <View style={{ marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 8,
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <MaterialIcons name="password" size={24} color="black" />
                <Text
                  style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}
                >
                  Password
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={"black"}
                  secureTextEntry={!isPasswordShown}
                  style={{ width: "100%" }}
                  onChangeText={(value) => setPassword(value)}
                />
                <TouchableOpacity
                  style={{ position: "absolute", right: 12 }}
                  onPress={() => {
                    setIsPasswordShown(!isPasswordShown);
                  }}
                >
                  {isPasswordShown === true ? (
                    <Ionicons name="eye" size={24} color={"black"} />
                  ) : (
                    <Ionicons name="eye-off" size={24} color={"black"} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={{ color: "red", marginTop: 1, fontSize: 10 }}>
                {errorPassword}
              </Text>
            </View>
            <View style={{ marginBottom: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 8,
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <MaterialIcons name="password" size={24} color="black" />
                <Text
                  style={{ fontSize: 16, fontWeight: 400, marginVertical: 8 }}
                >
                  Confirm Password
                </Text>
              </View>
              <View
                style={{
                  width: "100%",
                  height: 48,
                  borderColor: "black",
                  borderWidth: 1,
                  borderRadius: 8,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: 22,
                }}
              >
                <TextInput
                  placeholder="Enter your password"
                  placeholderTextColor={"black"}
                  secureTextEntry={!isConfirmPasswordShown}
                  style={{ width: "100%" }}
                  onChangeText={(value) => setConfirmPassword(value)}
                />
                <TouchableOpacity
                  style={{ position: "absolute", right: 12 }}
                  onPress={() => {
                    setIsConfirmPasswordShown(!isConfirmPasswordShown);
                  }}
                >
                  {isConfirmPasswordShown === true ? (
                    <Ionicons name="eye" size={24} color={"black"} />
                  ) : (
                    <Ionicons name="eye-off" size={24} color={"black"} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{ color: "red", marginTop: 1, fontSize: 10 }}>
              {errorConfirmPassword}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginVertical: 6 }}>
            <Checkbox
              style={{ marginRight: 8 }}
              value={isAgreeTerms}
              onValueChange={setIsAgreeTerms}
              color={isAgreeTerms ? "#1174a2" : undefined}
            />
            <Text> I agree to the terms and conditions</Text>
          </View>
          <Text style={{ color: "red", marginTop: 1, fontSize: 10 }}>
            {errorIsAgreeTerms}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 30,
              backgroundColor: "#1174a2",
              paddingVertical: 15,
              alignItems: "center",
              borderRadius: 10,
            }}
            onPress={() => handleSignUp()}
          >
            <Text style={{ color: "#fff", fontWeight: "bold" }}>Sign Up</Text>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginVertical: 22,
            }}
          >
            <Text style={{ fontSize: 16, color: "black" }}>
              Already have an account
            </Text>
            <Pressable
              onPress={() => {
                navigation.navigate("login");
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#0a0a48",
                  marginLeft: 6,
                }}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
