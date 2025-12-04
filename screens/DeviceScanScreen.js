import React, {useEffect, useState} from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import BleService from '../services/bleService';

export default function DeviceScanScreen({ navigation }) {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    BleService.initialize();
    return () => BleService.destroy();
  }, []);

  function startScan() {
    setDevices([]);
    BleService.scan((d) => {
      setDevices((prev)=> {
        if (prev.find(p=>p.id===d.id)) return prev;
        return [...prev,d];
      });
    });
    setTimeout(()=>BleService.stopScan(),10000);
  }

  async function connect(device) {
    const res = await BleService.connect(device.id);
    if (res) {
      navigation.navigate('GripTest',{deviceId: device.id});
    } else {
      alert('Failed to connect');
    }
  }

  return (
    <View style={{flex:1,padding:12}}>
      <Button title="Start Scan (look for 'Jamar')" onPress={startScan} />
      <FlatList data={devices} keyExtractor={i=>i.id} renderItem={({item})=>(
        <View style={{padding:10,borderBottomWidth:1,borderColor:'#eee'}}>
          <Text>{item.name || item.localName || 'Unnamed'} — {item.id}</Text>
          <Button title="Connect" onPress={()=>connect(item)} />
        </View>
      )} />
    </View>
  );
}
