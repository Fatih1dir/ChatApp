import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  userView: {
    flexDirection: "row",
    alignItems: "center",
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
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
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#F9B233", // Set your desired background color
    borderRadius: 30, // Adjust the borderRadius based on your preference
    elevation: 5, // Add elevation for a shadow effect (Android only)
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  blankProfileCircle: {
    width: 50,
    height: 50,
    borderWidth: .5,
    borderRadius: 25,
  },
  text: {
    fontSize: 15,
    textAlign: "center",
    color: "black",
    paddingTop: 20,
    position: "relative",
    top: 200,
    
  }

});
