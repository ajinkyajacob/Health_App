
export default import('../dist/fe-health/server/server.mjs').then((module) => {
  console.log('api dir called', module);
  return module.app();
});