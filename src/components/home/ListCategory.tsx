import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";

interface ListCategoryProps {
  setCategory: (category: string) => void; // Hàm truyền từ HomeScreen
}

const ListCategory: React.FC<ListCategoryProps> = ({ setCategory }) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Icon mapping
  const iconMapping: { [key: string]: string } = {
    Single: "person",
    Double: "group",
    Shared: "people",
    Apartment: "apartment",
    Dormitory: "hotel",
    Default: "home",
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://be-android-project.onrender.com/api/post/get-room-types");
      if (response.status === 200) {
        setCategories(response.data);
        setSelectedCategory(response.data[0]);
        setCategory(response.data[0]); // Cập nhật danh mục khi tải lần đầu
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
        <ActivityIndicator size="large" color="#e21f6d" />
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
                color={selectedCategory === category ? "#fff" : "#e21f6d"}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextSelected,
                ]}
              >
                {category}
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
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#e21f6d",
    borderRadius: 20,
    marginRight: 10,
  },
  categorySelected: {
    backgroundColor: "#e21f6d",
  },
  categoryText: {
    marginLeft: 5,
    color: "#e21f6d",
  },
  categoryTextSelected: {
    color: "#fff",
  },
});

export default ListCategory;
