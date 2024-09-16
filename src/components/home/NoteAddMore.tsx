import { Text, View } from "react-native";

type NoteAddMoreProps = {
  tile: string;
};

const NoteAddMore = ({ tile }: NoteAddMoreProps) => {
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
        <Text style={{ color: "red", fontWeight: "bold" }}>{tile}</Text>
        <Text>See More</Text>
      </View>
    </View>
  );
};

export default NoteAddMore;
