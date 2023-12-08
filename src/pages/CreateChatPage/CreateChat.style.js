import { StyleSheet } from "react-native";

export default styles= StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
      },
      userView: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingVertical: 8,
        marginBottom: 8,
      },
      usernameText: {
        fontSize: 16,
        fontWeight: "bold",
      },
      addButton: {
        padding: 8,
        borderRadius: 5,
      },
      buttonText: {
        color: "#fff",
        fontWeight: "bold",
      },
      buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 16,
      },
      floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#F9B233', // Set your desired background color
        borderRadius: 30, // Adjust the borderRadius based on your preference
        elevation: 5, // Add elevation for a shadow effect (Android only)
      },
}
)