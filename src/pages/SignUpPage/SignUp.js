import React, { useState } from "react";
import { Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import Input from "../../Components/Input/Input";
import styles from "./SignUp.style";
import { Formik } from "formik";
import { showMessage} from "react-native-flash-message";

import { app } from '../../../firebaseConfig';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

import { registerUser } from '../../Controllers/UserRegistration';

const SignUp = ({ navigation }) => {

  const loginButtonHandle = () => {
    navigation.navigate("LoginPage");
  };

  const handleSubmit = (values) => {
    if (values.password === values.repassword) {
      
      if (values.password.length >= 6) {
        // Passwords match and meet the minimum length requirement, proceed with registration
        registerUser(values.email, values.password, values.username);
      } else {
        // Password is too short, display an error message or take appropriate action
        showMessage({
          message: "Şifre en az 6 karakter olmalı",
          type: "info",
        });
      }
    } else {
      // Passwords don't match, display an error message or take appropriate action
      showMessage({
        message: "Şifreler eşleşmedi. Şifrenizi kontrol edin.",
        type: "info",
      });
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Formik
          initialValues={{ email: "", password: "", repassword: "", username:""}}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, values }) => (
            <View style={styles.body_container}>
              <Input
                placeholder={"E-mail giriniz"}
                value={values.email}
                onType={handleChange("email")}
              />
              <Input
                placeholder={"Şifrenizi giriniz"}
                value={values.password}
                onType={handleChange("password")}
                isSecure
              />
              <Input
                placeholder={"Şifreyi tekrar giriniz"}
                value={values.repassword}
                onType={handleChange("repassword")}
                isSecure
              />
              <Input
                placeholder={"Bir kullanıcı adı giriniz"}
                value={values.username}
                onType={handleChange("username")}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={() => handleSubmit(values)}>
                  <Text style={styles.loginButtonText}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
        <Text style={{ textAlign: "center" }}>
          Or if you are already registered
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={loginButtonHandle}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export { SignUp };
