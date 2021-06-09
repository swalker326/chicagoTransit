import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Marker, Callout} from 'react-native-maps';
import BusMapMarker from '../../../assets/letter_marker_b.svg';

export const BusMarker = ({bus}) => {
  const getDirection = angle => {
    var directions = ['North', 'East', 'South', 'West'];
    return directions[
      Math.round(((angle %= 360) < 0 ? angle + 360 : angle) / 90) % 4
    ];
  };
  return (
    <Marker
      key={bus.vid}
      coordinate={{
        latitude: parseFloat(bus.lat),
        longitude: parseFloat(bus.lon),
      }}>
      <View>
        <BusMapMarker height={30} width={30} color={bus.busColor} />
      </View>
      <Callout
        tooltip={true}
        style={{
          width: 200,
          backgroundColor: `${bus.busColor}B3`,
          borderRadius: 8,
          padding: 8,
        }}>
        <View>
          <Text style={{fontWeight: '600'}}>Bus:{bus.vid}</Text>
          <Text>{bus.dly ? 'Delayed' : 'On Schedule'}</Text>
          <Text>Direction of Travel: {getDirection(bus.hdg)}</Text>
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
