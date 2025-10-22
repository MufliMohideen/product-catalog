export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      useESM: true,
      tsconfig: {
        module: 'es2022',
        target: 'es2022',
        jsx: 'react-jsx',
        moduleResolution: 'node',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        skipLibCheck: true,
        isolatedModules: true,
        types: ['node', 'jest', '@testing-library/jest-dom', 'vite/client'],
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        allowImportingTsExtensions: false
      }
    }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png|jpg|jpeg)$': '<rootDir>/src/__mocks__/fileMock.js',
    '^../assets/logo\\.png$': '<rootDir>/src/__mocks__/fileMock.js'
  },
  globals: {
    'import.meta': {
      env: {
        VITE_API_BASE_URL: 'http://localhost:5073/api',
        VITE_API_TIMEOUT: '10000',
        VITE_APP_NAME: 'TECH SPACE',
        VITE_APP_VERSION: '1.0.0',
        VITE_APP_ENVIRONMENT: 'test',
        VITE_ENABLE_DEBUG_LOGS: 'true',
        VITE_ENABLE_REQUEST_LOGGING: 'true',
        VITE_ITEMS_PER_PAGE: '10',
        VITE_DEFAULT_CURRENCY: 'LKR',
        VITE_DEV_SERVER_PORT: '3000',
      }
    }
  },
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons']
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/?(*.)(spec|test).(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'src/**/*.(ts|tsx)',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$))'
  ]
};
