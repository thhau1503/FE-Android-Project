import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  AccessibilityInfo,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import NoteAddMore from "./NoteAddMore";
import Waiting from "./Waiting";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListProduct: React.FC = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  const getApi = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("token:", token);
      if (token) {
        const response = await axios.get(
          "https://be-android-project.onrender.com/api/post/getAll",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data);
      } else {
        navigation.navigate("login");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // const getAPI = async () => {}
  useEffect(() => {
    getApi();
  }, []);

  return (
    <>
      <NoteAddMore title="Sản phẩm" typeSeeMore="product" />
      <View style={{ backgroundColor: "rgba(240, 240, 240,0.2)" }}>
        {isLoading ? (
          <Waiting />
        ) : (
          <FlatList
            data={posts}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
            renderItem={({ item }: any) => (
              <View style={styles.item}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("detailItem", { item });
                  }}
                >
                  <Image
                    style={styles.photoItem}
                    source={{
                      uri: "https://www.treehugger.com/thmb/JWrVwio-VZbHdPlrbfuLo4Y6RgQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/th-house-oddo-architects-6-cc292e3b8a874f9e89893cf60f39b3f1.jpeg",
                    }}
                  />
                </TouchableOpacity>

                {/* <View style={styles.descriptionItem}>
                  <Text style={styles.desText}>{item.name}</Text>
                </View> */}
                <View style={styles.saleItem}>
                  <Text
                    style={{
                      color: "yellow",
                      textAlign: "center",
                    }}
                  >
                    30%
                  </Text>
                  <Text
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    sales
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 10,
                  }}
                >
                  <View>
                    <Text style={{ color: "black", paddingBottom: 15 }}>
                      {item.title}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={{ color: "#e21f6d" }}>đ{item.price}</Text>
                    <Text>Selled : 20</Text>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  photoItem: {
    width: "100%",
    height: 150,
    // zIndex: 100,
  },
  descriptionItem: {
    backgroundColor: "black",
    paddingVertical: 10,
  },
  desText: {
    color: "white",
    textAlign: "center",
  },
  saleItem: {
    backgroundColor: "rgba(0,0,0,0.7)",
    width: 60,
    height: 60,
    position: "absolute",
    padding: 7,
    top: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "column",
  },
  item: {
    marginBottom: 10,
    width: "45%",
    // borderWidth: 1,
    backgroundColor: "#fff",
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
  },
});

export default ListProduct;
