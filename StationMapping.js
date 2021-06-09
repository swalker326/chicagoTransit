import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import {Polyline, Polygon} from 'react-native-maps';
import Axios from 'axios';

export const StationMap = ({stationId}) => {
  const [coords, setCoords] = useState(false);

  const calculateDistance = (lat1, lon1, lat2, lon2, unit) => {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var radlon1 = (Math.PI * lon1) / 180;
    var radlon2 = (Math.PI * lon2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'K') {
      dist = dist * 1.609344;
    }
    if (unit == 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  };

  useEffect(() => {
    buildRouteLines().then(resp => {
      console.log(
        'resp :',
        resp.filter(e => e !== null),
      );
      const points = resp
        .filter(e => e !== null)
        .sort((a, b) => (a.longitude > b.longitude ? 1 : -1));

      setCoords(points);
    });
  }, []);
  const buildRouteLines = async () => {
    const stationPromise = await Axios.get(
      'https://data.cityofchicago.org/resource/8pix-ypme.json',
    ).then(resp => {
      const stationCoords = resp.data.map(s => {
        return s.blue
          ? {
              latitude: s.location.latitude,
              longitude: s.location.longitude,
            }
          : null;
      });
      return stationCoords;
    });
    // const stationCoords = stationPromise.data.map(async s => {
    //   console.log('s :', s);
    //   s[`${stationId}`]
    //     ? {latitude: s.location.latitude, longitude: s.location.longitude}
    //     : null;
    // });
    return stationPromise;
  };
  // TO MAKE STATIONS!
  // <Marker
  //   key={`station_${index}`}
  //   coordinate={{
  //     latitude: position.latitude,
  //     longitude: position.longitude,
  //   }}>
  //   <Text>latitude: {position.latitude}</Text>
  //   <Text>latitude: {position.long}</Text>
  // </Marker>;
  return coords ? (
    <Polyline
      coordinates={coords}
      strokeColor="pink" // fallback for when `strokeColors` is not supported by the map-provider
      strokeWidth={4}
    />
  ) : null;
};

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});

export default StationMap;
