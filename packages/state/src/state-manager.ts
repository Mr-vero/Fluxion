import { Store } from './store';

export interface StateConfig {
  persistence?: boolean;
  sync?: boolean;
}

export class StateManager {
  private stores: Map<string, Store<any>> = new Map();
  private config: StateConfig;

  constructor(config: StateConfig = {}) {
    this.config = {
      persistence: config.persistence ?? false,
      sync: config.sync ?? false
    };
  }

  /**
   * Create or get a store with the given key
   */
  store<T>(key: string, initialState: T): Store<T> {
    if (this.stores.has(key)) {
      return this.stores.get(key) as Store<T>;
    }

    const store = new Store<T>(initialState);
    this.stores.set(key, store);

    if (this.config.persistence) {
      this.setupPersistence(key, store);
    }

    if (this.config.sync) {
      this.setupSync(key, store);
    }

    return store;
  }

  private setupPersistence<T>(key: string, store: Store<T>) {
    // Load initial state from storage if available
    const stored = localStorage.getItem(`fluxion:${key}`);
    if (stored) {
      try {
        store.set(JSON.parse(stored));
      } catch (e) {
        console.error(`Failed to load persisted state for ${key}:`, e);
      }
    }

    // Save state changes to storage
    store.subscribe((value) => {
      localStorage.setItem(`fluxion:${key}`, JSON.stringify(value));
    });
  }

  private setupSync<T>(key: string, store: Store<T>) {
    // Setup cross-tab/window synchronization using BroadcastChannel
    const channel = new BroadcastChannel(`fluxion:${key}`);
    
    channel.onmessage = (event) => {
      store.set(event.data);
    };

    store.subscribe((value) => {
      channel.postMessage(value);
    });
  }
} 