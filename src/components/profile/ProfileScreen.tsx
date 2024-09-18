import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";

interface User {
  id: string;
  username: string;
  email: string;
  user_role: string;
  phone: string;
  address: string;
}

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userRole, setUserRole] = useState("");
  const [selectImage, setSelectImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbzwf4BLLOYmioPDykqjFiyJ9Nk1jFscdf7A&s"
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("token:", token);
        if (token) {
          const response = await axios.get(
            "https://be-android-project.onrender.com/api/auth/me",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setUser(response.data);
        } else {
          navigation.navigate("login");
        }
      } catch (error: any) {
        // Nếu lỗi liên quan đến token không hợp lệ, logout và điều hướng người dùng về login
        if (
          error.response &&
          error.response.data.msg === "Token is not valid"
        ) {
          await AsyncStorage.removeItem("token"); // Xóa token không hợp lệ
          navigation.navigate("login"); // Điều hướng về màn hình login
        } else {
          console.error(error); // Xử lý các lỗi khác (nếu có)
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Cập nhật userName khi user thay đổi
  useEffect(() => {
    console.log(user);
    if (user) {
      setUserName(user.username || "");
      setEmail(user.email || "");
      setAddress(user.address || "");
      setPhone(user.phone || "");
      setUserRole(user.user_role || "");
    }
  }, [user]);

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
  // handleLogout

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("login");
  };

  // handleSaveChanges

  const handleSaveChanges = async () => {};

  // handleRegister
  const handleRegister = async () => {
    // await AsyncStorage.removeItem("token");
    navigation.navigate("register");
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor={"#989993"} barStyle="light-content" />
      <ScrollView>
        <View style={{ width: "100%" }}>
          <Image
            source={{
              uri: "https://storage.googleapis.com/digital-platform/hinh_anh_Can_ho_mau_Vinhomes_Smart_City_nhin_la_muon_o_ngay_so_3_4ee32c4231/hinh_anh_Can_ho_mau_Vinhomes_Smart_City_nhin_la_muon_o_ngay_so_3_4ee32c4231.jpg",
            }}
            resizeMode="cover"
            style={{ height: 228, width: "100%" }}
          />
        </View>
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
                marginTop: -100,
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
        <View style={{ paddingHorizontal: 22 }}>
          <View style={{ flexDirection: "column", marginBottom: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="user" size={24} color="black" />
              <Text style={{ fontSize: 15, fontWeight: "bold" }}> Name </Text>
            </View>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: "#7f7b7b",
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={userName}
                onChangeText={(value) => setUserName(value)}
                editable={true}
                placeholder="Username"
              />
            </View>
          </View>
          <View style={{ flexDirection: "column", marginBottom: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons name="email" size={24} color="black" />
              <Text style={{ fontSize: 15, fontWeight: "bold" }}> Email </Text>
            </View>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: "#7f7b7b",
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={email}
                onChangeText={(value) => setEmail(value)}
                editable={true}
                placeholder="Email"
              />
            </View>
          </View>
          <View style={{ flexDirection: "column", marginBottom: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <FontAwesome name="phone" size={24} color="black" />
              <Text style={{ fontSize: 15, fontWeight: "bold" }}> Phone </Text>
            </View>

            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: "#7f7b7b",
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={phone}
                onChangeText={(value) => setPhone(value)}
                editable={true}
                placeholder="Phone"
              />
            </View>
          </View>
          <View style={{ flexDirection: "column", marginBottom: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Entypo name="address" size={24} color="black" />
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>Address</Text>
            </View>
            <View
              style={{
                height: 44,
                width: "100%",
                borderColor: "#7f7b7b",
                borderWidth: 1,
                borderRadius: 4,
                marginVertical: 6,
                justifyContent: "center",
                paddingLeft: 8,
              }}
            >
              <TextInput
                value={address}
                onChangeText={(value) => setAddress(value)}
                editable={true}
                placeholder="Address"
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              handleRegister();
            }}
            style={{
              backgroundColor: "#2fbf66",
              height: 44,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#f8f8f4", fontSize: 16 }}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleSaveChanges();
            }}
            style={{
              backgroundColor: "#cac63f",
              height: 44,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
          >
            <Text style={{ color: "black", fontSize: 16 }}>Save Change</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#3365a6",
              height: 44,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
            }}
            onPress={() => {
              handleLogout();
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
});

export default ProfileScreen;