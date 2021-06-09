import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Polyline} from 'react-native-maps';

export const BusPolyline = ({busPath}) => {
  return (
    <View>
      {busPath === 'Error getting path data' ? null : (
        <View>
          <Polyline
            coordinates={busPath.paths.west}
            strokeColor={busPath.color} // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={4}
          />
          <Polyline
            coordinates={busPath.paths.east}
            strokeColor={busPath.color} // fallback for when `strokeColors` is not supported by the map-provider
            strokeWidth={4}
          />
        </View>
      )}
    </View>
  );
};

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});
