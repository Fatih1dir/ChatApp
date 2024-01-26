import { StyleSheet } from "react-native";
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    backgroundColor:"lightgrey"
  },
  anonymousContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    backgroundColor:"#2f2f30"
  },
  messagesContainer: {
    flex: 1,
  },
  inputContainer: {
    borderTopWidth: 0.5,
    borderTopColor: "black",
    paddingVertical: 8,
    paddingHorizontal:8,
    borderColor:"black",
  },
  anonymousInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 10,
    shadowColor: "#969696",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 6,
    backgroundColor:"#4e5259"
  },
  input: {
    flex: 1,
    height: 60,
    paddingHorizontal: 8,
    marginRight: 8,
  },
  anonymousInput: {
    flex: 1,
    height: 60,
    paddingHorizontal: 8,
    marginRight: 8,
    color:"white",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 6,
    
  },
});
