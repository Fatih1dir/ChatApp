import React from 'react';
import {TouchableOpacity, Text, ActivityIndicator} from 'react-native';

import styles from './Button.style';

const Button = ({text, onPress, loading, color="#2286c3"}) => {
  return (
    <TouchableOpacity
      style={[styles.container , {backgroundColor: color}]} 
      onPress={onPress}
      disabled={loading}>
      {loading ? (
        <ActivityIndicator color="black" />
      ) : (
        <Text style={styles.title}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};
export default Button;