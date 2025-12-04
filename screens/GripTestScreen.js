import React, {useEffect, useState, useRef} from 'react';
import { View, Text, Button } from 'react-native';
import BleService from '../services/bleService';
import DataService from '../services/dataService';

export default function GripTestScreen({ route, navigation }) {
  const { deviceId, mock } = route.params || {};
  const [live, setLive] = useState(null);
  const [trial, setTrial] = useState(0);
  const [peaks, setPeaks] = useState([]);
  const trialCount = 3;
  const peakRef = useRef(0);

  useEffect(() => {
    if (mock) {
      const t = setInterval(()=> {
        const v = Math.round(Math.random()*100);
        setLive(v);
        if (v>peakRef.current) peakRef.current = v;
      }, 300);
      return ()=>clearInterval(t);
    }
    if (deviceId) {
      BleService.subscribe(deviceId, (value)=>{
        setLive(value);
        if (value>peakRef.current) peakRef.current = value;
      });
    }
    return ()=>BleService.unsubscribe(deviceId);
  },[]);

  async function capture() {
    const peak = peakRef.current;
    setPeaks(prev=>[...prev,peak]);
    peakRef.current = 0;
    setTrial(t=>t+1);
    await DataService.saveTrial({ athleteId: null, timestamp: Date.now(), force_lbs: peak, hand: 'right', deviceId: deviceId || 'mock' });
    if (trial+1 >= trialCount) {
      alert('Trials complete');
    }
  }

  return (
    <View style={{flex:1,alignItems:'center',padding:20}}>
      <Text style={{fontSize:20,fontWeight:'600'}}>Grip Test</Text>
      <Text style={{fontSize:48,marginVertical:20}}>{live !== null ? live + ' lbs' : '---'}</Text>
      <Text>Trial {trial+1} of {trialCount}</Text>
      <View style={{height:12}} />
      <Button title="Capture Peak" onPress={capture} />
      <View style={{height:12}} />
      <Button title="Export CSV" onPress={()=>DataService.exportCSV()} />
    </View>
  );
}
