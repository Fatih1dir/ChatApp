import React, { useState } from "react";
import { Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import Input from "../../Components/Input/Input";
import styles from "./SignUp.style";
import { Formik } from "formik";
import { showMessage} from "react-native-flash-message";

import { registerUser } from '../../Controllers/UserRegistration';

const SignUp = ({ navigation }) => {

  const loginButtonHandle = () => {
    navigation.navigate("LoginPage");
  };

  const handleSubmit = (values) => {

    const isUsernameValid = /^[a-zA-Z0-9_]+$/.test(values.username);

    if (!isUsernameValid) {
      // Username contains invalid characters, display an error message or take appropriate action
      showMessage({
        message: "Kullanıcı adı sadece harf, rakam ve alt çizgi içerebilir. Türkçe karakter içermemeli",
        type: "danger",
      });
      return;
    }

    if (values.password === values.repassword) {
      
      if (values.password.length >= 6) {
        // Passwords match and meet the minimum length requirement, proceed with registration
        registerUser(values.username,values.password);
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
          initialValues={{username:"", password: "", repassword: ""}}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleSubmit, values }) => (
            <View style={styles.body_container}>
              <Input
                placeholder={"Bir kullanıcı adı giriniz"}
                value={values.username}
                onType={handleChange("username")}
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
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.signUpButton} onPress={() => handleSubmit(values)}>
                  <Text style={styles.signUpButtonText}>Kayıt Ol</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
        <Text style={{ textAlign: "center" }}>
          Zaten hesabınız var mı?
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={loginButtonHandle}
        >
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export { SignUp };
