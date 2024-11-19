import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AddListingScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Thêm trọ mới</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddListingScreen;
