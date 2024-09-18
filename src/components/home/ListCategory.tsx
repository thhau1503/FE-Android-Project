import { Image, Text, View, StyleSheet } from "react-native";
import React from "react";
import { ScrollView } from "react-native";
import NoteAddMore from "./NoteAddMore";
const ListCategory = () => {
  return (
    <>
      <NoteAddMore tile="Category" />
      <View style={styles.container}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.item}>
            <Image
              style={styles.photoItem}
              source={{
                uri: "https://media.vneconomy.vn/w800/images/upload/2024/09/12/can-ho-chung-cu-la-gi-ngoquocdung-com.jpg",
              }}
            />
            <View style={styles.cateOver}>
              <Text style={{ textAlign: "center" }}>Căn hộ nữ</Text>
            </View>
          </View>
          <View style={styles.item}>
            <Image
              style={styles.photoItem}
              source={{
                uri: "https://media.vneconomy.vn/w800/images/upload/2024/09/12/can-ho-chung-cu-la-gi-ngoquocdung-com.jpg",
              }}
            />
            <View style={styles.cateOver}>
              <Text style={{ textAlign: "center" }}>Nhà trọ</Text>
            </View>
          </View>
          <View style={styles.item}>
            <Image
              style={styles.photoItem}
              source={{
                uri: "https://media.vneconomy.vn/w800/images/upload/2024/09/12/can-ho-chung-cu-la-gi-ngoquocdung-com.jpg",
              }}
            />
            <View style={styles.cateOver}>
              <Text style={{ textAlign: "center" }}>Căn hộ </Text>
            </View>
          </View>
          <View style={styles.item}>
            <Image
              style={styles.photoItem}
              source={{
                uri: "https://media.vneconomy.vn/w800/images/upload/2024/09/12/can-ho-chung-cu-la-gi-ngoquocdung-com.jpg",
              }}
            />
            <View style={styles.cateOver}>
              <Text style={{ textAlign: "center" }}>Mini house</Text>
            </View>
          </View>
          <View style={styles.item}>
            <Image
              style={styles.photoItem}
              source={{
                uri: "https://media.vneconomy.vn/w800/images/upload/2024/09/12/can-ho-chung-cu-la-gi-ngoquocdung-com.jpg",
              }}
            />
            <View style={styles.cateOver}>
              <Text style={{ textAlign: "center" }}>Kí túc xá</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  photoItem: {
    width: 100,
    height: 100,
    // padding: 0,
    // borderRadius: 10,
    // overflow: "hidden",
    // borderColor: "black",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  item: {
    marginRight: 10,
    borderRadius: 10,
    padding: 5,
    // borderWidth: 1,
  },
  cateOver: {
    backgroundColor: "rgb(210, 210, 210)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
});
export default ListCategory;
