import React, {useState, createRef, useEffect} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {Picker} from '@react-native-picker/picker';

import {useFocusEffect} from '@react-navigation/native';

import TcpSocket from 'react-native-tcp-socket';

const DeregistrationScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [url1, seturl] = useState('');
  const [contact, setcontact] = useState('');
  const [userEmail, setuserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [application, setApplication] = useState('');
  const passwordInputRef = createRef();
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

  const handleSubmitPress = () => {
    let dataToSend = JSON.stringify({
      credentials: {
        // UserName: userName,
        // Password: userPassword,
        // Application: application,
        // Type: 'Both',
        // Action: 'Derigistration',
        // Emailid: userEmail,
        // PNo: contact,
        // Url: url1,
      },
    });
    console.log(
      '----------------------------------------------------------------',
    );
    console.log('data passed to webservice==>', dataToSend);
    let url = 'https://livefiles.sowcare.net/api/auth?pubsubId=0';

    retrieveData();

    async function retrieveData() {
      const read = await AsyncStorage.getItem('registration');
      let parse = JSON.parse(read);
      webservice(parse);
    }

    function webservice(parse) {
      fetch('https://livefiles.sowcare.net/api/AddelUser', {
        method: 'POST',
        withCredentials: true,
        credentials: 'include',
        headers: {
          Authorization: 'bearer' + '83l626XhHk',
          'Content-Type': 'application/json',
        },
        body: dataToSend,
      })
        .then(response => response.json())
        .then(data => {
          console.log('response from webservice ===>', data);
          console.log('status ===>', data.Status);
          if (data.Status == 'DeRegistartion Successsfull') {
            let client = TcpSocket.createConnection(
              {port: 9000, host: 'localhost'},
              () => {
                client.write(
                  JSON.stringify({
                    Pub_Sub_Id: data.Pub_Sub_Id,
                    application: parse.application,
                    key: parse.key,
                    //  query3:
                    //   'DELETE FROM  user_registration  where  Pub_Sub_Id=?',
                    query3: `DELETE FROM  user_registration 
                      WHERE EXISTS (SELECT 1 FROM client_registration WHERE Application= ? AND key = ?) 
                       AND  Pub_Sub_Id= ? `,
                  }),
                );
              },
            );
            // client.on('connect', () => {
            //   console.log('Opened [client1] on ' + JSON.stringify(client.address()));
            // });
            client.on('data', data => {
              console.log(
                'message from user_registration table==>',
                data.toString(),
              );
              Alert.alert('DeRegistartion Successsfull');
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
          } else if (data.Status == 'User has already DeRegistered') {
            let client = TcpSocket.createConnection(
              {port: 9000, host: 'localhost'},
              () => {
                client.write(
                  JSON.stringify({
                    Pub_Sub_Id: data.Pub_Sub_Id,
                    application: parse.application,
                    key: parse.key,
                    //  query3:
                    //   'DELETE FROM  user_registration  where  Pub_Sub_Id=?',
                    query3: `DELETE FROM  user_registration 
                      WHERE EXISTS (SELECT 1 FROM client_registration WHERE Application = ? AND key = ?) 
                       AND  Pub_Sub_Id=?`,
                  }),
                );
              },
            );
            // client.on('connect', () => {
            //   console.log('Opened [client1] on ' + JSON.stringify(client.address()));
            // });
            client.on('data', data => {
              console.log(
                'message from user_registration table==>',
                data.toString(),
              );
              Alert.alert('User has already DeRegistered');
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
          } else if (data.Status == 'Invalid Credentials!!!!') {
            Alert.alert('Invalid Credentials!!!!');
          } else if (data.Status == 'Incorrect Credentials') {
            Alert.alert('Incorrect Credentials');
          }
        })
        .catch(error => {
          console.error('error in webservice====>', error);
        });
    }
  };

  return (
    <View style={styles.mainBody}>
      <FlatList
        keyExtractor={(item, id) => id}
        data={list}
        renderItem={({item}) => (
          <View>
            <Text style={styles.textStyle}>{item.Name}</Text>
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}> Submit </Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => {
          return <View style={styles.separatorLine}></View>;
        }}
      />
    </View>
  );
};
export default DeregistrationScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#307ecc',
    alignContent: 'center',
  },
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#307e',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE2',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 25,
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
  registerTextStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  picker: {
    width: 300,
    height: 45,
    color: 'white',
    backgroundColor: 'blue',
    alignSelf: 'center',
    textAlign: 'center',
  },
});
