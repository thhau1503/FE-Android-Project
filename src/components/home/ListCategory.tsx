import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

interface ListCategoryProps {
  setCategory: (category: string) => void; // Hàm truyền từ HomeScreen
}

const ListCategory: React.FC<ListCategoryProps> = ({ setCategory }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All"); // Mặc định là "All"

  // Icon mapping
  const iconMapping: { [key: string]: string } = {
    Single: "person",
    Double: "group",
    Shared: "people",
    Apartment: "apartment",
    Dormitory: "hotel",
    All: "apps", // Icon cho "Tất Cả"
    Default: "home",
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://be-android-project.onrender.com/api/post/get-room-types"
      );
      if (response.status === 200) {
        setCategories(["All", ...response.data]); // Thêm "All" vào đầu danh sách
        setSelectedCategory("All"); // Mặc định chọn "Tất Cả"
        setCategory("All"); // Cập nhật danh mục là "All"
      }
    } catch (error) {
      console.error("Error fetching room types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCategory(category); // Cập nhật danh mục được chọn
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh mục</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categorySelected,
              ]}
              onPress={() => handleCategorySelect(category)}
            >
              <MaterialIcons
                name={iconMapping[category] || iconMapping.Default}
                size={24}
                color={selectedCategory === category ? "#fff" : "#000"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected,
                ]}
              >
                {category === "All" ? "Tất Cả" : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000", // Văn bản màu đen
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#000", // Viền màu đen
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#fff", // Nền màu trắng
  },
  categorySelected: {
    backgroundColor: "#000", // Nền màu đen khi được chọn
  },
  categoryText: {
    marginLeft: 5,
    color: "#000", // Văn bản màu đen
  },
  categoryTextSelected: {
    color: "#fff", // Văn bản màu trắng khi được chọn
  },
});


export default ListCategory;
