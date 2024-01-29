import React, { useState } from "react";
import { View, Text, Modal, TextInput, StyleSheet } from "react-native";
import Button from "../../Button/Button";
const ReLoginModal = ({ isVisible, handleOnSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = () => {
    handleOnSubmit(username, password);
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
    >
      <View style={styles.overlay}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Tekrar giriş yapmanız gerekmektedir
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Eski kullanıcı adınız"
              value={username}
              onChangeText={(text) => setUsername(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Şifreniz"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <Button color="#82368C" text="Giriş Yap" onPress={onSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
    justifyContent: "center",
  },
  centeredView: {
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
});

export default ReLoginModal;
