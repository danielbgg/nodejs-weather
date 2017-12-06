console.log('Starting app...');

setTimeout(() => {
  console.log('Inside of callback');
}, 2*1000);

setTimeout(() => {
  console.log('Second timeout');
}, 0*1000);

console.log('Finishing up');
