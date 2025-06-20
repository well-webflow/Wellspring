"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectNgrok = exports.getNgrokUrl = exports.startNgrok = void 0;
const ngrok_1 = __importDefault(require("@ngrok/ngrok"));
let publicUrl; // Variable to store the current active ngrok URL
let shuttingDown = false; // Flag to ensure single execution of signal handlers
const startNgrok = (port) => __awaiter(void 0, void 0, void 0, function* () {
    // Disconnect any existing tunnels if publicUrl is already set
    if (publicUrl) {
        console.log('An existing ngrok tunnel was found. Disconnecting...');
        yield (0, exports.disconnectNgrok)(); // Ensure that any existing tunnel is closed before opening a new one
    }
    try {
        // Start a new ngrok tunnel to the specified port
        const listener = yield ngrok_1.default.forward({
            addr: port, // Correct parameter name for ngrok connect
            domain: process.env.NGROK_DOMAIN,
            authtoken: process.env.NGROK_AUTH_TOKEN, // Use the auth token from the environment variables
        });
        publicUrl = listener.url();
        console.log(`Ngrok Tunnel started at ${publicUrl}`);
        return publicUrl; // Return the new ngrok URL
    }
    catch (error) {
        console.error('Error starting ngrok:', error);
        handleShutdown('Error');
        throw new Error('Failed to initialize ngrok'); // Propagate the error
    }
});
exports.startNgrok = startNgrok;
const getNgrokUrl = () => publicUrl; // Getter to access the current ngrok URL
exports.getNgrokUrl = getNgrokUrl;
const disconnectNgrok = () => __awaiter(void 0, void 0, void 0, function* () {
    if (publicUrl) {
        try {
            console.log('Disconnecting ngrok...');
            yield ngrok_1.default.disconnect(publicUrl); // Disconnect the specific ngrok tunnel
            yield ngrok_1.default.kill(); // Optionally kill the ngrok process
            console.log('Ngrok Tunnel disconnected');
        }
        catch (error) {
            console.error('Failed to disconnect ngrok:', error);
        }
        finally {
            publicUrl = null; // Reset publicUrl after disconnection
        }
    }
});
exports.disconnectNgrok = disconnectNgrok;
// Ensure clean shutdown on process exit or restart
const handleShutdown = (signal) => __awaiter(void 0, void 0, void 0, function* () {
    if (shuttingDown)
        return; // Prevent multiple executions
    shuttingDown = true;
    console.log(`Received ${signal}, shutting down gracefully...`);
    yield (0, exports.disconnectNgrok)();
    process.exit(0);
});
process.on('SIGINT', () => handleShutdown('SIGINT')); // Handle interrupt signal
process.on('SIGTERM', () => handleShutdown('SIGTERM')); // Handle termination signal
process.on('SIGUSR2', () => handleShutdown('SIGUSR2')); // Handle signals from tools like nodemon
