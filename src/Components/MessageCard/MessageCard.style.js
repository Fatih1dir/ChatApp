import { StyleSheet } from "react-native";
export default StyleSheet.create({
    container: {
        // Your common styles for the message card container
        padding: 10,
        marginBottom: 5,
        borderRadius: 8,
        maxWidth: '80%', // Adjust the maximum width as needed
      },
  inner_container: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  user: {
    color: "black",
    padding: 5,
  },
  date: {
    color: "white",
    padding: 5,
    fontStyle: "italic",
  },
  title: {
    color: "white",
    padding: 5,
  },
  footer: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "white",
    borderRadius: 10,
    flex: 1,
    padding: 5,
    justifyContent: "space-between",
  },
  justifyRight: {
    alignSelf: "flex-end",
    backgroundColor: "#1ac0c6", // Example background color for messages sent by the current user
  },
  justifyLeft: {
    alignSelf: "flex-start",
    backgroundColor: "#e0e0e0", // Example background color for messages sent by others
  },
});
