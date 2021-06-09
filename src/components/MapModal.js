import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';

const MapModal = ({content}) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <TouchableOpacity
          style={styles.bottomHalfView}
          onPress={() => setModalVisible(false)}>
          <View style={styles.modalView}>{content}</View>
        </TouchableOpacity>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}>
        <Text style={styles.textStyle}>Show Modal</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  bottomHalfView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    paddingTop: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    width: '100%',
    height: '40%',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default MapModal;
