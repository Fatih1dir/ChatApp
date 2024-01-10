import { StyleSheet } from "react-native";
export default styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    imageContainer: {
      marginRight: 10,
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25, // Make it a circle
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
    },
    username: {
      marginRight: 10,
    },
    addButton: {
      backgroundColor: "grey",
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
      justifyContent: "center",
      alignItems: "center",
    },
  });