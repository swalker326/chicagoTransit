import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Config from 'react-native-config';

export const Trains = () => {
  return (
    <View>
      <Text>{Config.CTA_TRAIN_KEY}</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});
