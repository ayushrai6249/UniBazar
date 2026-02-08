import { io } from 'socket.io-client';

// change it after deploying
const socket = io(import.meta.env.VITE_BACKEND_URL);
export default socket;
