import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Marker, Callout} from 'react-native-maps';
import TrainMapMarker from '../../assets/letter_marker_t.svg';
import moment from 'moment';

export const TrainMarker = ({train}) => {
  const getDirection = angle => {
    var directions = ['North', 'East', 'South', 'West'];
    return directions[
      Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 90) % 4
    ];
  };
  return (
    <Marker
      key={train.rn}
      coordinate={{
        latitude: train.lat,
        longitude: train.lon,
      }}>
      <TrainMapMarker
        height={30}
        width={30}
        color={train.color}
        fontSize={80}
        fontColor={'black'}
      />
      <Callout
        tooltip={true}
        style={{
          width: 200,
          backgroundColor: 'lightgray',
          borderRadius: 8,
          padding: 8,
        }}>
        <View>
          <Text>Train: {train.rn}</Text>
          <Text>Arrival: {moment(train.arrT).fromNow()}</Text>
          <Text>Direction of Travel: {getDirection(train.heading)}</Text>
        </View>
      </Callout>
    </Marker>
  );
};

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});
