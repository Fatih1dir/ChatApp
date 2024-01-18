import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { app } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { getDatabase, ref, get, onValue, update } from "firebase/database";
import Button from "../../Components/Button/Button";
import { getUserAttributesbyId } from "../../Controllers/User";
import ParseContentData from "../../Controllers/ParseContentData";
import Input from "../../Components/Input/Input";
import styles from "./ProfilePage.style";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import * as ImagePicker from "expo-image-picker";
import { getDate } from "date-fns";
const auth = getAuth(app);

const ProfilePage = ({ navigation }) => {
  const db = getDatabase(app);
  const storage = getStorage(app);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [date, setDate] = useState(new Date());
  const [user, setUser] = React.useState({});
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [sex, setSex] = useState("");
  const [profilePic, setProfilePic] = useState(null); // Profile picture state
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onImagePickPress = async () => {
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
          setProfilePic(selectedAsset.uri);
        }
      }
    }
  };

  const onSaveChanges = async () => {
    const userId = auth.currentUser.uid;
    const userRef = ref(db, `users/${userId}`);
    const userData = {
      email: email,
      username: username,
      date: date,
      sex: sex,
      profilePic: profilePic, // Save the profile picture URL
    };

    if (profilePic) {
      // Upload the profile picture to Firebase Storage
      const response = await fetch(profilePic);
      const blob = await response.blob();
      const imageName = `${auth.currentUser.uid}_profilePic_${Date.now()}.jpg`;
      const storageReference = storageRef(
        storage,
        `profile_images/${imageName}`
      );
      await uploadBytes(storageReference, blob);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(storageReference);
      userData.profilePic = downloadURL;
    }

    update(userRef, userData)
      .then(() => {
        console.log("User data updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  const onLogOutPress = () => {
    auth.signOut().then(() => console.log("User signed out!"));
  };
  const fetchUserData = async () => {
    try {
      const data = await getUserAttributesbyId(auth.currentUser.uid);
      if (data) {
        const parsedData = ParseContentData(data);
        setUser(parsedData[0]);
        if(parsedData[0].email){
          setEmail(parsedData[0].email);
        }
        if(parsedData[0].username){
          setUsername(parsedData[0].username);
        }
        if(parsedData[0].sex){
          setSex(parsedData[0].sex);
        }
        if(parsedData[0].profilePic){
          setProfilePic(parsedData[0].profilePic);
        }
        if(parsedData[0].date){
          setDate(parsedData[0].date);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  React.useEffect(() => {
    fetchUserData();
    (async () => {
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date || new Date(); // Use a default date if date is undefined
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <View style={styles.profilePicContainer}>
          {profilePic ? (
            <Image style={styles.profilePic} source={{ uri: profilePic }} />
          ) : user.profilePic ? (
            <Image
              style={styles.profilePic}
              source={{ uri: user.profilePic }}
            />
          ) : (
            <View style={styles.blankProfileCircle} />
          )}
          <View style={styles.cameraIconContainer}>
            <Icon
              name="camera"
              size={25}
              color="#1ac0c6"
              onPress={onImagePickPress}
            />
          </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text>E-mail</Text>
        {user.email ? (
          <Input
            placeholder={user.email}
            value={email}
            onType={(text) => setEmail(text)}
            iconName={"email"}
          />
        ) : (
          <Input
            placeholder={"Bir e-mail girin"}
            iconName={"email"}
            value={email}
            onType={(text) => setEmail(text)}
          />
        )}
        <Text>Kullanıcı adı</Text>
        <Input
          placeholder={user.username}
          value={username}
          onType={(text) => setUsername(text)}
          iconName="account"
        />
        <Text>Doğum Tarihi</Text>
        {user.date ? (
          <View style={styles.DateinputContainer}>
          <Text
            style={styles.dateInput}
            placeholder={new Date(user.date).toLocaleDateString()}
          >
            {new Date(date).toLocaleDateString()}
          </Text>
          <Icon name="calendar" size={25} color="#1ac0c6" />
        </View>
        ): (
          <TouchableOpacity onPress={showDatePickerModal}>
          <View style={styles.DateinputContainer}>
            <Text
              style={styles.dateInput}
            >
              {new Date(date).toLocaleDateString()}
            </Text>
            <Icon name="calendar" size={25} color="#1ac0c6" />
          </View>
        </TouchableOpacity>
        )}
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}
        
        <Text>Cinsiyet</Text>
        {user.sex ? (
          <View style={styles.DateinputContainer}>
            <Text style={styles.dateInput}>{user.sex}</Text>
            {user.sex === "Erkek" ? (
              <Icon name="gender-male" size={25} color="#1ac0c6" />
            ) : (
              <Icon name="gender-female" size={25} color="#1ac0c6" />
            )}
          </View>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={sex}
              onValueChange={(itemValue) => setSex(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Select Gender" value="" enabled={false} />
              <Picker.Item label="Erkek" value="Erkek" />
              <Picker.Item label="Kadın" value="Kadın" />
            </Picker>
          </View>
        )}
      </View>
      <View style={styles.bottomButtonsContainer}>
        <Button text="Değişiklikleri Kaydet" onPress={onSaveChanges} />
        <Button color="red" text="Çıkış Yap" onPress={onLogOutPress} />
      </View>
    </View>
  );
};

export { ProfilePage };
