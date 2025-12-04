import React from 'react';
import { View, Text, Button } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:20}}>
      <Text style={{fontSize:22,fontWeight:'bold',marginBottom:20}}>Jamar Smart Grip App</Text>
      <Button title="Athletes" onPress={() => navigation.navigate('Athletes')} />
      <View style={{height:12}} />
      <Button title="Scan Devices" onPress={() => navigation.navigate('Scan')} />
      <View style={{height:12}} />
      <Button title="Start Grip Test (mock)" onPress={() => navigation.navigate('GripTest',{mock:true})} />
    </View>
  );
}
