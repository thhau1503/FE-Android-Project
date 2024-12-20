import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Image,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { NavigationProp } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Fontisto";
import CheckBox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  navigation: NavigationProp<any>;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [isCheck, setIsCheck] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [checkEmail, setCheckEmail] = useState(true);
  const [errorrPassword, setErrorrPassword] = useState("");

  const setValueChange = () => {
    setIsCheck(!isCheck);
    Alert.alert("check ok!");
  };

  const handleLogin = async () => {
    setLoading(true);
  
    try {
      const response = await axios.post(
        "https://be-android-project.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
  
      // Lưu token, role và id vào AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user_role", user.user_role);
      await AsyncStorage.setItem("user_id", user.id);
  
      // Điều hướng dựa vào role
      if (user.user_role === "Renter") {
        navigation.navigate("renterTab");
      } else if (user.user_role === "User") {
        navigation.navigate("userTab");
      } else {
        Alert.alert("Invalid Role", "Your role is not supported.");
      }
  
      Alert.alert("Login Successful", `Welcome ${user.username}`);
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.response?.data?.msg || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"}></StatusBar>
      <View style={styles.title}>
        <Text style={{ fontWeight: "bold", fontSize: 30, color: "black" }}>
          LOGIN
        </Text>
        <Text>By signing in your are agreeing</Text>
        <View style={{ flexDirection: "row" }}>
          <Text>our</Text>
          <TouchableOpacity onPress={() => Alert.alert("changing form!")}>
            <Text style={{ color: "#1bcdff" }}>Term and privacy policy</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.form}>
        <View style={styles.group}>
          <Icon name="email" style={styles.icon} />
          <TextInput
            placeholder="Email Address"
            style={styles.ip}
            onChangeText={(value) => setEmail(value)}
          ></TextInput>
          <Text style={{ color: "red", marginTop: 10, fontSize: 11 }}>
            {!checkEmail ? "Invalid email" : ""}
          </Text>
        </View>
        <View style={styles.group}>
          <Icon name="locked" style={styles.icon} />
          <View>
            <TextInput
              secureTextEntry={!isShowPassword}
              placeholder="Password"
              style={styles.ip}
              onChangeText={(value) => setPassword(value)}
            ></TextInput>
            <TouchableOpacity
              style={{ position: "absolute", right: 10, top: 10 }}
              onPress={() => {
                setIsShowPassword(!isShowPassword);
              }}
            >
              {isShowPassword === true ? (
                <Ionicons name="eye" size={24} color={"black"} />
              ) : (
                <Ionicons name="eye-off" size={24} color={"black"} />
              )}
            </TouchableOpacity>
          </View>
          <Text style={{ color: "red", marginTop: 10, fontSize: 10 }}>
            {errorrPassword}
          </Text>
        </View>
        <View style={styles.groupCheck}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <CheckBox
              disabled={false}
              value={isCheck}
              onValueChange={() => setValueChange()}
              color={isCheck ? "red" : undefined}
            ></CheckBox>
            <Text style={{ marginLeft: 5 }}>Remember password</Text>
          </View>

          <View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={{ color: "#1bcdff" }}>Forgot password</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => handleLogin()}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Login</Text>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 5,
          }}
        >
          <Text style={{ fontSize: 16, color: "black" }}>
            Don't have an account
          </Text>
          <Pressable
            onPress={() => {
              navigation.navigate("register");
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
              Register
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 5,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "grey",
              marginHorizontal: 10,
            }}
          ></View>
          <Text style={{ fontSize: 14 }}>Or Sign up with</Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "grey",
              marginHorizontal: 10,
            }}
          ></View>
        </View>

        <View style={styles.linkApps}>
          <View style={styles.linkAppsItems}>
            <Image source={require("../../../assets/images/facebook 1.png")} />
          </View>
          <View style={styles.linkAppsItems}>
            <Image source={require("../../../assets/images/instagram 1.png")} />
          </View>
          <View style={styles.linkAppsItems}>
            <Image source={require("../../../assets/images/pinterest 1.png")} />
          </View>
        </View>
      </View>
      <View>
        <Image
          source={require("../../../assets/images/Subtract.png")}
          style={{ width: "100%" }}
        ></Image>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between", // Adjusts the content positioning
  },
  main: {
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    marginTop: 30,
    alignItems: "center",
  },
  form: { marginTop: 30, paddingHorizontal: 30 },
  group: { marginTop: 30 },
  ip: {
    borderBottomWidth: 1,
    backgroundColor: "#fff",
    borderColor: "gray",
    paddingLeft: 35,
    top: 10,
  },
  icon: {
    fontSize: 25,
    position: "absolute",
    top: 10,
    zIndex: 1000,
  },
  groupCheck: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btn: {
    marginTop: 30,
    backgroundColor: "#1bcdff",
    paddingVertical: 15,
    alignItems: "center",
    borderRadius: 10,
  },
  linkApps: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  linkAppsItems: {
    marginLeft: 10,
  },
});

export default LoginScreen;
