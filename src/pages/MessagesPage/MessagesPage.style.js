import { StyleSheet } from "react-native";
export default styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        padding: 16,
      },
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        paddingTop: 8,
      },
      input: {
        flex: 1,
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        paddingHorizontal: 8,
        marginRight: 8,
      },
      sendButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
      },
      sendButtonText: {
        color: "white",
        fontWeight: "bold",
      },
      inputTextcontainer: {
        padding: 5,
        margin: 10,
        backgroundColor: "white",
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        margin:10,
      },
      input: {
        flex: 1,
        padding:10,
      },
  });