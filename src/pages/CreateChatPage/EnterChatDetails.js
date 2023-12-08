import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
} from "react-native";
import Button from "../../Components/Button/Button";
import { StyleSheet, Dimensions } from "react-native";
import { ref, get, child, getDatabase } from "firebase/database";
import { app } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import {createChat} from '../../Controllers/CreateChatController';

const EnterChatDetails = ({ route, navigation }) => {
  const db = getDatabase(app);
  const auth = getAuth(app);

  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [chatImage, setChatImage] = useState(null);
  const [chatName, setChatName] = useState("");
  const { selectedUsers } = route.params;

  React.useEffect(() => {
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const pickImage = async () => {
    if (hasGalleryPermission) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const selectedAssets = result.assets;
        if (selectedAssets.length > 0) {
          const selectedAsset = selectedAssets[0];
          setChatImage(selectedAsset.uri);
        }
      }
    }
  };

  handleCreateChat=()=>{
    createChat(auth.currentUser.uid,chatName,selectedUsers,chatImage);
    navigation.navigate("Home");
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => pickImage()}
        style={styles.imageContainer}
      >
        {chatImage ? (
          <Image source={{ uri: chatImage }} style={styles.selectedImage} />
        ) : (
          <Icon
            name="person-outline"
            size={100}
            color="#000"
            style={{ alignSelf: "center", margin: 5 }}
          />
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter Chat Name"
        onChangeText={(text) => setChatName(text)}
        value={chatName}
      />
      <Text>Participants</Text>
      <FlatList
        data={selectedUsers}
        keyExtractor={(item) => item}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <Button text={"Oluştur"} onPress={()=>handleCreateChat()}></Button>
    </View>
  );
};

export default EnterChatDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    alignSelf: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 60,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
});
