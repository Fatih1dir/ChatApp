import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    fontSize:12
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
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "grey",
    marginRight: 10,
  },
  bubble:{
    
  }
});
