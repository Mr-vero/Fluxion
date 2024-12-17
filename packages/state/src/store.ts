type Subscriber<T> = (value: T) => void;
type Unsubscribe = () => void;

export class Store<T> {
  private state: T;
  private subscribers: Set<Subscriber<T>> = new Set();
  private derivedStores: Map<string, Store<any>> = new Map();

  constructor(initialState: T) {
    this.state = initialState;
  }

  /**
   * Get current state value
   */
  get value(): T {
    return this.state;
  }

  /**
   * Update state with new value
   */
  set(newState: T | ((currentState: T) => T)) {
    const nextState = typeof newState === 'function'
      ? (newState as Function)(this.state)
      : newState;

    if (this.state !== nextState) {
      this.state = nextState;
      this.notify();
    }
  }

  /**
   * Subscribe to state changes
   */
  subscribe(subscriber: Subscriber<T>): Unsubscribe {
    this.subscribers.add(subscriber);
    
    // Immediately call subscriber with current state
    subscriber(this.state);

    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  /**
   * Create a derived store that updates when this store changes
   */
  derive<R>(selector: (state: T) => R): Store<R> {
    const key = selector.toString();
    
    if (this.derivedStores.has(key)) {
      return this.derivedStores.get(key)!;
    }

    const derivedStore = new Store<R>(selector(this.state));
    
    this.subscribe((value) => {
      derivedStore.set(selector(value));
    });

    this.derivedStores.set(key, derivedStore);
    return derivedStore;
  }

  private notify() {
    this.subscribers.forEach(subscriber => subscriber(this.state));
  }
} 