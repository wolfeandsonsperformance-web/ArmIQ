import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, Button, TextInput } from 'react-native';
import DataService from '../services/dataService';

export default function AthleteList() {
  const [athletes, setAthletes] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    (async () => {
      await DataService.init();
      const a = await DataService.getAthletes();
      setAthletes(a);
    })();
  }, []);

  async function add() {
    if (!name.trim()) return;
    await DataService.addAthlete({name, sport:'baseball', dob:'', id:Date.now().toString(), hand:'right'});
    setName('');
    const a = await DataService.getAthletes();
    setAthletes(a);
  }

  return (
    <View style={{flex:1,padding:16}}>
      <Text style={{fontSize:18,fontWeight:'600'}}>Athletes</Text>
      <View style={{flexDirection:'row',marginTop:12}}>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={{flex:1,borderWidth:1,padding:8,borderRadius:6}} />
        <View style={{width:8}} />
        <Button title="Add" onPress={add} />
      </View>
      <FlatList data={athletes} keyExtractor={i=>i.id} renderItem={({item})=>(
        <View style={{padding:12,borderBottomWidth:1,borderColor:'#eee'}}><Text>{item.name} — {item.sport}</Text></View>
      )} />
    </View>
  );
}
