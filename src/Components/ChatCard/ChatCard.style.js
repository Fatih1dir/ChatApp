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
  },
  headerLeft: {
    flexDirection: "row",
  },
  chatName: {
    fontSize: 18,
    margin: 0,
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
