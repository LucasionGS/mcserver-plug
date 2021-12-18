const hostname = window.location.hostname;

const protocol = window.location.protocol.replace(/http/, "ws");
console.log(protocol);

const socketUrl = `${protocol}//${hostname}:8091`;
const ws = new WebSocket(socketUrl);

console.log(`Connecting to ${socketUrl}`);

export default ws;