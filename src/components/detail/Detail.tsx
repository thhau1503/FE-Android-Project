import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ImageBackground,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  Linking,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { Video, ResizeMode } from "expo-av";
import MapView, { Marker } from "react-native-maps";

const { width } = Dimensions.get("screen");

// Thêm trực tiếp các giá trị màu
const COLORS = {
  white: "#FFF",
  dark: "#000",
  light: "#f6f6f6",
  grey: "#A9A9A9",
  blue: "#5f82e6",
  red: "red",
  transparent: "rgba(0,0,0,0)",
  green: "#4CAF50",
};

// Kiểu dữ liệu của các props mà component nhận vào
interface RentalHomeDetailProps {
  navigation: any;
  route: any;
}

const Detail: React.FC<RentalHomeDetailProps> = ({ navigation, route }) => {
  const { postId } = route.params;

  const [house, setHouse] = useState(null);
  const [landlord, setLandlord] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const [userId, setUserId] = useState<string>(""); // Lưu trữ userId
  const [viewMode, setViewMode] = useState("images"); // 'images' hoặc 'video'
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [description, setDescription] = useState("");
  const [user, setUser] = useState(null);
  const [lat, setLat] = useState(10.8452589);
  const [long, setLong] = useState(106.7941692);
  const [mapModalVisible, setMapModalVisible] = useState(false);

  const [comments, setComments] = useState([
    {
      id: "1",
      user: "Người dùng A",
      text: "Trọ sạch sẽ, giá hợp lý học sinh, sinh viên.",
    },
    { id: "2", user: "Người dùng B", text: "Giá tốt, gần trường học." },
  ]);

  const handleReportSubmit = async () => {
    try {
      const response = await axios.post(
        "https://be-android-project.onrender.com/api/report/create",
        {
          id_user: userId,
          id_post: house?._id,
          report_reason: reportReason,
          description: description,
        }
      );

      if (response.status === 200) {
        Alert.alert("Thành công", "Đã gửi báo cáo tới người quản trị");
        setModalVisible(false);
      } else {
        Alert.alert("Error", "Failed to submit report.");
      }
    } catch (error) {
      console.error("Report error:", error);
      Alert.alert("Error", "Failed to submit report.");
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newComment = {
        id: String(comments.length + 1),
        user: "Bạn",
        text: comment,
      };
      setComments([...comments, newComment]);
      setComment(""); // Xóa nội dung comment sau khi gửi
    }
  };

  // Hàm lấy thông tin người dùng hiện tại và kiểm tra bài viết đã yêu thích hay chưa
  const fetchUserInfo = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Gọi API để lấy thông tin người dùng
        const userResponse = await axios.get(
          "https://be-android-project.onrender.com/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Dữ liệu API trả về:", userResponse.data);

        setUserId(userResponse.data._id);
        setUser(userResponse.data);

        console.log("Giá trị user sau khi set:", user.username);

        // Gọi API để kiểm tra bài viết đã được thêm vào mục yêu thích chưa
        const response = await axios.get(
          `https://be-android-project.onrender.com/api/favorite/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const favoritePosts = response.data;
        const isFav = favoritePosts.some((fav) => fav.id_post._id === postId);
        setIsFavorite(isFav);
      }
    } catch (error) {}
  };
  const fetchUserId = async () => {
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
        const userId = response.data._id; // Lấy id_user_rent từ response
        return userId;
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      return null;
    }
  };

  // Hàm thêm vào mục yêu thích
  const addToFavorite = async () => {
    try {
      const userId = await fetchUserId(); // Lấy userId từ API hoặc token
      if (!userId) {
        console.error("Không lấy được ID người dùng.");
        return;
      }

      const token = await AsyncStorage.getItem("token");
      if (token) {
        const response = await axios.post(
          `https://be-android-project.onrender.com/api/favorite/create`,
          {
            id_post: postId,
            id_user_rent: userId, // Sử dụng userId lấy từ API hoặc token
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào mục yêu thích:", error);
    }
  };

  // Hàm xóa khỏi mục yêu thích
  const removeFromFavorite = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        // Fetch lại danh sách các mục yêu thích để lấy `_id` của mục yêu thích cần xóa
        const favoritesResponse = await axios.get(
          `https://be-android-project.onrender.com/api/favorite/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const favoritePosts = favoritesResponse.data;

        // Tìm `_id` của mục yêu thích dựa trên `postId`
        const favoriteItem = favoritePosts.find(
          (fav) => fav.id_post._id === postId
        );

        if (favoriteItem && favoriteItem._id) {
          const response = await axios.delete(
            `https://be-android-project.onrender.com/api/favorite/delete/${favoriteItem._id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setIsFavorite(false); // Cập nhật trạng thái yêu thích sau khi xóa
        } else {
          console.error("Không tìm thấy mục yêu thích để xóa.");
        }
      }
    } catch (error) {
      console.error("Lỗi khi xóa khỏi mục yêu thích:", error);
    }
  };
  // Hàm xử lý khi nhấn vào biểu tượng trái tim
  const handleFavoritePress = () => {
    if (isFavorite) {
      removeFromFavorite(); // Nếu đã yêu thích, xóa khỏi danh sách
    } else {
      addToFavorite(); // Nếu chưa yêu thích, thêm vào danh sách
    }
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(
          `https://be-android-project.onrender.com/api/post/${postId}`
        );
        setHouse(response.data);
        await fetchUserInfo();

        //setLat(response.data.location?.geoLocation?.coordinates[1]);
        //setLong(response.data.location?.geoLocation?.coordinates[0]);

        const landlordId = response.data.landlord._id;
        if (landlordId) {
          const landlordResponse = await axios.get(
            `https://be-android-project.onrender.com/api/auth/user/${landlordId}`
          );
          setLandlord(landlordResponse.data);
        }

        setLoading(false);
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu bài viết hoặc người cho thuê.");
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>{error}</Text>
      </View>
    );
  }

  const openMap = () => {
    navigation.navigate('MapScreen');
  }

  const openZalo = async (phoneNumber) => {
    try {
      const formattedPhone = phoneNumber.replace(/\D/g, "");
      const url = `https://zalo.me/${formattedPhone}`;
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          "Không thể mở Zalo",
          "Bạn có muốn gọi điện thoại trực tiếp không?",
          [
            {
              text: "Hủy",
              style: "cancel",
            },
            {
              text: "Gọi",
              onPress: () => Linking.openURL(`tel:${phoneNumber}`),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error opening Zalo:", error);
      Alert.alert("Lỗi", "Không thể mở Zalo");
    }
  };



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {house && (
          <View style={style.backgroundImageContainer}>
            {viewMode === "images" ? (
              <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                data={house.images}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={{ paddingHorizontal: 2 }}>
                    <Image
                      style={{
                        height: 320,
                        width: 320,
                        borderRadius: 10,
                      }}
                      resizeMode="cover"
                      source={{ uri: item.url }}
                    />
                  </View>
                )}
              />
            ) : house.videos ? (
              <Video
                source={{ uri: house.videos[0].url }}
                style={{
                  height: 320,
                  width: 320,
                  borderRadius: 10,
                }}
                useNativeControls
                resizeMode={"contain" as ResizeMode}
                shouldPlay
                onError={(error) =>
                  console.log("Video Playback Error: ", error)
                }
                onPlaybackStatusUpdate={(status) =>
                  console.log("Playback Status: ", status)
                }
              />
            ) : (
              <View style={style.noVideoContainer}>
                <Text style={style.noVideoText}>Không có video</Text>
              </View>
            )}
          </View>
        )}

        {house && (
          <View style={style.iconContainer}>
            <TouchableOpacity
              style={style.iconItem}
              onPress={() => setViewMode("images")}
            >
              <Icon
                name="photo"
                size={27}
                color={viewMode === "images" ? COLORS.blue : COLORS.grey}
              />
              <Text style={style.iconText}>{house.images.length} Ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={style.iconItem}
              onPress={() => setViewMode("video")}
            >
              <Icon
                name="videocam"
                size={27}
                color={viewMode === "video" ? COLORS.blue : COLORS.grey}
              />
              <Text style={style.iconText}>{house.videos.length} Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={style.iconItem} onPress={openMap}>
              <Icon name="map" size={27} color={COLORS.dark} />
              <Text style={style.iconText}>Bản đồ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={style.iconItem}
              onPress={handleFavoritePress}
            >
              <Icon
                name="favorite"
                size={24}
                color={isFavorite ? COLORS.red : COLORS.grey}
              />
              <Text style={style.iconText}>Yêu thích</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={style.separator}></View>

        {house && (
          <View style={style.detailsContainer}>
            <View style={style.titleContainer}>
              <View style={style.starContainer}>
                {[...Array(5)].map((_, index) => (
                  <Icon key={index} name="star" size={18} color="gold" />
                ))}
              </View>
              <Text style={style.houseTitle}>{house.title}</Text>
            </View>

            <View style={style.addressContainer}>
              <Icon name="location-pin" size={18} color="gray" />
              <Text style={[style.address, { flexWrap: "wrap" }]}>
                {house.location.address}, {house.location.ward},{" "}
                {house.location.district}, {house.location.city}
              </Text>
            </View>

            <View style={style.additionalInfoContainer}>
              <View style={style.infoItem}>
                <Icon name="attach-money" size={18} color="green" />
                <Text style={style.price}>
                  {house.price.toLocaleString("vi-VN")} triệu/tháng
                </Text>
              </View>
              <View style={style.infoItem}>
                <Icon name="square-foot" size={18} color="gray" />
                <Text style={style.area}>{house.size} m²</Text>
              </View>
              <View style={style.infoItem}>
                <Icon name="schedule" size={18} color="gray" />
                <Text style={style.timePosted}>49 phút trước</Text>
              </View>
            </View>
          </View>
        )}

        <View style={style.separator}></View>

        {landlord && (
          <View style={style.ownerContainer}>
            <Image
              source={{
                uri: landlord.avatar.url
                  ? landlord.avatar.url
                  : "https://th.bing.com/th/id/OIP.U0D5JdoPkQMi4jhiriSVsgHaHa?w=186&h=186&c=7&r=0&o=5&dpr=1.1&pid=1.7",
              }}
              style={style.ownerAvatar}
            />
            <View style={style.ownerInfo}>
              <Text style={style.ownerName}>{landlord.username}</Text>
              <Text style={style.ownerStatus}>
                <Icon name="circle" size={12} color="green" /> Đang hoạt động
              </Text>
              <View style={style.ownerContact}>
                <Text style={style.ownerPhone}>{landlord.phone}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={style.separator}></View>

        {house && (
          <View style={(style.amenitiesContainer, { paddingHorizontal: 20 })}>
            <Text style={style.amenitiesTitle}>Tiện ích</Text>
            <View style={style.amenitiesList}>
              {house.amenities &&
                Object.keys(house.amenities).map((key, index) => (
                  <Text key={index} style={style.amenityItem}>
                    {key}
                  </Text>
                ))}
            </View>
          </View>
        )}

        <View style={style.separator}></View>

        {house && (
          <View
            style={
              (style.additionalDetailsContainer, { paddingHorizontal: 20 })
            }
          >
            <Text style={style.additionalDetailsTitle}>Thông Tin Chi Tiết</Text>
            <Text style={style.detailText}>{house.description}</Text>
          </View>
        )}

        <View style={style.separator}></View>

        <View style={style.commentSection}>
          <TextInput
            style={style.commentInput}
            placeholder="Hãy nhập gì đó..."
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            onPress={handleCommentSubmit}
            style={style.submitBtn}
          >
            <Text style={style.submitBtnText}>Gửi</Text>
          </TouchableOpacity>
        </View>

        {comments.map((item) => (
          <View key={item.id} style={style.commentItem}>
            <Icon name="person" size={24} color={COLORS.grey} />
            <View style={style.commentContent}>
              <Text style={style.commentUser}>{item.user}</Text>
              <Text style={style.commentText}>{item.text}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={style.buttonContainer}>
        <TouchableOpacity
          style={style.bookNowBtn}
          onPress={() => {
            navigation.navigate("booking", {
              postId: house?._id,
              landlordId: house?.landlord?._id,
              userId: userId,
              title: house?.title,
              image: house?.images[0]?.url,
              price: house?.price,
            });
          }}
        >
          <Text style={{ color: COLORS.white }}>Đặt lịch hẹn</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.circleButton}
          onPress={() => openZalo(house.landlord.phone)}
        >
          <Icon name="message" size={20} color={COLORS.dark} />
        </TouchableOpacity>
        <TouchableOpacity
          style={style.circleButton}
          onPress={() => setModalVisible(true)}
        >
          <Icon name="report" size={20} color={COLORS.dark} />
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Báo cáo bài viết</Text>
            <Text
              style={{
                fontSize: 12,
                color: "#000",
                marginVertical: 5,
                alignSelf: "flex-start", // Thêm dòng này
              }}
            >
              Nguyên nhân báo cáo
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={reportReason}
                style={styles.picker}
                onValueChange={(itemValue) => setReportReason(itemValue)}
              >
                <Picker.Item label="Lý do report" value="" />
                <Picker.Item label="Có dấu hiệu lừa đảo" value="Fraud" />
                <Picker.Item label="Spam" value="Spam" />
                <Picker.Item
                  label="Thông tin sai sự thật"
                  value="Inappropriate Content"
                />
                <Picker.Item label="Khác" value="Other" />
              </Picker>
            </View>
            <Text
              style={{
                fontSize: 12,
                color: "#000",
                marginVertical: 5,
                alignSelf: "flex-start", // Thêm dòng này
              }}
            >
              Mô tả chi tiết
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            <Text
              style={{
                fontSize: 12,
                color: "#000",
                marginVertical: 5,
                alignSelf: "flex-start", // Thêm dòng này
              }}
            >
              Tên người báo cáo
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={user.username}
              multiline
              editable={false}
              pointerEvents="none"
            />
            <Text
              style={{
                fontSize: 12,
                color: "#000",
                marginVertical: 5,
                alignSelf: "flex-start", // Thêm dòng này
              }}
            >
              Số điện thoại
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={user.phone}
              multiline
              editable={false}
              pointerEvents="none"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSubmit]}
                onPress={handleReportSubmit}
              >
                <Text style={styles.textStyle}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 1,
    backgroundColor: "white",
    padding: 8,
    borderRadius: 20,
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.light,
  },
  bookNowBtn: {
    flex: 1,
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bookNowText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  pickerContainer: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
  },
  picker: {
    width: "100%",
    height: 40,
  },
  mapContainer: {
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#f44336",
  },
  buttonSubmit: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

const style = StyleSheet.create({
  backgroundImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 20,
    height: 350,
    width: "89%",
  },
  headerBtn: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  virtualTag: {
    position: "absolute",
    top: -20,
    width: 120,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: "dark",
    justifyContent: "center",
    alignItems: "center",
  },

  // Container tổng thể cho tiêu đề và chi tiết
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },

  // Container cho tiêu đề và ngôi sao
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    flexWrap: "wrap", // Cho phép xuống hàng nếu tiêu đề quá dài
  },

  // Style cho ngôi sao
  starContainer: {
    flexDirection: "row",
    marginRight: 10,
  },

  // Style cho tiêu đề trọ
  houseTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "red",
    flexShrink: 1, // Thu nhỏ tiêu đề nếu không đủ không gian, nhưng vẫn giữ ngôi sao cùng hàng
  },

  // Container cho địa chỉ và biểu tượng địa chỉ
  addressContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 5,
    flexWrap: "wrap", // Cho phép địa chỉ xuống hàng khi quá dài
  },

  // Container cho văn bản địa chỉ
  addressTextContainer: {
    flex: 1,
    flexWrap: "wrap", // Cho phép văn bản địa chỉ xuống hàng
  },

  // Style cho địa chỉ
  address: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
    flexWrap: "wrap", // Đảm bảo địa chỉ xuống hàng khi cần
  },

  // Container cho thông tin giá, diện tích và thời gian
  additionalInfoContainer: {
    flexDirection: "row",
    alignItems: "center",

    flexWrap: "wrap", // Cho phép các phần tử xuống hàng nếu không đủ không gian
  },

  // Style cho từng mục giá, diện tích, thời gian
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    flexShrink: 1, // Thu nhỏ nếu không đủ không gian
  },

  // Style cho giá
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "green",
    marginLeft: 5,
    flexDirection: "row",
    flexWrap: "nowrap", // Đảm bảo "triệu/tháng" không bị tách ra thành hai dòng
  },

  // Style cho diện tích
  area: {
    fontSize: 12,
    color: "#666",
    marginLeft: 5,
  },

  // Style cho thời gian
  timePosted: {
    fontSize: 10,
    color: "#666",
    marginLeft: 5,
  },

  amenitiesContainer: {
    marginTop: 5,
    marginLeft: 5,
  },
  amenitiesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "dark",
  },
  amenitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
    marginLeft: 5,
  },
  amenityItem: {
    backgroundColor: "blue",
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 5,
    color: "white",
  },
  additionalDetailsContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  additionalDetailsTitle: {
    fontSize: 20,
    marginLeft: 5,
    fontWeight: "bold",
    color: "dark",
  },
  detailText: {
    marginLeft: 20,
    fontSize: 16,
    color: "grey",
  },
  interiorImage: {
    width: width / 3 - 20,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.light,
  },
  bookNowBtn: {
    flex: 1,
    backgroundColor: "black",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  bookNowText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  circleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginLeft: 8,
  },

  iconContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    backgroundColor: "white",
  },
  iconItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  iconText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "grey",
  },
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  submitBtn: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 20,
  },
  submitBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  commentContent: {
    marginLeft: 10,
  },
  commentUser: {
    fontWeight: "bold",
    color: "dark",
  },
  commentText: {
    color: "grey",
  },

  separator: {
    height: 5,
    backgroundColor: "#E0E0E0",
    width: "100%",
    marginVertical: 10,
  },

  ownerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  ownerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  ownerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  ownerStatus: {
    fontSize: 14,
    color: "gray",
    marginVertical: 3,
  },
  ownerContact: {
    flexDirection: "row",
    alignItems: "center",
  },
  ownerPhone: {
    fontSize: 16,
    color: COLORS.blue,
    marginRight: 10,
  },
  ownerZalo: {
    fontSize: 16,
    color: COLORS.blue,
  },
  video: {
    width: width,
    height: 300,
    backgroundColor: COLORS.grey,
  },
  noVideoContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 300,
    backgroundColor: COLORS.grey,
  },
  noVideoText: {
    color: COLORS.red,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Detail;
