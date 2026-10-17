// Secure storage interface for sensitive credentials & tokens

class SecureStorageService {
  private secureStore: Map<string, string> = new Map();

  async setSecureItem(key: string, value: string): Promise<void> {
    this.secureStore.set(key, value);
  }

  async getSecureItem(key: string): Promise<string | null> {
    return this.secureStore.has(key) ? this.secureStore.get(key)! : null;
  }

  async removeSecureItem(key: string): Promise<void> {
    this.secureStore.delete(key);
  }

  async clear(): Promise<void> {
    this.secureStore.clear();
  }
}

export const secureStorage = new SecureStorageService();
