import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    fontSize:12
  },
  ImageContainer: {
  },
  inner_container: {
    justifyContent: "space-between",
    flexDirection: "row",
  },
  user: {
    color: "black",
    padding: 5,
    fontStyle:'italic'
  },
  date: {
    color: "white",
    padding: 5,
    fontStyle: "italic",
  },
  message: {
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
  },
  justifyLeft: {
    alignSelf: "flex-start",
  },
  image_container: {
    alignItems: "center",
  },
  blankProfileCircle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    marginRight: 10,
  },
  bubble:{
    
  }
});
