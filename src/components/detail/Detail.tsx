import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const { width } = Dimensions.get('screen');

// Thêm trực tiếp các giá trị màu
const COLORS = {
  white: '#FFF',
  dark: '#000',
  light: '#f6f6f6',
  grey: '#A9A9A9',
  blue: '#5f82e6',
  red: 'red',
  transparent: 'rgba(0,0,0,0)',
  green: '#4CAF50',
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
  amenities: {
    wifi: boolean;
    airConditioner: boolean;
    heater: boolean;
    kitchen: boolean;
    parking: boolean;
  };
  images: string[];
  landlord: string;
  roomType: string;
  size: number;
}

// Kiểu dữ liệu của các props mà component nhận vào
interface RentalHomeDetailProps {
  navigation: any;
  route: any; // Route để lấy params từ màn hình trước
}

const Detail: React.FC<RentalHomeDetailProps> = ({ navigation, route }) => {
  const { postId } = route.params; // Lấy ID bài viết từ params
  if (!postId) {
    console.error("postId is undefined");
    return <Text>Lỗi: postId không hợp lệ</Text>;
  }

  const [house, setHouse] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState([
    { id: '1', user: 'Người dùng A', text: 'Trọ sạch sẽ, giá hợp lý học sinh, sinh viên.' },
    { id: '2', user: 'Người dùng B', text: 'Giá tốt, gần trường học.' },
  ]);

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, { id: String(comments.length + 1), user: 'Bạn', text: comment }]);
      setComment('');
    }
  };

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`https://be-android-project.onrender.com/api/post/${postId}`);
        setHouse(response.data);
        setLoading(false);
      } catch (error) {
        setError('Lỗi khi lấy dữ liệu bài viết.');
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.blue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  const InteriorCard: React.FC<{ uri: string }> = ({ uri }) => {
    return <Image source={{ uri }} style={style.interiorImage} />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* House image */}
        {house && (
          <View style={style.backgroundImageContainer}>
            <ImageBackground style={style.backgroundImage} source={{ uri: house.images[0] }}>
              <View style={style.header}>
                <View style={style.headerBtn}>
                  <Icon
                    name="arrow-back-ios"
                    size={20}
                    onPress={() => navigation.goBack()}
                  />
                </View>
                <View style={style.headerBtn}>
                  <Icon name="favorite" size={20} color={COLORS.red} />
                </View>
              </View>
            </ImageBackground>

            {/* Virtual Tag View */}
            <View style={style.virtualTag}>
              <Text style={{ color: COLORS.white }}>Virtual tour</Text>
            </View>
          </View>
        )}

        <View style={style.detailsContainer}>
          {/* Tên và giá */}
          <View style={{ marginTop: 10 }}>
            <Text style={style.houseTitle}>{house?.title}</Text>
            <Text style={style.price}>Giá: {house?.price} VND</Text>
          </View>

          {/* Danh sách ảnh nội thất */}
          <View style={{ marginTop: 20 }}>
            <FlatList
              data={house?.images}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => <InteriorCard uri={item} />}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
          </View>

          {/* Tiện ích */}
          <View style={style.amenitiesContainer}>
            <Text style={style.amenitiesTitle}>Tiện ích</Text>
            <View style={style.amenitiesList}>
              {house?.amenities && Object.keys(house.amenities).map((key, index) => (
                <Text key={index} style={style.amenityItem}>
                  {key}
                </Text>
              ))}
            </View>
          </View>

          {/* Thông tin chi tiết */}
          <View style={style.additionalDetailsContainer}>
            <Text style={style.additionalDetailsTitle}>Thông Tin Chi Tiết</Text>
            <Text style={style.detailText}>{house?.description}</Text>
          </View>

          {/* Nút đặt phòng và các nút khác */}
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

          {/* Bình luận */}
          <View style={style.commentSection}>
            <TextInput
              style={style.commentInput}
              placeholder="Hãy nhập gì đó..."
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity onPress={handleCommentSubmit} style={style.submitBtn}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  backgroundImageContainer: {
    elevation: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    height: 350,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerBtn: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  virtualTag: {
    top: -20,
    width: 120,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: COLORS.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  houseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.red,
    marginTop: 5,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  amenitiesContainer: {
    marginTop: 20,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  amenityItem: {
    backgroundColor: COLORS.blue,
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 5,
    color: COLORS.white,
  },
  additionalDetailsContainer: {
    marginTop: 20,
  },
  additionalDetailsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  detailText: {
    marginLeft: 5,
    color: COLORS.grey,
  },
  interiorImage: {
    width: width / 3 - 20,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
  },
  bookNowBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.green,
    borderRadius: 10,
    paddingHorizontal: 20,
    width: width * 0.5,
  },
  circleButton: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
    marginLeft: 10,
  },
  commentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  submitBtn: {
    backgroundColor: COLORS.blue,
    padding: 10,
    borderRadius: 20,
  },
  submitBtnText: {
    color: COLORS.white,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  commentContent: {
    marginLeft: 10,
  },
  commentUser: {
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  commentText: {
    color: COLORS.grey,
  },
});

export default Detail;
