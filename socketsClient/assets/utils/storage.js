import AsyncStorage from "@react-native-async-storage/async-storage"; // Temporal, estaría bien migrar a SQLite

export const save = async function save (key, value) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error(e);
  }
}

export const get = async function get (key, setter) {
  try {
    const value = AsyncStorage.getItem(key);
    if (value !== null) setter(value);
  } catch (e) {
    console.error(e);
  }
}