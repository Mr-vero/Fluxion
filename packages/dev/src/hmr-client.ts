let socket: WebSocket | null = null;
let currentHash: string = '';

function connect() {
  socket = new WebSocket(`ws://${location.host}`);

  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case 'update':
        handleUpdate(message);
        break;
      case 'hash':
        handleHash(message);
        break;
      default:
        console.log('Unknown message type:', message.type);
    }
  });

  socket.addEventListener('close', () => {
    console.log('HMR connection lost. Attempting to reconnect...');
    setTimeout(connect, 1000);
  });
}

async function handleUpdate(message: any) {
  const { path, hash } = message;
  
  if (hash && currentHash === hash) {
    return;
  }

  try {
    // Load the updated module
    const module = await import(`${path}?t=${Date.now()}`);
    
    // Update the affected components
    if (module.default?.__fluxion_id) {
      updateComponent(module.default);
    }
    
    currentHash = hash;
  } catch (error) {
    console.error('Failed to apply update:', error);
    window.location.reload();
  }
}

function handleHash(message: any) {
  currentHash = message.hash;
}

function updateComponent(Component: any) {
  // Find all instances of the component in the DOM
  const elements = document.querySelectorAll(
    `[data-fluxion-id="${Component.__fluxion_id}"]`
  );

  elements.forEach((element) => {
    // Get the current props
    const props = JSON.parse(element.getAttribute('data-props') || '{}');
    
    // Create new instance
    const instance = new Component(props);
    
    // Render and replace
    const newElement = instance.render();
    element.parentNode?.replaceChild(newElement, element);
  });
}

// Start HMR
connect(); 