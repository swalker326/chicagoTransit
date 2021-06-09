/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Pressable,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import MapView, {Overlay, Marker, Callout} from 'react-native-maps';
import {BusMarker} from '../components/buses/BusMarker';
import {TrainMarker} from '../components/TrainMarker';
import {useAppState} from '../state/contexts/appContext';
import Axios from 'axios';
import Config from 'react-native-config';
import {CheckBox} from 'react-native-elements';
import {BusPolyline} from '../components/buses/BusPolyline';
import trainRouteData from '../TrainRouteData.json';
import MapModal from '../components/MapModal';

export const LiveMap = () => {
  const [displayBuses, setDisplayBuses] = useState(false);
  const [displayTrains, setDisplayTrains] = useState(false);
  const [displayBusRoutes, setDisplayBusRoutes] = useState([]);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showTrains, setShowTrains] = useState(true);
  const [showStops, setShowStops] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const {TRAIN_LINES, BUS_ROUTES} = useAppState();
  const mapRef = useRef(null);

  useEffect(() => {
    getBusesData().then(resp => {
      setDisplayBuses(resp);
    });
    const updateTimer = setInterval(
      () => getBusesData().then(resp => setDisplayBuses(resp)),
      10000,
    );
    if (showRoutes) {
      
      // const getPaths = async () => {
      //   const paths = await BUS_ROUTES.map(route => {
      //     return getRoutePath(route);
      //   });
      //   return Promise.all(paths);
      // };
      // getPaths().then(resp => setDisplayBusRoutes(resp));
      // // console.log(path.length);
      Promise.all(BUS_ROUTES.map(getRoutePath)).then(setDisplayBusRoutes);
    }
    return () => {
      clearInterval(updateTimer);
    };
  }, [BUS_ROUTES]);
  useEffect(() => {
    // setDisplayTrains(TRAIN_LINES);
    getTrainData().then(resp => setDisplayTrains(resp.flat()));
  }, [TRAIN_LINES]);
  useEffect(() => {
    if (showRoutes) {
      const getPaths = async () => {
        const paths = await BUS_ROUTES.map(route => {
          return getRoutePath(route);
        });
        return Promise.all(paths);
      };
      getPaths().then(resp => setDisplayBusRoutes(resp));
      // console.log(path.length);
    } else {
      setDisplayBusRoutes([]);
    }
  }, [showRoutes]);
  useEffect(() => {
    if (showTrains) {
      getTrainData().then(resp => setDisplayTrains(resp.flat()));
    } else {
      setDisplayTrains([]);
    }
  }, [showTrains]);
  const getRoutePath = async route => {
    const pathPromise = await Axios.get(
      `http://ctabustracker.com/bustime/api/v2/getpatterns?key=NVHDaqsmgDQeR8CBz8mRYRaXa&rt=${route.routeNumber}&pid=954&format=json`,
    ).catch(error => console.log('error :', error));

    const data = pathPromise.data['bustime-response'];
    if (data.error) {
      console.log(`Error getting path data:`, data.error);
      return `Error getting path data`;
    } else {
      const pathWest = pathPromise?.data['bustime-response']?.ptr[0]?.pt?.map(
        point => {
          return {latitude: point.lat, longitude: point.lon};
        },
      );
      const pathEast = pathPromise?.data['bustime-response']?.ptr[1]?.pt?.map(
        point => {
          return {latitude: point.lat, longitude: point.lon};
        },
      );
      const routePath = {
        name: route.routeName,
        color: route.routeColor,
        paths: {west: pathWest, east: pathEast},
      };
      return routePath;
    }
  };
  const getBusesData = async () => {
    console.log(
      `getting CTA data - Trains: ${TRAIN_LINES.length} Bus: ${BUS_ROUTES.length}`,
    );
    if (BUS_ROUTES) {
      const busPromise = BUS_ROUTES.map(async route => {
        const response = await Axios({
          method: 'GET',
          url: `http://www.ctabustracker.com/bustime/api/v2/getvehicles?key=${Config.CTA_BUS_KEY}&rt=${route.routeNumber}&format=json`,
        }).catch(error =>
          console.log(`error get busses for route ${route}  :`, error),
        );
        // console.log('response :', response.data['bustime-response'].vehicle);
        if (response.data['bustime-response']?.vehicle) {
          return response.data['bustime-response']?.vehicle.map(r => {
            // console.log('r :', r);
            const busData = {
              ...r,
              busColor: route.routeColor,
              // routeName: route.routeName,
            };
            const example = {
              des: 'Chestnut/Lake Shore',
              dly: false,
              hdg: '84',
              lat: '41.8696771666061',
              lon: '-87.64555731485056',
              pdist: 26699,
              pid: 14132,
              rt: '157',
              tablockid: '157 -804',
              tatripid: '88348778',
              tmstmp: '20210524 12:56',
              vid: '8148',
              zone: '',
            };
            return busData;
          });
        }
      });
      return Promise.all(busPromise);
    }
  };
  const getTrainData = async () => {
    const trainPromise = await trainRouteData.routes.map(async route => {
      const {rt, color} = route;
      const response = await Axios({
        method: 'GET',
        url: `http://lapi.transitchicago.com/api/1.0/ttpositions.aspx?key=${Config.CTA_TRAIN_KEY}&rt=${rt}&outputType=JSON`,
      }).catch(error => console.warn(error));
      const data = response.data.ctatt.route;
      const error = response.data.ctatt.errCd;
      if (data && error == 0) {
        const newTrain = data[0].train;
        if (!newTrain.length) return newTrain;
        // console.log('newTrain :', newTrain);
        // console.log('newTrain.t :', typeof newTrain);
        newTrain.forEach(train => (train.color = color));
        return newTrain;
      }
    });
    return Promise.all(trainPromise);
  };
  return (
    <SafeAreaView>
      <MapModal content={modalContent} />
      <View>
        <MapView
          showsUserLocation={true}
          ref={mapRef}
          // onMapReady={() => {
          //   console.log('mapRead');
          //   mapRef.current.fitToCoordinates(
          //     displayBuses.map(route => {
          //       return route?.length
          //         ? route.map(bus => {
          //             return {latitude: bus.lat, longitude: bus.lon};
          //           })
          //         : null;
          //     }),
          //   );
          // }}
          style={styles.map}
          initialRegion={{
            latitude: 41.8781,
            longitude: -87.6338838,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Overlay style={styles.mapOverlay}>
            <View style={styles.mapSettingsContainer}>
              <View style={styles.checkWrapper}>
                <CheckBox
                  checked={showRoutes}
                  checkedColor={'#f4511e'}
                  onPress={() => {
                    setShowRoutes(!showRoutes);
                  }}
                  containerStyle={styles.checkContainer}
                />
                <Text>Bus Routes</Text>
              </View>
              <View style={styles.checkWrapper}>
                <CheckBox
                  checked={showStops}
                  checkedColor={'#f4511e'}
                  onPress={() => setShowStops(!showStops)}
                  containerStyle={styles.checkContainer}
                />
                <Text>Bus Stops</Text>
              </View>
              <View style={styles.checkWrapper}>
                <CheckBox
                  checked={showTrains}
                  checkedColor={'#f4511e'}
                  onPress={() => setShowTrains(!showTrains)}
                  containerStyle={styles.checkContainer}
                />
                <Text>Trains</Text>
              </View>
              <View style={styles.checkWrapper}>
                <CheckBox
                  checked={showTrains}
                  checkedColor={'#f4511e'}
                  onPress={() => setShowTrains(!showTrains)}
                  containerStyle={styles.checkContainer}
                />
                <Text>Train Stations</Text>
              </View>
            </View>
          </Overlay>
          {/* TRAIN MARKERS*/}
          {displayTrains
            ? displayTrains
                .filter(train => train !== undefined)
                .map((train, index) => {
                  return <TrainMarker key={`train_${index}`} train={train} />;
                })
            : null}
          {/* BUS MARKERS*/}
          {displayBuses.length
            ? displayBuses.map(route => {
                return route?.length
                  ? route.map(bus => {
                      return <BusMarker key={`bus_${bus.vid}`} bus={bus} />;
                    })
                  : null;
              })
            : null}
          {/* BUS ROUTES */}
          {displayBusRoutes.length
            ? displayBusRoutes.map(p => {
                if (p) {
                  return <BusPolyline key={`route_${p.name}`} busPath={p} />;
                }
              })
            : null}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  map: {
    height: '100%',
  },
  loadingOverlay: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff70',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlay: {
    alignItems: 'flex-end',
    width: '100%',
  },
  mapSettingsContainer: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderBottomLeftRadius: 12,
  },
  checkWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkContainer: {
    margin: 0,
    padding: 2,
  },
});
