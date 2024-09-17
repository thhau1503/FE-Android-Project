import React from "react";
import { Text, View } from "react-native";

const Waiting = () => {
  return (
    <>
      <View>
        <View
          style={{ width: "100%", height: 200, backgroundColor: "#d4d4d4" }}
        ></View>
        <View style={{ padding: 15 }}>
          <Text
            style={{
              width: "80%",
              height: 10,
              backgroundColor: "#d4d4d4",
              marginBottom: 10,
            }}
          ></Text>
          <Text
            style={{ width: "60%", height: 10, backgroundColor: "#d4d4d4" }}
          ></Text>
        </View>
      </View>
    </>
  );
};
export default Waiting;
