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
  Alert,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
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
  avatar: {
    url: string;
  };
}

const ProfileScreen: React.FC = ({ navigation }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [userRole, setUserRole] = useState("");
  const [selectImage, setSelectImage] = useState<string | null>(null);

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
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
        setSelectImage(response.data.avatar.url);
      } else {
        navigation.navigate("login");
      }
    } catch (error: any) {
      if (error.response && error.response.data.msg === "Token is not valid") {
        await AsyncStorage.removeItem("token");
        navigation.navigate("login");
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUserName(user.username || "");
      setEmail(user.email || "");
      setAddress(user.address || "");
      setPhone(user.phone || "");
      setUserRole(user.user_role || "");
    }
  }, [user]);

  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    navigation.navigate("login");
  };

  const handleSaveChanges = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !user) {
        throw new Error("No token or user found");
      }
  
      const formData = new FormData();
      formData.append("username", userName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("address", address);
  
      if (selectImage) {
        const uriParts = selectImage.split(".");
        const fileType = uriParts[uriParts.length - 1].toLowerCase();
        const mimeType =
          fileType === "jpg" || fileType === "jpeg"
            ? "image/jpeg"
            : fileType === "png"
            ? "image/png"
            : "image/jpeg";
  
        formData.append("avatar", {
          uri: Platform.OS === "android" ? selectImage : selectImage.replace("file://", ""),
          name: `profile_${Date.now()}.${fileType}`,
          type: mimeType,
        } as any);
      }
  
      const response = await axios.put(
        `http://192.168.100.123:5000/api/auth/users/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      if (response.status === 200) {
        Alert.alert("Success", "Thông tin của bạn đã được cập nhật thành công.");
        fetchUserProfile();
      } else {
        Alert.alert("Error", "Cập nhật thông tin thất bại.");
      }
    } catch (error: any) {
      console.error("Update error:", error.response.data);
    }
  };
  

  const handleRegister = async () => {
    const id = user?._id;
    try {
      const response = await fetch(`https://be-android-project.onrender.com/api/auth/update-role-to-renter/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to update role');
      }
      const data = await response.json();
      console.log('Role updated successfully:', data);
      Alert.alert(
        'Đăng ký thành công',
        'Đăng ký thành người cho thuê thành công. Vui lòng đăng nhập lại để chuyển đến trang quản l',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('login'),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor={"#989993"} barStyle="light-content" />
      <ScrollView>
        <View style={{ width: "100%" }}>
          <Image
            source={{
              uri: selectImage,
            }}
            resizeMode="cover"
            style={{ height: 228, width: "100%" }}
          />
        </View>
        <View style={{ alignItems: "center", marginVertical: 22 }}>
          <TouchableOpacity onPress={() => handleImageSelection()}>
            <Image
              source={{
                uri: selectImage
                  ? selectImage
                  : `https://ui-avatars.com/api/?name=${getInitials(
                      userName
                    )}&background=random&color=fff&size=256`,
              }}
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
                editable={false}
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
                editable={false}
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
            <Text style={{ color: "#f8f8f4", fontSize: 16 }}>Register renter</Text>
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
              backgroundColor: "#c91b1b",
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