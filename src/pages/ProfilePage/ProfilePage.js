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
import Button from "../../Components/Button/Button";
import { getUserAttributesbyId } from "../../Controllers/User";
import ParseContentData from "../../Controllers/ParseContentData";
import Input from "../../Components/Input/Input";
import styles from './ProfilePage.style';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
const auth = getAuth(app);

const ProfilePage = ({ navigation }) => {
  const [date, setDate] = useState(new Date())
  const [user, setUser] = React.useState({});
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [sex, setSex] = useState("");
  const [profilePic, setProfilePic] = useState(null); // Profile picture state
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onImagePickPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfilePic(result.uri);
    }
  };

  const onSaveChanges = async () => {
    const userId = user.uid;
    const userRef = ref(db, `users/${userId}`);
    const userData = {
      email,
      username,
      dateOfBirth,
      sex,
      profilePic: profilePic, // Save the profile picture URL
    };

    if (profilePic) {
      // Upload the profile picture to Firebase Storage
      const profilePicRef = storageRef.child(`profile_pics/${userId}`);
      await profilePicRef.putFile(profilePic);
      const downloadURL = await profilePicRef.getDownloadURL();
      userData.profilePic = downloadURL;
    }

    set(userRef, userData)
      .then(() => {
        setIsEditing(false);
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
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  React.useEffect(() => {
    fetchUserData();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
    setDateOfBirth(currentDate.toISOString().slice(0, 10));
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {profilePic ? (
          <Image style={styles.profilePic} source={{ uri: profilePic }} />
        ) : (
          <View style={styles.blankProfileCircle} />
        )}
      </View>
      <View style={styles.inputContainer}>
        <Input placeholder={user.email} value={email} onType={(text) => setEmail(text)} iconName={"email"}/>
        <Input
          placeholder={user.username}
          value={username}
          onType={(text) => setUsername(text)}
          iconName="account"
        />
        <TouchableOpacity onPress={showDatePickerModal}>
          <Input
            placeholder={date.toISOString().slice(0, 10)}
            value={dateOfBirth}
            editable={false}
            iconName="calendar"
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
          />
        )}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={sex}
            onValueChange={(itemValue) => setSex(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" enabled={false} />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>
      </View>
      <View style={styles.bottomButtonsContainer}>
        <Button text="Save Changes" onPress={onSaveChanges} />
        <Button text="Logout" onPress={onLogOutPress} />
      </View>
    </View>
  );
};

export { ProfilePage };
