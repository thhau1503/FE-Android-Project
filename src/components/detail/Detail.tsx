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
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";

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

  const [comments, setComments] = useState([
    {
      id: "1",
      user: "Người dùng A",
      text: "Trọ sạch sẽ, giá hợp lý học sinh, sinh viên.",
    },
    { id: "2", user: "Người dùng B", text: "Giá tốt, gần trường học." },
  ]);
  // Hàm thêm comment vào danh sách
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
        setUserId(userResponse.data._id);

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
        const isFav = favoritePosts.some((fav) => fav.id_post === postId);
        setIsFavorite(isFav);
      }
    } catch (error) {
      console.error(
        "Lỗi khi lấy thông tin người dùng hoặc kiểm tra mục yêu thích:",
        error
      );
    }
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

        const favoritePosts = favoritesResponse.data._id;

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
        console.log(house);
        // Gọi hàm lấy thông tin người dùng và kiểm tra yêu thích
        await fetchUserInfo();

        // Gọi API để lấy thông tin người cho thuê từ landlord ID
        const landlordId = response.data.landlord._id;
        if (landlordId) {
          const landlordResponse = await axios.get(
            `https://be-android-project.onrender.com/api/auth/user/${landlordId}`
          );
          setLandlord(landlordResponse.data);
          console.log(landlordResponse.data);
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {house && (
          <View style={style.backgroundImageContainer}>
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
          </View>
        )}
        {house && (
          <View style={style.iconContainer}>
            <TouchableOpacity style={style.iconItem}>
              <Icon name="photo" size={27} color="#0143c7" />
              <Text style={style.iconText}>{house.images.length} Ảnh</Text>
            </TouchableOpacity>

            <TouchableOpacity style={style.iconItem}>
              <Icon name="videocam" size={27} color="#0143c7" />
              <Text style={style.iconText}>Video</Text>
            </TouchableOpacity>

            <TouchableOpacity style={style.iconItem}>
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

        {/* Đường kẻ ngang */}
        <View style={style.separator}></View>

        {/* Container cho thông tin chi tiết */}
        <View style={style.detailsContainer}>
          {/* Ngôi sao và tiêu đề trọ */}
          <View style={style.titleContainer}>
            <View style={style.starContainer}>
              {[...Array(5)].map((_, index) => (
                <Icon key={index} name="star" size={18} color="gold" />
              ))}
            </View>
            <Text style={style.houseTitle}>{house?.title}</Text>
          </View>

          {/* Địa chỉ */}
          <View style={style.addressContainer}>
            <Icon name="location-pin" size={18} color="gray" />
            <View
              style={{
                flex: 1,
                flexWrap: "wrap",
                flexDirection: "row",
              }}
            >
              <Text style={[style.address, { flexWrap: "wrap" }]}>
                {house?.location.address}, {house?.location.ward},
                {house?.location.district}, {house?.location.city}
              </Text>
            </View>
          </View>

          {/* Giá, diện tích, và thời gian */}
          <View style={style.additionalInfoContainer}>
            <View style={style.infoItem}>
              <Icon name="attach-money" size={18} color="green" />
              <Text style={style.price}>
                {house?.price.toLocaleString("vi-VN")} triệu/tháng
              </Text>
            </View>
            <View style={style.infoItem}>
              <Icon name="square-foot" size={18} color="gray" />
              <Text style={style.area}>{house?.size} m²</Text>
            </View>
            <View style={style.infoItem}>
              <Icon name="schedule" size={18} color="gray" />
              <Text style={style.timePosted}>49 phút trước</Text>
            </View>
          </View>
        </View>

        {/* Đường kẻ ngang */}
        <View style={style.separator}></View>

        {/* Thêm thông tin chủ nhà trọ */}
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
                <Text style={style.ownerZalo}>Nhắn Zalo</Text>
              </View>
            </View>
          </View>
        )}

        {/* Đường kẻ ngang */}
        <View style={style.separator}></View>

        {/* Container cho tiện ích */}
        <View style={(style.amenitiesContainer, { paddingHorizontal: 20 })}>
          <Text style={style.amenitiesTitle}>Tiện ích</Text>
          <View style={style.amenitiesList}>
            {house?.amenities &&
              Object.keys(house.amenities).map((key, index) => (
                <Text key={index} style={style.amenityItem}>
                  {key}
                </Text>
              ))}
          </View>
        </View>

        {/* Đường kẻ ngang */}
        <View style={style.separator}></View>

        {/* Container cho thông tin chi tiết về căn hộ */}
        <View
          style={(style.additionalDetailsContainer, { paddingHorizontal: 20 })}
        >
          <Text style={style.additionalDetailsTitle}>Thông Tin Chi Tiết</Text>
          <Text style={style.detailText}>{house?.description}</Text>
        </View>

        {/* Đường kẻ ngang */}
        <View style={style.separator}></View>

        {/* Container cho bình luận */}
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

      {/* Button Container */}
      <View style={style.buttonContainer}>
      <TouchableOpacity
    style={style.bookNowBtn}
    onPress={() => navigation.navigate("booking")} // Điều hướng đến BookingScreen
  >
    <Text style={{ color: COLORS.white }}>Đặt Phòng</Text>
  </TouchableOpacity>
        <TouchableOpacity style={style.circleButton}>
          <Icon name="message" size={20} color={COLORS.dark} />
        </TouchableOpacity>
        <TouchableOpacity style={style.circleButton}>
          <Icon name="phone" size={20} color={COLORS.dark} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
    marginTop: 10,
    marginLeft: 10,
    alignItems: "center",
  },
  bookNowBtn: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    borderRadius: 10,
    paddingHorizontal: 20,
    width: width * 0.5,
  },
  circleButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "light",
    marginHorizontal: 25, // Mỗi nút cách nhau 5px từ hai bên, tổng cộng 10px
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
});

export default Detail;