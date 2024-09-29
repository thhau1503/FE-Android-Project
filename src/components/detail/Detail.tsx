import React, { useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

// Định nghĩa kiểu User
interface User {
  id: string;
  user: string;
  text: string;
}

// Kiểu dữ liệu của các props mà component nhận vào
interface RentalHomeDetailProps {
  navigation: any; 
}

const Detail: React.FC<RentalHomeDetailProps> = ({ navigation }) => {
  const [comment, setComment] = useState<string>('');
  const [comments, setComments] = useState<User[]>([
    { id: '1', user: 'Người dùng A', text: 'Trọ sạch sẽ, giá hợp lý học sinh, sinh viên.' },
    { id: '2', user: 'Người dùng B', text: 'Giá tốt, gần trường học.' },
  ]);

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, { id: String(comments.length + 1), user: 'Bạn', text: comment }]);
      setComment('');
    }
  };

  // Dữ liệu ảnh trực tiếp từ URL
  const house = {
    id: '1',
    title: 'Phòng Trọ Dành Cho Sinh Viên',
    location: 'Gần bách hóa xanh, Gần Chợ, Trường học',
    price: '2500000VND',
    image: { uri: 'https://th.bing.com/th/id/OIP.DTNA5m_KQk-kpDu7fg-eeAHaEW?w=298&h=180&c=7&r=0&o=5&pid=1.7' }, // Sử dụng URL cho ảnh chính
    details:
      'Tòa nhà thang máy, hầm xe siêu rộng, camera an ninh, khu dân trí cao',
    amenities: ['Gần bách hóa xanh', 'Gần Chợ, Trường học'], // Thêm các tiện ích ở đây
    additionalDetails: [
      'Nội thất: máy lạnh, tủ quần áo, tủ lạnh, kệ bếp, máy nóng lạnh',
      'Điện 3k5/kwh',
      'Nước 100k/người',
      'Chỗ để xe free 2 xe',
      'Dịch vụ vệ sinh và dịch vụ khác',
    ],
    interiors: [
      { uri: 'https://th.bing.com/th/id/OIP.DTNA5m_KQk-kpDu7fg-eeAHaEW?w=298&h=180&c=7&r=0&o=5&pid=1.7' }, // Sử dụng URL cho ảnh nội thất
      { uri: 'https://th.bing.com/th/id/OIP.DTNA5m_KQk-kpDu7fg-eeAHaEW?w=298&h=180&c=7&r=0&o=5&pid=1.7' },
      { uri: 'https://th.bing.com/th/id/OIP.DTNA5m_KQk-kpDu7fg-eeAHaEW?w=298&h=180&c=7&r=0&o=5&pid=1.7' },
    ],
  };

  const InteriorCard: React.FC<{ interior: { uri: string } }> = ({ interior }) => {
    return <Image source={interior} style={style.interiorImage} />;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* House image */}

        <View style={style.backgroundImageContainer}>
          <ImageBackground style={style.backgroundImage} source={house.image}>
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

        <View style={style.detailsContainer}>
          {/* Tên và giá */}
          <View style={{ marginTop: 10 }}>
            <Text style={style.houseTitle}>{house.title}</Text>
            <Text style={style.price}>Giá: {house.price}</Text>
          </View>

          {/* Danh sách ảnh nội thất */}
          <View style={{ marginTop: 20 }}>
            <FlatList
              data={house.interiors}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => <InteriorCard interior={item} />}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
          </View>

          {/* Tiện ích */}
          <View style={style.amenitiesContainer}>
            <Text style={style.amenitiesTitle}>Tiện ích</Text>
            <View style={style.amenitiesList}>
              {house.amenities.map((amenity, index) => (
                <Text key={index} style={style.amenityItem}>
                  {amenity}
                </Text>
              ))}
            </View>
          </View>

          {/* Thông tin chi tiết */}
          <View style={style.additionalDetailsContainer}>
            <Text style={style.additionalDetailsTitle}>Thông Tin Chi Tiết</Text>
            <View>
              {house.additionalDetails.map((detail, index) => (
                <View key={index} style={style.detailItem}>
                  <Icon name="check" size={16} color={COLORS.blue} />
                  <Text style={style.detailText}>{detail}</Text>
                </View>
              ))}
            </View>
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
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
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
  footer: {
    height: 70,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
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
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 20,
    alignItems: 'center',
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
