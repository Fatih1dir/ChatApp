import { StyleSheet } from "react-native";
export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  leftContainer: {
    flex: 1,
    alignItems: "flex-start",
    marginRight: -23,
  },
  chatBubbleContainer: {
    flex: 4,
  },
  rightContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginLeft: -23,
  },
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 30,
    marginRight: 5,
    marginTop: 75,
    borderWidth: 1,
    borderColor: "grey",
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
    marginRight: 5,
    marginTop: 75,
  },
});
