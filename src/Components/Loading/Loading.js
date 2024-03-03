import React from 'react';
import Lottie from 'lottie-react-native';
function Loading() {
  return <Lottie source={require('../../assets/loading1.json')} autoPlay loop />;
}

export default Loading;