import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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
    hasWifi: false,
    hasParking: false,
    hasAirConditioner: false,
    hasKitchen: false,
    hasElevator: false,
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

  const pickMedia = async (mediaType) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Quyền truy cập bị từ chối",
        "Bạn cần cấp quyền truy cập thư viện để chọn hình ảnh hoặc video!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      if (mediaType === ImagePicker.MediaTypeOptions.Images) {
        const selectedImages = result.assets.map((asset) => ({
          uri: asset.uri,
          type: "image/jpeg",
          name: asset.uri.split("/").pop(),
        }));
        setImages((prevImages) => [...prevImages, ...selectedImages]);
      } else if (mediaType === ImagePicker.MediaTypeOptions.Videos) {
        const selectedVideos = result.assets.map((asset) => ({
          uri: asset.uri,
          type: "video/mp4",
          name: asset.uri.split("/").pop(),
        }));
        setVideos((prevVideos) => [...prevVideos, ...selectedVideos]);
      }
    }
  };

  const removeMedia = (mediaType, index) => {
    if (mediaType === "image") {
      const updatedImages = images.filter((_, i) => i !== index);
      setImages(updatedImages);
    } else if (mediaType === "video") {
      const updatedVideos = videos.filter((_, i) => i !== index);
      setVideos(updatedVideos);
    }
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
        cleaningService: cleaningCost,
        security: securityCost,
      })
    );
  
    // Xử lý hình ảnh
    for (let i = 0; i < images.length; i++) {
      const localUri = images[i].uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';
  
      formData.append('images', {
        uri: localUri,
        name: filename,
        type
      } as any);
    }
  
    // Append videos
    for (let i = 0; i < videos.length; i++) {
      const localUri = videos[i].uri;
      const filename = localUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `video/${match[1]}` : 'video/mp4';
  
      formData.append('videos', {
        uri: localUri,
        name: filename,
        type
      } as any);
    }

    console.log("formData", formData);
  
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
        Alert.alert("Thành công", "Tạo bài viết thành công!");
        // Reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setAddress("");
        setDistrict("");
        setWard("");
        setCity("");
        setRoomType("Single");
        setArea("");
        setAvailability(true);
        setAmenities({
          hasWifi: false,
          hasParking: false,
          hasAirConditioner: false,
          hasKitchen: false,
          hasElevator: false,
        });
        setElectricityCost("");
        setWaterCost("");
        setInternetCost("");
        setCleaningCost("");
        setSecurityCost("");
        setImages([]);
        setVideos([]);
      } else {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        Alert.alert("Thất bại", `Lỗi: ${errorText}`);
      }
    } catch (error) {
      console.error("Network Error:", error.response.data);
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

      <Text style={styles.label}>Loại phòng</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={roomType}
          onValueChange={(value) => setRoomType(value)}
        >
          <Picker.Item label="Single" value="Single" />
          <Picker.Item label="Double" value="Double" />
          <Picker.Item label="Shared" value="Shared" />
          <Picker.Item label="Apartment" value="Apartment" />
          <Picker.Item label="Dormitory" value="Dormitory" />
        </Picker>
      </View>

      <Text style={styles.label}>Tiện nghi</Text>
      <View style={styles.amenitiesContainer}>
        {Object.keys(amenities).map((key) => (
          <View key={key} style={styles.amenityRow}>
            <Text style={styles.amenityLabel}>{key}</Text>
            <Switch
              value={amenities[key]}
              onValueChange={() => handleToggleAmenity(key)}
            />
          </View>
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
      <TouchableOpacity
        style={styles.imagePickerButton}
        onPress={() => pickMedia(ImagePicker.MediaTypeOptions.Images)}
      >
        <Text style={styles.imagePickerText}>Chọn hình ảnh</Text>
      </TouchableOpacity>
      {images.map((image, index) => (
        <View key={index} style={styles.imagePreview}>
          <Text>{image.name}</Text>
          <TouchableOpacity onPress={() => removeMedia("image", index)}>
            <Text style={styles.removeButton}>Xóa</Text>
          </TouchableOpacity>
        </View>
      ))}

      <Text style={styles.label}>Video</Text>
      <TouchableOpacity
        style={styles.imagePickerButton}
        onPress={() => pickMedia(ImagePicker.MediaTypeOptions.Videos)}
      >
        <Text style={styles.imagePickerText}>Chọn Video</Text>
      </TouchableOpacity>
      {videos.map((video, index) => (
        <View key={index} style={styles.imagePreview}>
          <Text>{video.name}</Text>
          <TouchableOpacity onPress={() => removeMedia("video", index)}>
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
  pickerContainer: { borderWidth: 1, borderColor: "#ddd", borderRadius: 5, marginBottom: 10 },
  amenitiesContainer: { marginVertical: 10 },
  amenityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 },
  amenityLabel: { fontSize: 16 },
  imagePickerButton: { backgroundColor: "#f0f0f0", padding: 10, borderRadius: 5, alignItems: "center", marginVertical: 10 },
  imagePreview: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 },
  removeButton: { color: "red", fontWeight: "bold" },
  submitButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 5, alignItems: "center", marginVertical: 20 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default AddListingScreen;