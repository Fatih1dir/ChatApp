import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    margin: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
  },
  chatName: {
    fontSize: 18,
    margin: 0,
  },
  chatImage: {
    width: 40, // Set the desired width
    height: 40, // Set the desired height
    borderRadius: 20, // Set half of the width and height to make it a circle
    marginRight: 10, // Adjust as needed for spacing
  },
  participants: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
    marginLeft:5
  },
  updatedAt: {
    fontSize: 14,
    color: "#777",
  },
  lastMessage: {
    fontSize: 16,
  },
});
