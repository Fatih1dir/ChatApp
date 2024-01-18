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
import {getDatabase } from "firebase/database";
import { app} from "../../../firebaseConfig";
import {getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,} from "firebase/storage";
import { getAuth } from "firebase/auth";
import Icon from "react-native-vector-icons/Ionicons";
import * as ImagePicker from "expo-image-picker";
import {createChat} from '../../Controllers/CreateChatController';
import UserCard from "../../Components/UserCard/UserCard";

const EnterChatDetails = ({ route, navigation }) => {
  const db = getDatabase(app);
  const auth = getAuth(app);
  const storage=getStorage(app);

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
          setChatImage(selectedAsset.uri)
        }
      }
    }
  };
  const handleCreateChat=async()=>{
    // Upload the image to Firebase Storage
    if (chatImage) {
      const response = await fetch(chatImage);
      const blob = await response.blob();
      const imageName = `${auth.currentUser.uid}_${Date.now()}.jpg`;
      const storageReference = storageRef(storage, `images/${imageName}`);
      await uploadBytes(storageReference, blob);

    // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageReference);
      createChat(auth.currentUser.uid,chatName,selectedUsers,downloadURL);
      
    }
    else{
      createChat(auth.currentUser.uid,chatName,selectedUsers,"");
    }
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
      <View style={{ flexDirection: "row"}}>
        <Text>Participants</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 , borderWidth: 1, borderRadius: 5, backgroundColor: "#2286c3",paddingHorizontal: 5}}>
          <Text style={{color: "white"}}>Düzenle</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList 
        style={{ maxHeight: 60, marginTop: 10 }}
        data={selectedUsers}
        keyExtractor={(item) => item}
        renderItem={(item)=><UserCard user={item}></UserCard>}
        horizontal
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
