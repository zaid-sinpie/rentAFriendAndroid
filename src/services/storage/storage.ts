import AsyncStorage from '@react-native-async-storage/async-storage';

class StorageService {
  private memoryFallback: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    try {
      const val = await AsyncStorage.getItem(key);
      if (val !== null) return val;
      return this.memoryFallback.get(key) || null;
    } catch {
      return this.memoryFallback.get(key) || null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    this.memoryFallback.set(key, value);
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // in-memory fallback stored
    }
  }

  async removeItem(key: string): Promise<void> {
    this.memoryFallback.delete(key);
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  }

  async clear(): Promise<void> {
    this.memoryFallback.clear();
    try {
      await AsyncStorage.clear();
    } catch {
      // ignore
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return Array.from(new Set([...keys, ...Array.from(this.memoryFallback.keys())]));
    } catch {
      return Array.from(this.memoryFallback.keys());
    }
  }
}

export const storage = new StorageService();
