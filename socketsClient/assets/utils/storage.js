import AsyncStorage from "@react-native-async-storage/async-storage"; // Temporal, estaría bien migrar a SQLite
const Storage = {
  save(key, value) {
    try {
      AsyncStorage.setItem(key, value);
    } catch (e) {
      console.error(e);
    }
  },

  get(key, setter) {
    try {
      const value = AsyncStorage.getItem(key);
      if (value !== null) setter(value);
    } catch (e) {
      console.error(e);
    }
  }
}

export default storage;