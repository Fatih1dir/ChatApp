import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import Button from "../../Button/Button";
import ReactNativeModal from "react-native-modal";
import { StyleSheet, Dimensions } from "react-native";
import { ref, get, child, getDatabase } from "firebase/database";
import { app } from "../../../../firebaseConfig"; // Import the app object

const CreateChatModal = ({ visible, onClose, onSend }) => {
  const db = getDatabase(app);
  const [username, setUsername] = useState([]);
  const [inputText, setInputText] = useState("");
  const [usernameExists, setUsernameExists] = useState(null);
  const [chatName,setChatName] = useState();

  async function checkUsernameAvailability(username) {
    try {
      const snapshot = await get(child(ref(db), `usernames/${username}`));
      if (snapshot.exists()) {
        setUsernameExists(true);
      } else {
        setUsernameExists(false);
      }
    } catch (error) {
      console.error("Error checking username availability: ", error);
    }
  }


  async function handleAddUsername() {
    if (!inputText) {
      return;
    }

    await checkUsernameAvailability(inputText);

    if (usernameExists==true && (!username.includes(inputText))) {
      setUsername([...username, inputText]);
      setInputText("");
    }
    else if(username.includes(inputText)){
      console.log("You already added this username")
    }
    else if(usernameExists==false){
      // Username already exists, handle accordingly
      console.log("This username doesn't exist");
    }
  }

  function handleSend() {
    if (!username) {
      return;
    }
    setInputText(""); // Clear the input field
    onSend(username,chatName); // You can choose whether to include the new input in the onSend callback.
    setUsername([]);
    setChatName("");
    onClose();
  }

  return (
    <ReactNativeModal
      isVisible={visible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      swipeDirection="down"
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modalView}
      avoidKeyboard={true}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter a username"
            value={inputText}
            onChangeText={(text) => setInputText(text)}
          />
          <TouchableOpacity onPress={handleAddUsername} style={styles.addUserBtn}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
        <TextInput
            placeholder="Enter a chat name(optional)"
            value={chatName}
            onChangeText={(text) => setChatName(text)}
          />
        </View>
        <Button text="Create" onPress={handleSend}></Button>
      </View>
    </ReactNativeModal>
  );
};

const deviceSize = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    justifyContent:'flex-end',
    paddingHorizontal: 30,
    backgroundColor:'grey',
    height:deviceSize.height/3,
    marginHorizontal:10,
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
  },
  modalView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  inputContainer: {
    flexDirection: "row", // To place the Text and TextInput horizontally
    alignItems: "center", // To vertically align the Text and TextInput
    borderWidth:1,
    borderRadius:10,
    marginVertical:20,
    padding:10
  },
  addUserBtn:{
    backgroundColor:'white',
    marginLeft:130,
    borderRadius:5,
  }
});

export default CreateChatModal;
