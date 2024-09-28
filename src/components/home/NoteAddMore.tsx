import { useState } from "react";
import { Text, View } from "react-native";

type NoteAddMoreProps = {
  title: string;
  typeSeeMore: string;
};

const NoteAddMore = ({ title, typeSeeMore }: NoteAddMoreProps) => {
  const [titleVietnamese, setTitleVietnamese] = useState("");
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingTop: 15,
          paddingVertical: 15,
        }}
      >
        <Text style={{ color: "red", fontWeight: "bold" }}>{title}</Text>
        <Text>Xem thêm</Text>
      </View>
    </View>
  );
};

export default NoteAddMore;
