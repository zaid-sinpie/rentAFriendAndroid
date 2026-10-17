// Configuration boundary for real API integration & mock network simulation

export interface ApiConfig {
  baseUrl: string;
  timeoutMs: number;
  isMockMode: boolean;
}

export const apiConfig: ApiConfig = {
  baseUrl: 'https://api.rentafriend.example.com/v1',
  timeoutMs: 10000,
  isMockMode: true, // Prototype runs seamlessly without external server
};

export const simulateNetworkDelay = (ms: number = 400): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
