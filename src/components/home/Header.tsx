import { Image, Text, View, StyleSheet } from "react-native";
import React from "react";
("react");
const Header = () => {
  return (
    <View>
      <View style={styles.container}>
        <View>
          <Text style={styles.title}>mosoftvn</Text>
        </View>
        <View>
          <Image
            style={{ width: 50, height: 50 }}
            source={require("../../../assets/images/viet-nam.png")}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "yellow",
    alignItems: "center",
    // paddingLeft: 15,
    // paddingRight: 15,
    marginTop: 20,
  },
  title: {
    color: "#FF0000",
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
  },
});

export default Header;
