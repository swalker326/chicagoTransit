import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  TextInput,
  View,
} from 'react-native';
import Axios from 'axios';
import Config from 'react-native-config';
import {ListItem} from 'react-native-elements';
import {black} from 'chalk';
import {useAppState, useAppDispatch} from '../state/contexts/appContext';

const RouteCheckbox = props => {
  const {selectedRoutes} = props;
  const {routeNumber, routeColor, routeName} = props.route;
  const setSelectedRoutes = props.handlePress;
  return (
    <ListItem
      bottomDivider
      routeNumber={routeNumber}
      style={{alignItems: 'stretch'}}>
      <ListItem.CheckBox
        checkedColor={'#f4511e'}
        uncheckedColor={'gray'}
        style={{borderColor: black, borderWidth: 1, borderRadius: 3}}
        checked={
          selectedRoutes.filter(ro => ro.routeNumber === routeNumber).length > 0
            ? true
            : false
        }
        onPress={() => {
          selectedRoutes.filter(ro => ro.routeNumber === routeNumber).length > 0
            ? setSelectedRoutes(
                selectedRoutes.filter(r => r.routeNumber !== routeNumber),
              )
            : setSelectedRoutes([
                ...selectedRoutes,
                {routeNumber, routeColor, routeName},
              ]);
        }}
      />
      <ListItem.Title>{props.route.routeName}</ListItem.Title>
      <ListItem.Content
      // style={{
      //   backgroundColor: props.route.routeColor,
      //   height: '100%',
      //   width: '10%',
      // }}>
      ></ListItem.Content>
    </ListItem>
  );
};

export const Buses = () => {
  const {BUS_ROUTES} = useAppState();
  const [busRoutes, setBusRoutes] = useState(false);
  const [searchResults, setSearchResults] = useState(false);
  const [selectedRoutes, setSelectedRoutes] = useState(BUS_ROUTES);
  const dispatch = useAppDispatch();
  const searchBuses = text => {
    const newData = busRoutes.filter(item => {
      const itemData = `${item.routeName.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    setSearchResults(newData);
  };
  const getBusRoutesData = async () => {
    const routesPromise = await Axios({
      method: 'GET',
      url: `http://www.ctabustracker.com/bustime/api/v2/getroutes?key=${Config.CTA_BUS_KEY}&format=json`,
    })
      .catch(error => console.warn(error))
      .then(resp => {
        return resp.data['bustime-response'].routes.map(route => {
          const newRoute = {
            routeNumber: route.rt,
            routeColor: route.rtclr,
            routeName: route.rtnm,
          };
          return newRoute;
        });
      });
    setBusRoutes(routesPromise);
    // return routesPromise;
  };
  useEffect(() => {
    getBusRoutesData();
  }, []);
  useEffect(() => {
    console.log(selectedRoutes);
    dispatch({type: 'SET_BUSES', busRoutes: selectedRoutes});
  }, [selectedRoutes]);
  return (
    <SafeAreaView style={styles.bg}>
      <TextInput
        style={styles.input}
        placeholder="Search for Bus..."
        onChangeText={text => searchBuses(text)}
        clearButtonMode="always"
      />
      {/* <FlatList
        style={styles.busList}
        data={buses}
        renderItem={({item}) => (
          <RouteCheckbox
            route={item}
            selectedRoutes={selectedRoutes}
            handlePress={setSelectedRoutes}
          />
        )}
        keyExtractor={route => route.routeNumber}
      /> */}
      <View style={{marginBottom: 12}}>
        <Text
          style={{
            fontSize: 22,
            fontWeight: '600',
            paddingLeft: 8,
            paddingBottom: 8,
          }}>
          Selected Routes
        </Text>
        {BUS_ROUTES.length > 0
          ? BUS_ROUTES.map(route => (
              <RouteCheckbox
                key={route.routeNumber}
                route={route}
                selectedRoutes={selectedRoutes}
                handlePress={setSelectedRoutes}
              />
            ))
          : null}
      </View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: '600',
          paddingLeft: 8,
          paddingBottom: 8,
        }}>
        Avaliable Routes
      </Text>
      <FlatList
        style={styles.busList}
        removeClippedSubviews={true}
        data={
          searchResults.length ? (
            searchResults
              .filter(bus => {
                return !selectedRoutes.some(b => {
                  // console.log('result', bus.routeNumber !== b.routeNumber);
                  return bus.routeNumber === b.routeNumber;
                });
              })
              .sort((a, b) => (a.routeName > b.routeName ? 1 : -1))
          ) : busRoutes ? (
            busRoutes
              .filter(bus => {
                return !selectedRoutes.some(b => {
                  // console.log('result', bus.routeNumber !== b.routeNumber);
                  return bus.routeNumber === b.routeNumber;
                });
              })
              .sort((a, b) => (a.routeName > b.routeName ? 1 : -1))
          ) : (
            <Text>No Buses!</Text>
          )
        }
        renderItem={({item}) => (
          <RouteCheckbox
            route={item}
            selectedRoutes={selectedRoutes}
            handlePress={setSelectedRoutes}
          />
        )}
        keyExtractor={route => route.routeNumber}
      />
    </SafeAreaView>
  );
};

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  routeCheck: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 2,
    borderColor: '#f4511e',
    borderRadius: 8,
    paddingLeft: 12,
  },
  busList: {
    width: '100%',
  },
});
