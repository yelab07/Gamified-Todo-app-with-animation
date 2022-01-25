import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  listContainer: {
    borderWidth: 1,
    color: "black",
    width: 250,
  },
  listItem: {
    borderBottomWidth: 1,
    color: "black",
    // flexDirection: "row",
    padding: 10,
    // marginBottom: 5,
  },
  leftAction: {
    backgroundColor: "blue",
  },
  textAction: {
    color: "white",
  },
});
export default styles;
