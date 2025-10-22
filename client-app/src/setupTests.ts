import '@testing-library/jest-dom';

const mockImportMeta = {
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
  },
};

// Mock import.meta for Jest environment - this is crucial for import.meta.env to work
(globalThis as any).importMeta = mockImportMeta;

// Define import.meta globally for Jest
Object.defineProperty(globalThis, 'import', {
  value: { meta: mockImportMeta },
  writable: true,
  configurable: true
});

// Mock import.meta.env specifically
(globalThis as any).import = { meta: mockImportMeta };

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), 
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [];

  constructor(_callback: IntersectionObserverCallback, _options?: IntersectionObserverInit) {
    // Mock implementation
  }

  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// For Node.js global scope
if (typeof globalThis !== 'undefined') {
  (globalThis as any).IntersectionObserver = MockIntersectionObserver;
}

// Mock React Hot Toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
  Toaster: () => null,
}));