import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { stringify } from 'csv-stringify/sync';

const db = SQLite.openDatabase('jamar.db');

const DataService = {
  init: async () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS athletes (id TEXT PRIMARY KEY, name TEXT, sport TEXT, dob TEXT, hand TEXT);`
      );
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS trials (id TEXT PRIMARY KEY, athleteId TEXT, timestamp INTEGER, force_lbs REAL, hand TEXT, deviceId TEXT, notes TEXT);`
      );
    });
  },
  addAthlete: async (athlete) => {
    return new Promise((res, rej) => {
      db.transaction(tx => {
        tx.executeSql('INSERT INTO athletes (id,name,sport,dob,hand) values (?,?,?,?,?)',
          [athlete.id, athlete.name, athlete.sport, athlete.dob, athlete.hand],
          (_, r) => res(r),
          (_, e) => { rej(e); return false; }
        );
      });
    });
  },
  getAthletes: async () => {
    return new Promise((res, rej) => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM athletes', [], (_, { rows }) => res(rows._array));
      });
    });
  },
  saveTrial: async (trial) => {
    const id = 't' + Date.now();
    return new Promise((res, rej) => {
      db.transaction(tx => {
        tx.executeSql('INSERT INTO trials (id,athleteId,timestamp,force_lbs,hand,deviceId,notes) values (?,?,?,?,?,?,?)',
          [id, trial.athleteId, trial.timestamp, trial.force_lbs, trial.hand, trial.deviceId, trial.notes || ''],
          (_, r) => res(r),
          (_, e) => { rej(e); return false; }
        );
      });
    });
  },
  getTrials: async () => {
    return new Promise((res, rej) => {
      db.transaction(tx => {
        tx.executeSql('SELECT * FROM trials', [], (_, { rows }) => res(rows._array));
      });
    });
  },
  exportCSV: async () => {
    const trials = await DataService.getTrials();
    const header = ['id','athleteId','timestamp','force_lbs','hand','deviceId','notes'];
    const records = trials.map(t => [t.id,t.athleteId,t.timestamp,t.force_lbs,t.hand,t.deviceId,t.notes]);
    const csv = stringify([header, ...records]);
    const path = FileSystem.documentDirectory + 'jamar_trials.csv';
    await FileSystem.writeAsStringAsync(path, csv, { encoding: FileSystem.EncodingType.UTF8 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path);
    } else {
      alert('CSV saved to ' + path);
    }
  }
};

export default DataService;
