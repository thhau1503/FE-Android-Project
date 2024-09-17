import React from "react";
import { Button, ScrollView, View } from "react-native";
import ListCategory from "./ListCategory";
import ListProduct from "./ListProduct";
import Header from "./Header";
const HomeScreen = ({ navigation }: any) => {
  return (
    <View style={{ paddingHorizontal: 15 }}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ListCategory />
        <ListProduct />
      </ScrollView>
    </View>
  );
};
export default HomeScreen;
