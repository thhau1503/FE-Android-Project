import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const EditListingScreen = ({ route, navigation }) => {
  const { postId } = route.params; // Lấy ID bài đăng từ tham số truyền vào
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [city, setCity] = useState("");
  const [roomType, setRoomType] = useState("Single");
  const [size, setSize] = useState("");
  const [availability, setAvailability] = useState(true);
  const [amenities, setAmenities] = useState({
    hasWifi: false,
    hasParking: false,
    hasAirConditioner: false,
    hasKitchen: false,
    hasElevator: false,
  });
  const [additionalCosts, setAdditionalCosts] = useState({
    electricity: "",
    water: "",
    internet: "",
    cleaning: "",
    security: "",
  });
  const [images, setImages] = useState([]); // Ảnh từ API
  const [newImages, setNewImages] = useState([]); // Ảnh được thêm mới
  const [videos, setVideos] = useState([]); // Video từ API
  const [newVideos, setNewVideos] = useState([]); // Video được thêm mới

  useEffect(() => {
    fetchListingDetails();
  }, []);

  const fetchListingDetails = async () => {
    try {
      const response = await axios.get(
        `https://be-android-project.onrender.com/api/post/${postId}`
      );
      const data = response.data;

      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price.toString());
      setAddress(data.location.address);
      setDistrict(data.location.district);
      setWard(data.location.ward);
      setCity(data.location.city);
      setRoomType(data.roomType);
      setSize(data.size.toString());
      setAvailability(data.availability);
      setAmenities(data.amenities || {});
      setAdditionalCosts(data.additionalCosts || {});
      setImages(data.images || []);
      setVideos(data.videos || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching listing details:", error);
      Alert.alert("Lỗi", "Không thể tải thông tin bài đăng.");
    }
  };

  const handleToggleAmenity = (key) => {
    setAmenities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const pickMedia = async (mediaType, setMedia) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Quyền truy cập bị từ chối", "Hãy cấp quyền để chọn hình ảnh/video!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const selectedMedia = result.assets.map((asset) => ({
        uri: asset.uri,
        type: mediaType === ImagePicker.MediaTypeOptions.Images ? "image/jpeg" : "video/mp4",
        name: asset.uri.split("/").pop(),
      }));
      setMedia((prev) => [...prev, ...selectedMedia]);
    }
  };

  const removeMedia = (index, setMedia, media) => {
    const updatedMedia = media.filter((_, i) => i !== index);
    setMedia(updatedMedia);
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", parseFloat(price));
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
    formData.append("size", parseFloat(size));
    formData.append("availability", availability);
    formData.append("amenities", JSON.stringify(amenities));
    formData.append("additionalCosts", JSON.stringify(additionalCosts));

    // Thêm ảnh mới
    newImages.forEach((image, index) => {
      formData.append(`images[${index}]`, {
        uri: image.uri,
        type: "image/jpeg",
        name: `image_${index}.jpg`,
      });
    });

    // Thêm video mới
    newVideos.forEach((video, index) => {
      formData.append(`videos[${index}]`, {
        uri: video.uri,
        type: "video/mp4",
        name: `video_${index}.mp4`,
      });
    });

    try {
      const response = await axios.put(
        `https://be-android-project.onrender.com/api/post/${postId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      Alert.alert("Thành công", "Cập nhật bài viết thành công!");
      navigation.goBack();
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Thất bại", "Không thể cập nhật bài viết.");
    }
  };

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Chỉnh sửa bài đăng</Text>

      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Mô tả</Text>
      <TextInput
        style={styles.textArea}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Giá thuê</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Địa chỉ</Text>
      <TextInput style={styles.input} value={address} onChangeText={setAddress} />
      <TextInput style={styles.input} value={city} onChangeText={setCity} />
      <TextInput style={styles.input} value={district} onChangeText={setDistrict} />
      <TextInput style={styles.input} value={ward} onChangeText={setWard} />

      <Text style={styles.label}>Loại phòng</Text>
      <TextInput style={styles.input} value={roomType} onChangeText={setRoomType} />

      <Text style={styles.label}>Diện tích</Text>
      <TextInput
        style={styles.input}
        value={size}
        onChangeText={setSize}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Tiện nghi</Text>
      {Object.keys(amenities).map((key) => (
        <View style={styles.amenityRow} key={key}>
          <Text style={styles.amenityLabel}>{key}</Text>
          <Switch
            value={amenities[key]}
            onValueChange={() => handleToggleAmenity(key)}
          />
        </View>
      ))}

      <Text style={styles.label}>Chi phí bổ sung</Text>
      {Object.keys(additionalCosts).map((key) => (
        <View style={styles.additionalCostRow} key={key}>
          <Text style={styles.additionalCostLabel}>{key}</Text>
          <TextInput
            style={styles.input}
            value={additionalCosts[key].toString()}
            onChangeText={(value) =>
              setAdditionalCosts({ ...additionalCosts, [key]: value })
            }
            keyboardType="numeric"
          />
        </View>
      ))}

      <Text style={styles.label}>Hình ảnh</Text>
      {images.map((image, index) => (
        <View key={index} style={styles.mediaPreview}>
          <Image source={{ uri: image.url }} style={styles.image} />
          <TouchableOpacity
            onPress={() => removeMedia(index, setImages, images)}
          >
            <Text style={styles.removeButton}>Xóa</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.pickButton}
        onPress={() => pickMedia(ImagePicker.MediaTypeOptions.Images, setNewImages)}
      >
        <Text style={styles.pickButtonText}>Thêm ảnh mới</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Video</Text>
      {videos.map((video, index) => (
        <View key={index} style={styles.mediaPreview}>
          <Text>{video.url}</Text>
          <TouchableOpacity
            onPress={() => removeMedia(index, setVideos, videos)}
          >
            <Text style={styles.removeButton}>Xóa</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.pickButton}
        onPress={() => pickMedia(ImagePicker.MediaTypeOptions.Videos, setNewVideos)}
      >
        <Text style={styles.pickButtonText}>Thêm video mới</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.submitButton} onPress={handleUpdate}>
        <Text style={styles.submitText}>Cập nhật bài viết</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 10 },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginVertical: 10 },
  label: { fontSize: 16, marginVertical: 5 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10, marginBottom: 10 },
  textArea: { borderWidth: 1, borderColor: "#ddd", borderRadius: 5, padding: 10, height: 80 },
  pickButton: { backgroundColor: "#e0e0e0", padding: 10, borderRadius: 5, alignItems: "center", marginVertical: 10 },
  pickButtonText: { color: "#333", fontSize: 14 },
  mediaPreview: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 },
  image: { width: 100, height: 100 },
  removeButton: { color: "red", fontWeight: "bold" },
  submitButton: { backgroundColor: "#007BFF", padding: 15, borderRadius: 5, alignItems: "center", marginVertical: 20 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  amenityRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 },
  amenityLabel: { fontSize: 16 },
  additionalCostRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 },
  additionalCostLabel: { fontSize: 16 },
});

export default EditListingScreen;
