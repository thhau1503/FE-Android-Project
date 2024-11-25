import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const FilterScreen = ({ navigation, route }: any) => {
  // Dữ liệu mẫu cho từng thành phố
  const cityData: { [key: string]: { districts: string[]; wards: string[] } } =
    {
      "Hồ Chí Minh": {
        districts: [
          "Tất cả",
          "Quận 1",
          "Quận 2",
          "Quận 3",
          "Quận 4",
          "Quận 5",
          "Quận 6",
          "Quận 7",
          "Quận 8",
          "Quận 9",
          "Quận 10",
          "Quận 11",
          "Quận 12",
          "Bình Thạnh",
          "Gò Vấp",
          "Phú Nhuận",
          "Tân Bình",
          "Tân Phú",
          "Thủ Đức",
          "Bình Tân",
          "Củ Chi",
          "Hóc Môn",
          "Bình Chánh",
          "Nhà Bè",
          "Cần Giờ",
        ],
        wards: [
          "Tất cả",
          "Phường 1",
          "Phường 2",
          "Phường 3",
          "Phường 4",
          "Phường 5",
          "Phường 6",
          "Phường 7",
          "Phường 8",
          "Phường 9",
          "Phường 10",
          "Phường 11",
          "Phường 12",
          "Phường 13",
          "Phường 14",
          "Phường 15",
        ],
      },
      "Hà Nội": {
        districts: [
          "Tất cả",
          "Hoàn Kiếm",
          "Ba Đình",
          "Đống Đa",
          "Cầu Giấy",
          "Hai Bà Trưng",
          "Hoàng Mai",
          "Long Biên",
          "Thanh Xuân",
          "Hà Đông",
          "Nam Từ Liêm",
          "Bắc Từ Liêm",
          "Sóc Sơn",
          "Đông Anh",
          "Thanh Trì",
        ],
        wards: [
          "Tất cả",
          "Phường Hàng Bài",
          "Phường Cửa Nam",
          "Phường Kim Mã",
          "Phường Láng Hạ",
          "Phường Bách Khoa",
          "Phường Giáp Bát",
          "Phường Sài Đồng",
          "Phường Mễ Trì",
          "Phường Văn Quán",
        ],
      },
      "Vũng Tàu": {
        districts: [
          "Tất cả",
          "Thành phố Vũng Tàu",
          "Thị xã Phú Mỹ",
          "Huyện Long Điền",
          "Huyện Đất Đỏ",
          "Huyện Xuyên Mộc",
          "Huyện Côn Đảo",
        ],
        wards: [
          "Tất cả",
          "Phường 1",
          "Phường 2",
          "Phường Thắng Tam",
          "Phường Thắng Nhì",
          "Phường Nguyễn An Ninh",
          "Phường Rạch Dừa",
        ],
      },
      "Hải Phòng": {
        districts: [
          "Tất cả",
          "Hồng Bàng",
          "Lê Chân",
          "Ngô Quyền",
          "Kiến An",
          "Hải An",
          "Đồ Sơn",
          "Dương Kinh",
          "Thủy Nguyên",
          "An Dương",
          "Tiên Lãng",
          "Vĩnh Bảo",
          "Cát Hải",
          "Bạch Long Vĩ",
        ],
        wards: [
          "Tất cả",
          "Phường Minh Khai",
          "Phường Trần Nguyên Hãn",
          "Phường Đông Khê",
          "Phường Lạch Tray",
          "Phường Đằng Giang",
          "Phường An Biên",
        ],
      },
      Huế: {
        districts: [
          "Tất cả",
          "Thành phố Huế",
          "Huyện Phong Điền",
          "Huyện Quảng Điền",
          "Huyện Phú Vang",
          "Huyện Phú Lộc",
          "Thị xã Hương Thủy",
          "Thị xã Hương Trà",
        ],
        wards: [
          "Tất cả",
          "Phường Phú Hội",
          "Phường Phú Nhuận",
          "Phường Vỹ Dạ",
          "Phường Thuận Thành",
          "Phường Kim Long",
          "Phường Hương Long",
        ],
      },
      "Tất cả": {
        districts: ["Tất cả"],
        wards: ["Tất cả"],
      },
    };

  const roomTypes = ["Single", "Double", "Shared", "Apartment", "Dormitory"];
  const prices = [
    "Tất cả",
    "Dưới 1 triệu",
    "1 - 2 triệu",
    "2 - 3 triệu",
    "3 - 5 triệu",
    "5 - 7 triệu",
    "7 - 10 triệu",
    "Trên 10 triệu",
  ];

  // State lưu trữ bộ lọc
  const [selectedCity, setSelectedCity] = useState<string>("Hồ Chí Minh");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Tất cả");
  const [selectedWard, setSelectedWard] = useState<string>("Tất cả");
  const [selectedRoomType, setSelectedRoomType] = useState<string>("Tất cả");
  const [selectedPrice, setSelectedPrice] = useState<string>("Tất cả");
  // Thêm state vào phần đầu của component
const [showAllDistricts, setShowAllDistricts] = useState(false); // Quản lý trạng thái Quận
const [showAllWards, setShowAllWards] = useState(false); // Quản lý trạng thái Phường


  // Hàm xử lý khi thay đổi thành phố
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedDistrict("Tất cả"); // Reset district khi thành phố thay đổi
    setSelectedWard("Tất cả"); // Reset ward khi thành phố thay đổi
  };

  // Hàm xử lý khi nhấn nút Áp dụng
  const handleApplyFilter = () => {
    const filterData: any = {
      city: selectedCity !== "Tất cả" ? selectedCity : undefined,
      district: selectedDistrict !== "Tất cả" ? selectedDistrict : undefined,
      ward: selectedWard !== "Tất cả" ? selectedWard : undefined,
      roomType: selectedRoomType !== "Tất cả" ? selectedRoomType : undefined,
    };

    if (selectedPrice !== "Tất cả") {
      const priceRange = selectedPrice.match(/\d+/g)?.map(Number); // Tìm số trong chuỗi
      if (priceRange) {
        if (selectedPrice.includes("Dưới")) {
          filterData.priceMax = priceRange[0] * 1_000_000;
        } else if (selectedPrice.includes("Trên")) {
          filterData.priceMin = priceRange[0] * 1_000_000;
        } else if (priceRange.length === 2) {
          filterData.priceMin = priceRange[0] * 1_000_000;
          filterData.priceMax = priceRange[1] * 1_000_000;
        }
      }
    }

    // Gửi dữ liệu về HomeScreen qua route.params
    route.params?.onApplyFilter(filterData);

    navigation.goBack(); // Quay lại HomeScreen
  };

  const currentDistricts = cityData[selectedCity]?.districts || ["Tất cả"];
  const currentWards = cityData[selectedCity]?.wards || ["Tất cả"];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bộ lọc</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Loại phòng */}
        <Text style={styles.sectionTitle}>Loại phòng</Text>
        <View style={styles.filterOptions}>
          {roomTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionButton,
                selectedRoomType === type && styles.optionSelected,
              ]}
              onPress={() => setSelectedRoomType(type)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedRoomType === type && styles.optionTextSelected,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Thành phố */}
        <Text style={styles.sectionTitle}>Thành phố</Text>
        <View style={styles.filterOptions}>
          {Object.keys(cityData).map((city) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.optionButton,
                selectedCity === city && styles.optionSelected,
              ]}
              onPress={() => handleCityChange(city)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedCity === city && styles.optionTextSelected,
                ]}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quận */}
        <Text style={styles.sectionTitle}>Quận</Text>
        <View style={styles.filterOptions}>
          {(showAllDistricts
            ? currentDistricts
            : currentDistricts.slice(0, 5)
          ).map((district) => (
            <TouchableOpacity
              key={district}
              style={[
                styles.optionButton,
                selectedDistrict === district && styles.optionSelected,
              ]}
              onPress={() => setSelectedDistrict(district)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedDistrict === district && styles.optionTextSelected,
                ]}
              >
                {district}
              </Text>
            </TouchableOpacity>
          ))}
          {currentDistricts.length > 5 && (
            <TouchableOpacity
              onPress={() => setShowAllDistricts(!showAllDistricts)}
            >
              <Text style={styles.toggleText}>
                {showAllDistricts ? "Ẩn bớt" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Phường */}
        <Text style={styles.sectionTitle}>Phường</Text>
        <View style={styles.filterOptions}>
          {(showAllWards ? currentWards : currentWards.slice(0, 5)).map(
            (ward) => (
              <TouchableOpacity
                key={ward}
                style={[
                  styles.optionButton,
                  selectedWard === ward && styles.optionSelected,
                ]}
                onPress={() => setSelectedWard(ward)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedWard === ward && styles.optionTextSelected,
                  ]}
                >
                  {ward}
                </Text>
              </TouchableOpacity>
            )
          )}
          {currentWards.length > 5 && (
            <TouchableOpacity onPress={() => setShowAllWards(!showAllWards)}>
              <Text style={styles.toggleText}>
                {showAllWards ? "Ẩn bớt" : "Xem thêm"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Khoảng giá */}
        <Text style={styles.sectionTitle}>Khoảng giá</Text>
        <View style={styles.filterOptions}>
          {prices.map((price) => (
            <TouchableOpacity
              key={price}
              style={[
                styles.optionButton,
                selectedPrice === price && styles.optionSelected,
              ]}
              onPress={() => setSelectedPrice(price)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedPrice === price && styles.optionTextSelected,
                ]}
              >
                {price}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Nút áp dụng */}
      <TouchableOpacity style={styles.applyButton} onPress={handleApplyFilter}>
        <Text style={styles.applyButtonText}>Áp dụng</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  toggleText: {
    fontSize: 14,
    color: "#e21f6d", // Màu nổi bật
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 5, // Khoảng cách trên/dưới
    paddingHorizontal: 10, // Khoảng cách trái/phải
    borderWidth: 1, // Đường viền
    borderColor: "#e21f6d",
    borderRadius: 15, // Bo góc
    marginTop: 5, // Khoảng cách với nội dung trên
    alignSelf: "flex-start", // Căn trái
  },
  optionSelected: {
    backgroundColor: "#e21f6d",
    borderColor: "#e21f6d",
  },
  optionText: {
    fontSize: 14,
    color: "#000",
  },
  optionTextSelected: {
    color: "#fff",
  },
  applyButton: {
    backgroundColor: "#e21f6d",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 10,
  },
  applyButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FilterScreen;
