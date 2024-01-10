import { StyleSheet } from "react-native";
export default styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    marginRight: 10, // Add margin between user cards
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  username: {
    marginRight: 10,
    fontWeight: "bold",
  },
  });