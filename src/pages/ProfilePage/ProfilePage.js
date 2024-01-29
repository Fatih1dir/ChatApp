import React, { useState } from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";
import { app } from "../../../firebaseConfig";
import {
  getAuth,
  updateEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { getDatabase, ref, get, set, update, remove } from "firebase/database";
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
import { showMessage } from "react-native-flash-message";
import ReLoginModal from "../../Components/Modal/ReLoginModal/ReLoginModal";
import { isUsernameEmailUnique } from "../../Controllers/CreateUserInDB";

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
  const [profilePicture, setProfilePicture] = useState(null); // Profile picture state
  const [IsPicChanged, setIsPicChanged] = useState(false); // Profile picture state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
          setProfilePicture(selectedAsset.uri);
          setIsPicChanged(true);
        }
      }
    }
  };

  const updateUsernameTable = async (oldUsername, newUsername) => {
    const oldRef = ref(db, `usernames/${oldUsername}`);
    get(oldRef)
      .then((snapshot) => {
        const olduserData = snapshot.val();

        // Step 2: Write data to the new key
        const newRef = ref(db, `usernames/${newUsername}`);
        set(newRef, olduserData)
          .then(() => {
            console.log("Data moved successfully to the new key");

            // Step 3: Delete data from the old key
            remove(oldRef)
              .then(() => {
                console.log("Data deleted from the old key");
              })
              .catch((error) => {
                console.log("Error deleting data from the old key:", error);
              });
          })
          .catch((error) => {
            console.log("Error writing data to the new key:", error);
          });
      })
      .catch((error) => {
        console.log("Error reading data from the old key:", error);
      });
  };

  const updateUsernameonAuth = async (username) => {
    // Update the email since the user has recently logged in
    updateEmail(auth.currentUser, username + "@chatapp.com")
      .then(() => {
        console.log("Email updated successfully");
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/requires-recent-login":
            setIsVisible(true);
            break;
          default:
            console.log("Error registering user:", error);
            break;
        }
      });
  };

  const updateUsersData = async (userRef, userData) => {
    update(userRef, userData)
      .then(() => {
        console.log("User data updated successfully");
      })
      .catch((error) => {
        console.log("Error updating user data:", error);
      });
  };

  const onLogin = async (reLoginusername, reLoginpassword) => {
    const auth = getAuth(app);
    const email = reLoginusername + "@chatapp.com";
    console.log(email + ": " + reLoginpassword);
    try {
      await signInWithEmailAndPassword(auth, email, reLoginpassword)
        .then(() => {
          console.log("User logged in successfully");
          onSaveChanges();
          setIsVisible(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
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
      profilePic: profilePicture, // Save the profile picture URL
    };

    if (IsPicChanged) {
      // Upload the profile picture to Firebase Storage
      const response = await fetch(profilePicture);
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
    if (userData.username !== user.username) {
      const isUsernameValid = /^[a-zA-Z0-9_]+$/.test(userData.username);

      if (!isUsernameValid) {
        // Username contains invalid characters, display an error message or take appropriate action
        showMessage({
          message:
            "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir. Türkçe karakter içermemeli",
          type: "danger",
        });
      }
      const { isUsernameUnique } = await isUsernameEmailUnique(
        db,
        userData.username
      );
      if (!isUsernameUnique) {
        showMessage({
          message:
            "Kullanıcı adı zaten alınmış. Lütfen farklı bir kullanıcı adı belirleyin.",
          type: "info",
        });
      } else if(isUsernameUnique && isUsernameValid) {
        try {
          await updateUsernameonAuth(userData.username);
          await updateUsernameTable(user.username, userData.username);
          await updateUsersData(userRef, userData);
        } catch (error) {
          console.log(error);
        }
      }
    } else {
      await updateUsersData(userRef, userData);
    }
    showMessage({
      message: "Bilgileriniz güncellendi.",
      type: "success",
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
        if (parsedData[0].email) {
          setEmail(parsedData[0].email);
        }
        if (parsedData[0].username) {
          setUsername(parsedData[0].username);
        }
        if (parsedData[0].sex) {
          setSex(parsedData[0].sex);
        }
        if (parsedData[0].profilePic) {
          setProfilePicture(parsedData[0].profilePic);
        }
        if (parsedData[0].date) {
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
      <ReLoginModal isVisible={isVisible} handleOnSubmit={onLogin} />
      <View style={styles.profileContainer}>
        <View style={styles.profilePicContainer}>
          {profilePicture ? (
            <Image style={styles.profilePic} source={{ uri: profilePicture }} />
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
        ) : (
          <TouchableOpacity onPress={showDatePickerModal}>
            <View style={styles.DateinputContainer}>
              <Text style={styles.dateInput}>
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
            style={{ backgroundColor: "white" }}
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
              <Picker.Item label="Cinsiyet" value="" enabled={false} />
              <Picker.Item label="Erkek" value="Erkek" />
              <Picker.Item label="Kadın" value="Kadın" />
            </Picker>
          </View>
        )}
      </View>
      <View style={styles.bottomButtonsContainer}>
        <Button
          color="#82368C"
          text="Değişiklikleri Kaydet"
          onPress={onSaveChanges}
        />
        <Button color="#d40f0f" text="Çıkış Yap" onPress={onLogOutPress} />
      </View>
    </View>
  );
};

export { ProfilePage };
