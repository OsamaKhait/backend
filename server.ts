import http from 'http';
import app from './app'; // Ensure `app.ts` is the entry point of your Express app

// Normalize port into a number, string, or false
const normalizePort = (val: string): number | string | false => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Set the port
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Error handler function
const errorHandler = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use.`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Create the server
const server = http.createServer(app);

// Attach event listeners
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;
  console.log(`Listening on ${bind}`);
});

// Start the server
server.listen(port);
