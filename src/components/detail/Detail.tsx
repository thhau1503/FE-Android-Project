import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  Text,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";

const Detail = ({ route }: any) => {
  const { item } = route.params;
  const [isModal, setIsModal] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const updateQuantity = (quantity: string, typeChange: string) => {
    let qty = 0;
    if (typeChange === "plus") {
      qty = parseInt(quantity) + 1;
    } else if (typeChange === "minus") {
      qty = parseInt(quantity) - 1;
      if (qty <= 0) {
        qty = 0;
      }
    }
    setQuantity(qty.toString());
  };
  return (
    <>
      <StatusBar translucent={true} backgroundColor="transparent" />
      <Image
        source={{
          uri: "https://storage.googleapis.com/digital-platform/hinh_anh_Can_ho_mau_Vinhomes_Smart_City_nhin_la_muon_o_ngay_so_3_4ee32c4231/hinh_anh_Can_ho_mau_Vinhomes_Smart_City_nhin_la_muon_o_ngay_so_3_4ee32c4231.jpg",
        }}
        style={{ width: "100%", height: "50%" }}
      />
      <View style={styles.des}>
        <Text style={{ color: "#fff" }}> Product name: {item.title}</Text>
      </View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => {
          setIsModal(true);
        }}
      >
        <Text style={{ textAlign: "center", color: "#fff" }}>Buy Now!</Text>
      </TouchableOpacity>
      {isModal ? (
        <View style={styles.modal}>
          <Text style={{ fontWeight: "bold" }}>Quantity :</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => {
                updateQuantity(quantity, "plus");
              }}
              style={{ width: "25%", backgroundColor: "#e21f6d" }}
            >
              <Text
                style={{ textAlign: "center", color: "#fff", fontSize: 30 }}
              >
                +
              </Text>
            </TouchableOpacity>
            <TextInput
              style={{ borderWidth: 1, width: "50%" }}
              keyboardType="numeric"
              textAlign="center"
              value={quantity}
              onChangeText={(value) => {
                setQuantity(value);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                updateQuantity(quantity, "minus");
              }}
              style={{ width: "25%", backgroundColor: "#e21f6d" }}
            >
              <Text
                style={{ textAlign: "center", color: "#fff", fontSize: 30 }}
              >
                -
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#e21f6d",
              padding: 15,
              borderRadius: 30,
              marginTop: 30,
            }}
            onPress={() => {
              setIsModal(false);
            }}
          >
            <Text style={{ textAlign: "center", color: "#fff" }}>
              Add to cart
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        ""
      )}
    </>
  );
};
const styles = StyleSheet.create({
  des: {
    backgroundColor: "grey",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 30,
    position: "absolute",
    top: "45%",
    width: "100%",
    height: "100%",
  },
  modal: {
    backgroundColor: "#fff",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    padding: 30,
    position: "absolute",
    top: "45%",
    width: "100%",
    height: "100%",
  },
  btn: {
    backgroundColor: "#e21f6d",
    padding: 15,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
export default Detail;
