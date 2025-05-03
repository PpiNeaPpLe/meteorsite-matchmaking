// Real MySQL database connection
// Note: You need to run "npm install mysql2" or "yarn add mysql2" first

import mysql from 'mysql2/promise';

// Define the MySQL config interface
export interface MySQLConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

// Default configuration
const defaultConfig: MySQLConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '5334',
  database: 'members_full'
};

// Global cache for the current configuration
let currentConfig: MySQLConfig = defaultConfig;

// Function to get the current configuration
export function getConfig(): MySQLConfig {
  // If we already have a cached config in memory, use it
  if (currentConfig !== defaultConfig) {
    return currentConfig;
  }
  
  // Browser-side config from localStorage
  if (typeof window !== 'undefined') {
    const savedConfig = localStorage.getItem('mysqlConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        // Ensure all required fields are present
        if (
          parsedConfig.host &&
          parsedConfig.user &&
          parsedConfig.database
        ) {
          // Store in memory cache to avoid localStorage reads on every query
          currentConfig = {
            ...defaultConfig,
            ...parsedConfig,
            // Ensure port is a number
            port: typeof parsedConfig.port === 'number' ? parsedConfig.port : defaultConfig.port,
          };
          return currentConfig;
        }
      } catch (e) {
        console.error('Error parsing saved MySQL config:', e);
      }
    }
  }
  return defaultConfig;
}

// Function to update the current configuration
export function updateConfig(newConfig: Partial<MySQLConfig>) {
  currentConfig = { ...getConfig(), ...newConfig };
  
  // Also update localStorage if available
  if (typeof window !== 'undefined') {
    localStorage.setItem('mysqlConfig', JSON.stringify(currentConfig));
  }
  
  return currentConfig;
}

export const db = {
  async query(sql: string, params: any[] = []): Promise<any[]> {
    const config = getConfig();
    const connection = await mysql.createConnection(config);
    try {
      const [results] = await connection.execute(sql, params);
      return results as any[];
    } finally {
      await connection.end();
    }
  },

  async connect() {
    const config = getConfig();
    // Test connection
    const connection = await mysql.createConnection(config);
    console.log("Connected to MySQL database", config.host, config.database);
    await connection.end();
    return connection;
  },

  // Helper to get and update current config
  getConfig,
  updateConfig
}
