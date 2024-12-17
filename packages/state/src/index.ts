export { Store } from './store';
export { StateManager } from './state-manager';
export type { StateConfig } from './state-manager';

// Create default state manager instance
const defaultStateManager = new StateManager();
export default defaultStateManager; 