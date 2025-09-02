class EFIInterpreter {
    constructor(outputReceiver = console.log, inputRequester = null) {
        this.preloadedAssets = {};
        this.currentDirectory = '/'; // Default root directory
        this.output = []; // To store log messages and actions
        this.delayQueue = Promise.resolve(); // For sequential execution with delays

        // Callback function to send output to (e.g., console.log, or a UI element)
        this.outputReceiver = outputReceiver;
        // Function to request input from the user (e.g., browser's prompt, Node.js readline)
        this.inputRequester = inputRequester;

        this.variables = {}; // To store user-defined variables
    }

    // Sends output to the registered receiver
    _sendOutput(message) {
        this.output.push(message);
        this.outputReceiver(message);
    }

    // Introduce a delay in the execution flow
    _addDelay(ms) {
        this.delayQueue = this.delayQueue.then(() => {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
        return this.delayQueue;
    }

    // Helper to normalize paths
    normalizePath(path) {
        let parts = path.split('/').filter(p => p !== '');
        let newParts = [];
        for (const part of parts) {
            if (part === '..') {
                newParts.pop(); // Go up one level
            } else if (part === '.') {
                // Stay in current directory
            } else {
                newParts.push(part);
            }
        }
        return '/' + newParts.join('/');
    }

    // Command handlers
    async handlePreload(args) {
        let directory = args[0];
        let options = {};
        for (let i = 1; i < args.length; i++) {
            let [key, value] = args[i].split(':');
            if (key && value) {
                options[key.trim()] = value.trim();
            }
        }

        let fullPath = directory;
        if (!fullPath.startsWith('/')) {
            fullPath = this.normalizePath(this.currentDirectory + '/' + directory);
        }

        if (fullPath.includes('/*')) {
            let baseDir = fullPath.substring(0, fullPath.lastIndexOf('/*'));
            let fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
            fullPath = this.normalizePath(baseDir + '/' + fileName);
        }

        let ptype = options.ptype || 'unknown';
        let plevel = options.plevel || 'Invoker';
        let filename = options.Filename || fullPath.split('/').pop();

        this.preloadedAssets[fullPath] = {
            filename: filename,
            type: ptype,
            level: plevel,
            originalPath: directory
        };
        this._sendOutput(`Preloaded: ${fullPath} (Type: ${ptype}, Level: ${plevel}, Display: ${filename})`);
    }

    async handlePrint(type, content) {
        // Resolve variables if they exist
        let processedContent = content;
        if (content.startsWith('$') && this.variables[content.substring(1)]) {
            processedContent = this.variables[content.substring(1)];
        }
        this._sendOutput(`[PRINT ${type.toUpperCase()}]: ${processedContent}`);
    }

    async handleChangeDirectory(path) {
        if (path.startsWith('/')) {
            this.currentDirectory = this.normalizePath(path);
        } else {
            this.currentDirectory = this.normalizePath(this.currentDirectory + '/' + path);
        }
        this._sendOutput(`Changed directory to: ${this.currentDirectory}`);
    }

    async handleBoot(path) {
        this._sendOutput(`BOOTING: ${path}`);
    }

    async handleDelay(ms) {
        this._sendOutput(`[SYSTEM]: Delaying for ${ms}ms...`);
        await this._addDelay(parseInt(ms, 10));
    }

    async handleReceive(variableName, promptMessage) {
        if (!this.inputRequester) {
            this._sendOutput(`[ERROR]: No inputRequester provided for $receive command.`);
            return;
        }
        this._sendOutput(`[INPUT]: ${promptMessage || `Awaiting input for ${variableName}`}`);
        await this._addDelay(100); // Give a small visual delay before input
        const input = await this.inputRequester(promptMessage || `Enter value for ${variableName}: `);
        this.variables[variableName] = input;
        this._sendOutput(`[INPUT]: Received "${input}" for variable "${variableName}"`);
    }

    async handleSet(variableName, value) {
        this.variables[variableName] = value;
        this._sendOutput(`[VAR]: Set ${variableName} = "${value}"`);
    }

    // Main interpretation logic
    async interpret(efiCode) {
        const lines = efiCode.split('\n');
        let inPreloadSection = false;

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (trimmedLine === '' || trimmedLine.startsWith('#')) {
                continue;
            }

            if (trimmedLine === '@preload@') {
                inPreloadSection = true;
                this._sendOutput("--- Starting Preload Section ---");
                continue;
            }
            if (trimmedLine === '@preload end@') {
                inPreloadSection = false;
                this._sendOutput("--- Preload Section Ended ---");
                continue;
            }

            // Ensure commands are executed sequentially, respecting delays
            await this.delayQueue;

            if (trimmedLine.startsWith('$')) {
                const parts = trimmedLine.substring(1).split(':');
                const command = parts[0].trim();
                const argsString = parts.slice(1).join(':').trim();

                switch (command) {
                    case 'p':
                        const preloadArgs = argsString.split('|').map(arg => arg.trim());
                        await this.handlePreload(preloadArgs);
                        break;
                    case 'print{str}':
                        await this.handlePrint('str', argsString);
                        break;
                    case 'cd':
                        await this.handleChangeDirectory(argsString);
                        break;
                    case 'boot':
                        await this.handleBoot(argsString);
                        break;
                    case 'delay':
                        await this.handleDelay(argsString);
                        break;
                    case 'receive':
                        // $receive: {variableName} | {promptMessage}
                        const receiveArgs = argsString.split('|').map(arg => arg.trim());
                        await this.handleReceive(receiveArgs[0], receiveArgs[1]);
                        break;
                    case 'set':
                        // $set: {variableName} = {value}
                        const setParts = argsString.split('=').map(p => p.trim());
                        if (setParts.length === 2) {
                            await this.handleSet(setParts[0], setParts[1]);
                        } else {
                            this._sendOutput(`[ERROR]: Invalid $set command: ${trimmedLine}`);
                        }
                        break;
                    default:
                        this._sendOutput(`[ERROR]: Unknown command: $${command}`);
                }
            }
        }
        this._sendOutput("\n--- INTERPRETATION COMPLETE ---");
        this._sendOutput("Preloaded Assets:");
        for (const path in this.preloadedAssets) {
            this._sendOutput(`  ${path}: ${JSON.stringify(this.preloadedAssets[path])}`);
        }
        this._sendOutput("Final Variables:");
        for (const varName in this.variables) {
            this._sendOutput(`  ${varName} = "${this.variables[varName]}"`);
        }
        return this.output.join('\n');
    }
}

// --- Example Usage in a Browser-like environment ---
// This part simulates a terminal in the browser's console or a Node.js script.

// A simple output receiver for console
const consoleOutputReceiver = (message) => console.log(message);

// A simple input requester for demonstration (needs to be adapted for real user input)
// In a browser, you'd use `prompt()`. In Node.js, you'd use `readline`.
const demoInputRequester = async (promptMessage) => {
    console.log(`(Simulating input for: ${promptMessage})`);
    // In a real scenario, you'd pause and wait for user input.
    // For this demo, we'll return a predefined value or a mock.
    // Replace this with `prompt(promptMessage)` in a browser
    // or `await askQuestion(promptMessage)` with Node.js readline.
    if (promptMessage.includes("your name")) return "Alice";
    if (promptMessage.includes("password")) return "securePass123";
    return "default_input";
};

// --- Node.js Readline for actual input (uncomment and use in Node.js) ---
/*
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const nodeReadlineRequester = (promptMessage) => {
    return new Promise(resolve => {
        rl.question(promptMessage, (answer) => {
            resolve(answer);
        });
    });
};
// Use rl.close() when done with input
*/
