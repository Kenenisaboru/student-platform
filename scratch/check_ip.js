const os = require('os');
const networkInterfaces = os.networkInterfaces();
for (const interfaceName in networkInterfaces) {
  const interfaces = networkInterfaces[interfaceName];
  for (const iface of interfaces) {
    if (iface.family === 'IPv4' && !iface.internal) {
      console.log(`${interfaceName}: ${iface.address}`);
    }
  }
}
