"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logServerInfo = logServerInfo;
// Console
const chalk_1 = __importDefault(require("chalk"));
const cli_table3_1 = __importDefault(require("cli-table3"));
function logServerInfo(ngrokUrl, PORT) {
    // Create a table to output in the CLI
    const table = new cli_table3_1.default({
        head: ['Location', 'URL'], // Define column headers
        colWidths: [20, 80], // Define column widths
    });
    // Add URL information to the table
    table.push(['Backend', `https://striking-illegally-wallaby.ngrok-free.app/`], ['Frontend', 'http://localhost:1337']);
    // If using an App, also add the Redirect URI to the table
    if (!process.env.SITE_TOKEN) {
        table.push(['Redirect URI', `${ngrokUrl}/auth/callback`]);
    }
    // Console log the table
    console.log(table.toString());
    // If using an App, send a note to adjust the app's Redirect URI
    if (!process.env.SITE_TOKEN) {
        console.log(chalk_1.default.blue.inverse('\n\nNOTE:'), chalk_1.default.blue('Update your Redirect URI in your App Settings\n\n'));
    }
}
