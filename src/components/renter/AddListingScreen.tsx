import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";

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
  const [wifi, setWifi] = useState(false);
  const [airConditioner, setAirConditioner] = useState(false);
  const [heater, setHeater] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [parking, setParking] = useState(false);
  const [images, setImages] = useState([]); // Lưu danh sách hình ảnh
  const [videoUrl, setVideoUrl] = useState(""); // URL video

  // Hàm chọn nhiều hình ảnh
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
      const selectedImages = result.assets.map((asset) => asset.uri);
      setImages((prevImages) => [...prevImages, ...selectedImages]);
    }
  };

  // Hàm chuyển đổi URI thành Blob
  const uriToBlob = async (uri: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

  // Hàm gửi dữ liệu
  const handleSubmit = async () => {
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
    formData.append("roomType", roomType);
    formData.append("size", area);
    formData.append("availability", availability.toString());
    formData.append(
      "amenities",
      JSON.stringify({
        wifi,
        airConditioner,
        heater,
        kitchen,
        parking,
      })
    );
    formData.append(
      "additionalCosts",
      JSON.stringify({
        electricity: electricityCost,
        water: waterCost,
        internet: internetCost,
        cleaning: cleaningCost,
      })
    );

    // Thêm hình ảnh vào FormData
    for (const image of images) {
      const blob = await uriToBlob(image); // Chuyển đổi URI thành Blob
      formData.append("images", blob, "image.jpg");
    }

    if (videoUrl) {
      formData.append("videos", videoUrl);
    }

    try {
      const response = await fetch(
        "https://be-android-project.onrender.com/api/post/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      if (response.ok) {
        const result = await response.json();
        Alert.alert("Thành công", "Tạo bài viết thành công!");
        console.log(result);
      } else {
        const errorText = await response.text();
        Alert.alert("Thất bại", `Lỗi: ${errorText}`);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
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

      <Text style={styles.label}>Hình ảnh</Text>
      <Button title="Chọn hình ảnh" onPress={pickImages} />
      {images.map((image, index) => (
        <Text key={index}>{image}</Text>
      ))}

      <Text style={styles.label}>Video (URL)</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập URL video"
        value={videoUrl}
        onChangeText={setVideoUrl}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Tạo bài viết</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 5,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
    marginBottom: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddListingScreen;
