import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AddListingScreen = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");
  const [roomType, setRoomType] = useState("Single");
  const [area, setArea] = useState("");
  const [availability, setAvailability] = useState(true);
  const [electricityCost, setElectricityCost] = useState("");
  const [waterCost, setWaterCost] = useState("");
  const [internetCost, setInternetCost] = useState("");
  const [cleaningCost, setCleaningCost] = useState("");
  const [securityCost, setSecurityCost] = useState("");
  const [landlordId, setLandlordId] = useState(null);

  const [amenities, setAmenities] = useState({
    wifi: false,
    airConditioner: false,
    heater: false,
    kitchen: false,
    parking: false,
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

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
        setLandlordId(response.data._id);
      } else {
        Alert.alert("Lỗi", "Token không tồn tại, vui lòng đăng nhập lại!");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };

  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Bạn cần cấp quyền truy cập thư viện ảnh để tải lên hình ảnh!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const selectedImages = result.assets.map((asset) => ({
        uri: asset.uri,
        type: "image/jpeg",
        name: asset.uri.split("/").pop(),
      }));
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  const pickVideos = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Bạn cần cấp quyền truy cập thư viện để tải lên video!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const selectedVideos = result.assets.map((asset) => ({
        uri: asset.uri,
        type: "video/mp4",
        name: asset.uri.split("/").pop(),
      }));
      setVideos((prevVideos) => [...prevVideos, ...selectedVideos]);
    }
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const removeVideo = (index) => {
    const updatedVideos = videos.filter((_, i) => i !== index);
    setVideos(updatedVideos);
  };

  const handleToggleAmenity = (key) => {
    setAmenities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async () => {
    if (!landlordId) {
      Alert.alert("Lỗi", "Không thể lấy ID người cho thuê. Vui lòng thử lại!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append(
      "location",
      JSON.stringify({
        address,
        city,
        district,
        ward,
      })
    );
    formData.append("landlord", landlordId);
    formData.append("roomType", roomType);
    formData.append("size", area);
    formData.append("availability", availability);
    formData.append("amenities", JSON.stringify(amenities));
    formData.append(
      "additionalCosts",
      JSON.stringify({
        electricity: electricityCost,
        water: waterCost,
        internet: internetCost,
        cleaning: cleaningCost,
        security: securityCost,
      })
    );

    images.forEach((image) => {
      formData.append("images", {
        uri: image.uri,
        type: image.type,
        name: image.name,
      });
    });

    videos.forEach((video) => {
      formData.append("videos", {
        uri: video.uri,
        type: video.type,
        name: video.name,
      });
    });

    try {
      const response = await fetch(
        "https://be-android-project.onrender.com/api/post/create",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Thành công", "Tạo bài viết thành công!");
      } else {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        Alert.alert("Thất bại", `Lỗi: ${errorText}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      Alert.alert("Thất bại", "Đã xảy ra lỗi khi gọi API.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Đăng tin</Text>

      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Nhập mô tả chi tiết"
        value={description}
        onChangeText={setDescription}
        multiline={true}
      />

      <Text style={styles.label}>Giá</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Diện tích (m²)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập diện tích"
        keyboardType="numeric"
        value={area}
        onChangeText={setArea}
      />

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập địa chỉ"
        value={address}
        onChangeText={setAddress}
      />

      <Text style={styles.label}>Quận</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập quận"
        value={district}
        onChangeText={setDistrict}
      />

      <Text style={styles.label}>Phường</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập phường"
        value={ward}
        onChangeText={setWard}
      />

      <Text style={styles.label}>Thành phố</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập thành phố"
        value={city}
        onChangeText={setCity}
      />

      <Text style={styles.label}>Tiện nghi</Text>
      <View style={styles.checkboxContainer}>
        {Object.keys(amenities).map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.checkboxRow}
            onPress={() => handleToggleAmenity(key)}
          >
            <View
              style={[
                styles.checkbox,
                amenities[key] && styles.checkboxSelected,
              ]}
            />
            <Text style={styles.checkboxLabel}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Chi phí bổ sung</Text>
      <TextInput
        style={styles.input}
        placeholder="Chi phí điện"
        keyboardType="numeric"
        value={electricityCost}
        onChangeText={setElectricityCost}
      />
      <TextInput
        style={styles.input}
        placeholder="Chi phí nước"
        keyboardType="numeric"
        value={waterCost}
        onChangeText={setWaterCost}
      />
      <TextInput
        style={styles.input}
        placeholder="Chi phí internet"
        keyboardType="numeric"
        value={internetCost}
        onChangeText={setInternetCost}
      />
      <TextInput
        style={styles.input}
        placeholder="Chi phí vệ sinh"
        keyboardType="numeric"
        value={cleaningCost}
        onChangeText={setCleaningCost}
      />
      <TextInput
        style={styles.input}
        placeholder="Chi phí bảo vệ"
        keyboardType="numeric"
        value={securityCost}
        onChangeText={setSecurityCost}
      />

      <Text style={styles.label}>Hình ảnh</Text>
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImages}>
        <Text style={styles.imagePickerText}>Chọn hình ảnh</Text>
      </TouchableOpacity>
      {images.map((image, index) => (
        <View key={index} style={styles.imagePreview}>
          <Text>{image.name}</Text>
          <TouchableOpacity onPress={() => removeImage(index)}>
            <Text style={styles.removeButton}>Xóa</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.label}>Video</Text>
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickVideos}>
        <Text style={styles.imagePickerText}>Chọn Video</Text>
      </TouchableOpacity>
      {videos.map((video, index) => (
        <View key={index} style={styles.imagePreview}>
          <Text>{video.name}</Text>
          <TouchableOpacity onPress={() => removeVideo(index)}>
            <Text style={styles.removeButton}>Xóa</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Tạo bài viết</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  label: { fontSize: 16, marginVertical: 5 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10, marginBottom: 10 },
  textArea: { height: 80, textAlignVertical: "top" },
  checkboxContainer: { marginVertical: 10 },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: "#ddd", marginRight: 10, backgroundColor: "#fff" },
  checkboxSelected: { backgroundColor: "#007BFF" },
  checkboxLabel: { fontSize: 16 },
  imagePickerButton: { backgroundColor: "#f0f0f0", padding: 10, borderRadius: 5, alignItems: "center", marginVertical: 10 },
  imagePreview: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 },
  removeButton: { color: "red", fontWeight: "bold" },
  submitButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 5, alignItems: "center", marginVertical: 20 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default AddListingScreen;
