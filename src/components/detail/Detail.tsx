import React, { useState, useEffect } from "react";
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
import Video from "react-native-video";
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

// Định nghĩa kiểu dữ liệu bài viết
interface Post {
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    district: string;
    ward: string;
    geoLocation: {
      latitude: number;
      longitude: number;
    };
  };
  landlord: string;
  roomType: string;
  size: number;
  availability: boolean;
  amenities: {
    wifi: boolean;
    airConditioner: boolean;
    heater: boolean;
    kitchen: boolean;
    parking: boolean;
  };
  additionalCosts: {
    electricity: number;
    water: number;
    internet: number;
    cleaning: number;
  };
  images: string[];
  videos: string[];
  averageRating: number;
  views: number;
  status: string;
}

// Định nghĩa kiểu dữ liệu cho người cho thuê
interface Landlord {
  username: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
}

// Kiểu dữ liệu của các props mà component nhận vào
interface RentalHomeDetailProps {
  navigation: any;
  route: any;
}

const Detail: React.FC<RentalHomeDetailProps> = ({ navigation, route }) => {
  const { postId } = route.params;

  const [house, setHouse] = useState<Post | null>(null);
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");

  const [comments, setComments] = useState([
    {
      id: "1",
      user: "Người dùng A",
      text: "Trọ sạch sẽ, giá hợp lý học sinh, sinh viên.",
    },
    { id: "2", user: "Người dùng B", text: "Giá tốt, gần trường học." },
  ]);

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([
        ...comments,
        { id: String(comments.length + 1), user: "Bạn", text: comment },
      ]);
      setComment("");
    }
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        // Gọi API để lấy thông tin bài viết
        const response = await axios.get(
          `https://be-android-project.onrender.com/api/post/${postId}`
        );
        setHouse(response.data);

        // Gọi API để lấy thông tin người cho thuê từ landlord ID
        const landlordId = response.data.landlord;
        if (landlordId) {
          const landlordResponse = await axios.get(
            `https://be-android-project.onrender.com/api/auth/user/${landlordId}`
          );
          setLandlord(landlordResponse.data); // Lưu thông tin người cho thuê
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
        <ActivityIndicator size="large" color={COLORS.blue} />
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
        {/* Hình ảnh căn hộ */}
        {house && (
          <View style={style.backgroundImageContainer}>
            <FlatList
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              data={house.images}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <ImageBackground
                  style={{
                    height: 450,
                    width: 450,
                    borderRadius: 20,
                  }}
                  resizeMode="cover"
                  source={{ uri: item }}
                >
                  <View style={style.header}>
                    <View style={style.headerBtn}>
                      <Icon
                        name="arrow-back-ios"
                        size={23}
                        onPress={() => navigation.goBack()}
                      />
                    </View>
                  </View>
                </ImageBackground>
              )}
            />
          </View>
        )}

        {/* Icon và các chức năng */}
        {house && (
          <View style={style.iconContainer}>
            <TouchableOpacity style={style.iconItem}>
              <Icon name="photo" size={24} color={COLORS.dark} />
              <Text style={style.iconText}>{house.images.length} Ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.iconItem}>
              <Icon name="videocam" size={24} color={COLORS.dark} />
              <Text style={style.iconText}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.iconItem}>
              <Icon name="map" size={24} color={COLORS.dark} />
              <Text style={style.iconText}>Bản đồ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={style.iconItem}>
              <Icon name="favorite" size={24} color={COLORS.red} />
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
                uri: landlord.avatar
                  ? landlord.avatar
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
        <View style={style.amenitiesContainer}>
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
        <View style={style.additionalDetailsContainer}>
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
        <TouchableOpacity style={style.bookNowBtn}>
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
    marginHorizontal: 23,
    marginTop: 20,
    height: 350,
    width: "90%",
  },
  headerBtn: {
    height: 40,
    width: 40,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingVertical: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
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
    marginTop: 5,
    fontSize: 13,
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
