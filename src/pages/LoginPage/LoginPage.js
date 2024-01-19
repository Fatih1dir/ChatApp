import React from "react";
import { Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import { Formik } from "formik";
import Input from "../../Components/Input/Input";
import styles from "./LoginPage.style";

import { signUserIn } from "../../Controllers/UserLoginController";

const LoginPage = ({ navigation }) => {
  const signUpButtonHandle = () => {
    navigation.navigate("SignUp");
  };

  const handleSubmit = (values) => {
    try {
      signUserIn(values.username, values.password,{navigation});
      //navigation.navigate("Home");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView>
      <View>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, values }) => (
            <View style={styles.body_container}>
              <Input
                placeholder={"Kullanıcı adı giriniz"}
                value={values.username}
                onType={handleChange("username")}
              />
              <Input
                placeholder={"Şifrenizi giriniz"}
                value={values.password}
                onType={handleChange("password")}
                isSecure
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.signUpButton}
                  onPress={() => handleSubmit(values)}
                >
                  <Text style={styles.signUpButtonText}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
        <Text style={{ textAlign: "center" }}>
          If you don't have an account
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={signUpButtonHandle}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export { LoginPage };
