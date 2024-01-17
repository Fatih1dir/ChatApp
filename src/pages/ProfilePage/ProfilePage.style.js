import { StyleSheet } from "react-native";
export default styles = StyleSheet.create({
     container: {
    flex: 1,
    backgroundColor: "lightgrey",
    padding: 16,
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  blankProfileCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
  },
  inputContainer: {
    backgroundColor: "lightgrey",
    marginTop: 20,
  },
  bottomButtonsContainer: {
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    margin: 10,
    padding: 5,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    maxHeight: 50,
  },
  picker: {
    padding: 10,
    color: "black",
    flex: 1,
  },
  DateinputContainer: {
    padding: 5,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  dateInput: {
    flex: 1,
    padding:10,
  },
  profilePicContainer: {
    position: 'relative',
  },

  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'grey',
    borderRadius: 15, // Adjust the value as needed
    padding: 5,
  },
  });