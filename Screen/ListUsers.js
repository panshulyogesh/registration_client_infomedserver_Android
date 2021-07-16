import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Button,
} from 'react-native';
import TcpSocket from 'react-native-tcp-socket';

const ListUsers = ({navigation}) => {
  const [list, setList] = useState([]);

  const retrieve = async () => {
    console.log('-----Registered USERS------');
    let client = TcpSocket.createConnection(
      {port: 9000, host: 'localhost'},
      () => {
        client.write(
          JSON.stringify({
            query5: 'SELECT * FROM user_registration',
          }),
        );
      },
    );

    client.on('data', data => {
      console.log('message from user_registration table==>', data.toString());
      let var1 = data.toString();
      if (var1) {
        setList(JSON.parse(var1));
      }
      client.end();
    });
    client.on('error', error => {
      console.log(error);
      client.end();
    });
    client.on('close', () => {
      console.log('Connection closed!');
      client.end();
    });
  };

  useEffect(() => {
    retrieve();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#307ecc'}}>
      <FlatList
        keyExtractor={(item, id) => id}
        data={list}
        renderItem={({item}) => (
          <View>
            <Text style={styles.textStyle}>{item.Name}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => {
          return <View style={styles.separatorLine}></View>;
        }}
      />
    </View>
  );
};
export default ListUsers;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#fff',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
