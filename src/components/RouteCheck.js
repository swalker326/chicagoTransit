import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {CheckBox} from 'react-native-elements';

export const RouteCheckbox = (props) => {
  const [checked, setChecked] = useState(false);

  return (
    <View>
      <View style={styles.routeCheck}>
        <CheckBox
          checked={checked}
          onPress={() => setChecked(checked)}
          checkedIcon="dot-circle-o"
          checkedColor={'#f4511e'}
          title={props.item.routeName}
        />
        {/* <BouncyCheckbox
              size={25}
              fillColor="#f4511e"
              unfillColor="#FFFFFF"
              iconStyle={{borderColor: 'gray'}}
              onPress={e => console.log(e)}
            />
            <Text>{props.item.routeName}</Text> */}
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
});
