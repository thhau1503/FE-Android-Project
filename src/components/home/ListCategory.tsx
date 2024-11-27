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
<<<<<<< HEAD
        <ActivityIndicator size="large" color="#000" />
=======
        <ActivityIndicator size="large" color="#0d0307" />
>>>>>>> 65f39e1516be179debb9e5bb334aa6a186b5876f
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
<<<<<<< HEAD
                color={selectedCategory === category ? "#fff" : "#000"}
=======
                color={selectedCategory === category ? "#fff" : "#0e070a"}
>>>>>>> 65f39e1516be179debb9e5bb334aa6a186b5876f
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
<<<<<<< HEAD
    borderColor: "#000", // Viền màu đen
=======
    borderColor: "#0f0207",
>>>>>>> 65f39e1516be179debb9e5bb334aa6a186b5876f
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#fff", // Nền màu trắng
  },
  categorySelected: {
<<<<<<< HEAD
    backgroundColor: "#000", // Nền màu đen khi được chọn
  },
  categoryText: {
    marginLeft: 5,
    color: "#000", // Văn bản màu đen
=======
    backgroundColor: "#050203",
  },
  categoryText: {
    marginLeft: 5,
    color: "#12050a",
>>>>>>> 65f39e1516be179debb9e5bb334aa6a186b5876f
  },
  categoryTextSelected: {
    color: "#fff", // Văn bản màu trắng khi được chọn
  },
});


export default ListCategory;
