import { BleManager } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import { Platform, PermissionsAndroid } from 'react-native';

const manager = new BleManager();

const BleService = {
  initialize: () => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      ]);
    }
  },
  destroy: () => {
    try { manager.destroy(); } catch(e){}
  },
  scan: (onDeviceFound) => {
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.warn('scan error', error);
        return;
      }
      const name = (device && (device.name || device.localName || '')).toLowerCase();
      if (name.includes('jamar')) {
        onDeviceFound({ id: device.id, name: device.name, rssi: device.rssi });
      }
    });
  },
  stopScan: () => manager.stopDeviceScan(),
  connect: async (deviceId) => {
    try {
      const device = await manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      return true;
    } catch(e) {
      console.warn('connect error', e);
      return false;
    }
  },
  subscribe: (deviceId, onValue) => {
    (async () => {
      try {
        const device = await manager.devices([deviceId]);
        const d = device[0];
        const services = await d.services();
        for (const s of services) {
          const chars = await s.characteristics();
          for (const c of chars) {
            if (c.isNotifiable || c.isNotifying || c.isReadable) {
              manager.monitorCharacteristicForDevice(deviceId, s.uuid, c.uuid, (err, characteristic) => {
                if (err) {
                  console.warn('monitor err', err);
                  return;
                }
                const raw = Buffer.from(characteristic.value, 'base64');
                let value = null;
                if (raw.length >= 2) {
                  value = raw.readUInt16LE(0);
                }
                if (raw.length >= 4 && typeof raw.readFloatLE === 'function') {
                  const f = raw.readFloatLE(0);
                  if (!Number.isNaN(f) && Math.abs(f) < 1e6) value = f;
                }
                onValue(value);
              });
              return;
            }
          }
        }
      } catch(e) {
        console.warn('subscribe error', e);
      }
    })();
  },
  unsubscribe: (deviceId) => {
    try { manager.stopDeviceScan(); } catch(e) {}
  }
};

export default BleService;
