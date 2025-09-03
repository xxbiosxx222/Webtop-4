// === NovaScript Interpreter v0.3 ===
// Requires windowManager.js to be imported in your project
import { WindowManager } from './windowManager.js';

// --- Helper for parsing complex object literals (improved) ---
function parseComplexObject(objString) {
    try {
        // Attempt to parse as strict JSON
        // We need to wrap it in {} if it's just the content of an object
        return JSON.parse(`{${objString}}`);
    } catch (e) {
        // Fallback for less strict NovaScript object syntax
        // This is a simplified parser and won't handle all edge cases of nested objects/arrays perfectly
        // without a full-blown tokenizer/parser.
        const result = {};
        let cursor = 0;
        while (cursor < objString.length) {
            // Find key
            const keyMatch = objString.substring(cursor).match(/^\s*(?:(["'`])(.*?)\1|([a-zA-Z_$][a-zA-Z0-9_$]*))\s*:\s*/);
            if (!keyMatch) break; // No more keys

            let key = keyMatch[2] || keyMatch[3]; // Quoted key or unquoted key
            cursor += keyMatch[0].length;

            // Find value
            let valueStr = '';
            let valStart = cursor;
            let bracketCount = 0;
            let braceCount = 0;
            let inString = false;
            let stringDelimiter = '';

            while (cursor < objString.length) {
                const char = objString[cursor];
                if (inString) {
                    if (char === stringDelimiter) {
                        inString = false;
                    }
                } else if (char === '{') {
                    braceCount++;
                } else if (char === '[') {
                    bracketCount++;
                } else if (char === '}') { // Should not happen in value, but for safety
                    if (braceCount === 0) break;
                    braceCount--;
                } else if (char === ']') { // Should not happen in value, but for safety
                    if (bracketCount === 0) break;
                    bracketCount--;
                } else if (char === '"' || char === "'" || char === '`') {
                    inString = true;
                    stringDelimiter = char;
                } else if (char === ',' && braceCount === 0 && bracketCount === 0) {
                    break; // End of value
                }
                valueStr += char;
                cursor++;
            }

            valueStr = valueStr.trim();
            let value;
            try {
                value = JSON.parse(valueStr); // Try parsing as JSON (numbers, booleans, null, strings)
            } catch (e) {
                // If not JSON, treat as a string or raw value
                if (valueStr.startsWith('"') && valueStr.endsWith('"')) value = valueStr.slice(1, -1);
                else if (valueStr.startsWith("'") && valueStr.endsWith("'")) value = valueStr.slice(1, -1);
                else if (valueStr.startsWith("`") && valueStr.endsWith("`")) value = valueStr.slice(1, -1);
                else if (valueStr === 'true') value = true;
                else if (valueStr === 'false') value = false;
                else if (valueStr === 'null') value = null;
                else if (!isNaN(Number(valueStr))) value = Number(valueStr);
                else value = valueStr; // Default to string
            }
            result[key] = value;
            if (objString[cursor] === ',') cursor++; // Skip comma
        }
        return result;
    }
}


const NovaModules = {
    echo: (msg) => console.log("[NovaScript]", msg),

    // --- File system (cached, quota enforced) ---
    fs: {
        basePath: "os/nscript/",
        maxStorageMB: 1199686,
        storage: {}, // in-memory cache
        getUsedMB() {
            let usedBytes = 0;
            for (let k in this.storage) usedBytes += new Blob([this.storage[k]]).size;
            return usedBytes / (1024*1024);
        },
        writeFile(path, content) {
            const fullPath = this.basePath + path;
            const sizeMB = new Blob([content]).size / (1024*1024);
            if (this.getUsedMB() + sizeMB > this.maxStorageMB)
                throw new Error(`[fs] Not enough storage to write ${path}`);
            this.storage[fullPath] = content;
            console.log(`[fs] Written to ${fullPath} (${sizeMB.toFixed(2)} MB)`);
        },
        readFile(path) {
            return this.storage[this.basePath + path] || "";
        },
        deleteFile(path) {
            delete this.storage[this.basePath + path];
            console.log(`[fs] Deleted ${path}`);
        },
        listFiles() {
            return Object.keys(this.storage)
                         .filter(k => k.startsWith(this.basePath))
                         .map(k => k.replace(this.basePath,""));
        }
    },

    // --- Shading API (system-handled glass) ---
    
    shadingapi: {
        applyGlass(win) {
            if (win) {
                win._glass = true; // system applies CSS automatically
                console.log(`[shadingapi] Glass effect applied to ${win.title}`);
            } else {
                console.warn("[shadingapi] No window provided to apply glass effect.");
            }
        }
    },
    math: {
    // Add two numbers
    add: (a, b) => Number(a) + Number(b),

    // Subtract
    sub: (a, b) => Number(a) - Number(b),

    // Multiply
    mul: (a, b) => Number(a) * Number(b),

    // Divide
    div: (a, b) => Number(a) / Number(b),

    // Power
    pow: (a, b) => Math.pow(Number(a), Number(b)),

    // Modulo
    mod: (a, b) => Number(a) % Number(b),

    // Evaluate a string expression
    evalExpr: (expr, context = {}) => {
        // Replace variables in context
        for (let key in context) {
            expr = expr.replaceAll(key, context[key]);
        }
        try {
            return Function(`return ${expr}`)();
        } catch (e) {
            console.error("[NovaScript][math] Invalid expression:", expr);
            return null;
        }
    }
 },
    // --- UI Module (conceptual, for event handling demo) ---
    ui: {
        elements: {}, // Stores references to conceptual UI elements
        createButton(params) {
            const btnId = params.id || `button_${Object.keys(this.elements).length}`;
            const btn = { id: btnId, type: 'button', text: params.text || 'Button', ...params };
            this.elements[btnId] = btn;
            console.log(`[ui] Created button: ${btnId} with text "${btn.text}"`);
            return btn;
        },
        // In a real system, this would simulate a click event
        simulateClick(btnId) {
            if (this.elements[btnId]) {
                console.log(`[ui] Simulating click on button: ${btnId}`);
                // Placeholder for actual event dispatching
            } else {
                console.warn(`[ui] Button ${btnId} not found for click simulation.`);
            }
        }
    }
};

// === novaMData parser ===
function parseNovaMData(code) {
    code = code.trim();
    if (!code.startsWith("novaMData")) return [null, code];

    const startIdx = code.indexOf("{");
    const endIdx = code.indexOf("}");
    if (startIdx === -1 || endIdx === -1) return [null, code];

    const metaBlock = code.slice(startIdx + 1, endIdx).trim();
    const restCode = code.slice(endIdx + 1);

    const meta = {};
    const lines = metaBlock.split("\n").map(l => l.trim()).filter(l => l);
    for (let line of lines) {
        const match = line.match(/^(\w+):\s*(.+?)(,?\s*\/\/.*)?$/);
        if (match) {
            const key = match[1];
            let value = match[2].trim();
            if (/^".*"$/.test(value)) value = value.slice(1,-1);
            else if (/^\d+$/.test(value)) value = Number(value);
            meta[key] = value;
        }
    }
    return [meta, restCode];
}

// Helper to evaluate simple conditions
function evaluateCondition(condition, context) {
    // Supports simple comparisons: var OP value, value OP var, var OP var
    const match = condition.match(/^\s*(.+?)\s*(==|!=|<|>|<=|>=)\s*(.+?)\s*$/);
    if (!match) throw new Error(`[NovaScript] Invalid condition syntax: ${condition}`);

    let leftOperand = match[1].trim();
    const operator = match[2];
    let rightOperand = match[3].trim();

    // Resolve operands from context first, then try to parse as literal
    const resolveOperand = (op) => {
        if (context[op] !== undefined) return context[op];
        try {
            return JSON.parse(op); // numbers, booleans, null, quoted strings
        } catch {
            return op.replace(/^['"]|['"]$/g, ''); // Unquoted strings become plain strings
        }
    };

    const left = resolveOperand(leftOperand);
    const right = resolveOperand(rightOperand);

    switch (operator) {
        case "==": return left == right;
        case "!=": return left != right;
        case "<":  return left < right;
        case ">":  return left > right;
        case "<=": return left <= right;
        case ">=": return left >= right;
        default: return false; // Should not happen due to regex
    }
}

// === NovaScript interpreter ===
export function runNovaScript(code, initialContext = {}) {
    const [meta, script] = parseNovaMData(code);
    if (meta) console.log("[NovaScript] App metadata:", meta);

    const lines = script.split("\n").map(l => l.trim()).filter(l => l);
    // Use a copy of initialContext to allow local variable assignment within scripts
    const context = { ...initialContext };
    // Store event handlers for potential future dispatching
    if (!context.eventHandlers) context.eventHandlers = {};

    let i = 0;
    while (i < lines.length) {
        let line = lines[i];

        if (line.startsWith("echo ")) {
            const msg = line.slice(5).trim().replace(/^"|"$/g,"");
            NovaModules.echo(msg);
        }
        else if (line.startsWith("require ")) {
            const mod = line.slice(8).trim().replace(/^"|"$/g,"");
            if (!(mod in NovaModules)) throw new Error(`[NovaScript] Module not found: ${mod}`);
            console.log(`[NovaScript] Module loaded: ${mod}`);
        }
        else if (line.includes("windowManager.createWindow")) {
            const objMatch = line.match(/\{(.+)\}/s);
            if (!objMatch) throw new Error("[NovaScript] Invalid window parameters");
            const params = parseComplexObject(objMatch[1]); // Use improved parser
            const win = WindowManager.createWindow(params);
            context["win"] = win; // Default window variable
        }
        else if (line.startsWith("shadingapi.applyGlass")) {
            const winVarMatch = line.match(/shadingapi.applyGlass (\w+)/);
            const win = winVarMatch ? context[winVarMatch[1]] : context["win"] || WindowManager.windows[0];
            NovaModules.shadingapi.applyGlass(win);
        }
        else if (line.startsWith("ui.createButton")) {
            const objMatch = line.match(/\{(.+)\}/s);
            if (!objMatch) throw new Error("[NovaScript] Invalid button parameters");
            const params = parseComplexObject(objMatch[1]); // Use improved parser
            const btn = NovaModules.ui.createButton(params);
            context[btn.id] = btn; // Store button reference by its ID
        }
        else if (line.startsWith("on ")) {
            const eventMatch = line.match(/^on "(\w+)\.(\w+)"\s*\{\s*$/);
            if (!eventMatch) throw new Error(`[NovaScript] Invalid 'on' syntax: ${line}`);

            const elementId = eventMatch[1];
            const eventType = eventMatch[2];
            const eventScriptLines = [];
            let j = i + 1;
            while (j < lines.length && !lines[j].trim().startsWith("}")) {
                eventScriptLines.push(lines[j]);
                j++;
            }
            if (j === lines.length) throw new Error(`[NovaScript] Unclosed 'on' block starting at line ${i+1}`);

            const handlerKey = `${elementId}.${eventType}`;
            context.eventHandlers[handlerKey] = eventScriptLines;
            console.log(`[NovaScript] Event handler registered for "${handlerKey}"`);

            i = j; // Skip past the entire block
        }
        else if (line.startsWith("if ")) {
            const conditionPart = line.slice(3).trim();
            const condition = conditionPart.replace(/\{$/, "").trim(); // Remove trailing '{' if present

            let conditionResult = false;
            try {
                conditionResult = evaluateCondition(condition, context);
            } catch (e) {
                console.error(`[NovaScript] Error evaluating condition "${condition}":`, e.message);
            }

            const ifBlockLines = [];
            let j = i + 1;
            while (j < lines.length && !lines[j].trim().startsWith("}") && !lines[j].trim().startsWith("else")) {
                ifBlockLines.push(lines[j]);
                j++;
            }
            // Check for unclosed block or else without if
            if (j === lines.length && !lines[j-1].trim().startsWith("}") && !lines[j-1].trim().startsWith("else")) {
                 throw new Error(`[NovaScript] Unclosed 'if' block starting at line ${i+1}`);
            }

            if (conditionResult) {
                console.log(`[NovaScript] Condition TRUE: "${condition}" - Executing IF block.`);
                runNovaScript(ifBlockLines.join("\n"), context); // Recursively run with current context
            } else {
                console.log(`[NovaScript] Condition FALSE: "${condition}" - Skipping IF block.`);
            }

            // Check for 'else' block
            if (lines[j] && lines[j].trim().startsWith("else")) {
                const elseBlockLines = [];
                let k = j + 1;
                while (k < lines.length && !lines[k].trim().startsWith("}")) {
                    elseBlockLines.push(lines[k]);
                    k++;
                }
                if (k === lines.length && !lines[k-1].trim().startsWith("}")) {
                    throw new Error(`[NovaScript] Unclosed 'else' block starting after line ${j+1}`);
                }

                if (!conditionResult) { // Only run else if original if was false
                    console.log(`[NovaScript] Condition FALSE: "${condition}" - Executing ELSE block.`);
                    runNovaScript(elseBlockLines.join("\n"), context); // Recursively run
                } else {
                    console.log(`[NovaScript] Condition TRUE: "${condition}" - Skipping ELSE block.`);
                }
                i = k; // Skip past else block
            } else {
                i = j; // Skip past if block
            }
        }
        else if (line.startsWith("//") || line === "") {
            // Ignore comments and empty lines
        }
        else {
            console.warn(`[NovaScript] Unknown command or syntax error: ${line}`);
        }
        i++; // Move to the next line
    }
    return context; // Return the modified context
}

// Example usage: (Assuming WindowManager is available in the environment)
// const script1 = `
// novaMData {
//   appName: "TestApp",
//   version: "1.0"
// }
// require "echo"
// require "ui"
//
// echo "Starting NovaScript..."
// windowManager.createWindow({title:"Main Window", width:600, height:400})
// ui.createButton({id: "myBtn", text: "Click Me!"})
//
// if myBtn == null {
//   echo "Button was not created properly."
// } else {
//   echo "Button 'myBtn' exists."
// }
//
// on "myBtn.click" {
//   echo "Button 'myBtn' was clicked!"
//   windowManager.createWindow({title:"Clicked!", width:200, height:150})
//   shadingapi.applyGlass win // Apply to the new window
// }
//
// echo "Script finished setup."
// `;
//
// runNovaScript(script1);

// To simulate an event after setup:
// // Assuming NovaModules.ui.elements.myBtn exists from the script run
// // In a real system, the browser would dispatch an event, and this handler
// // would be triggered. Here, we manually call runNovaScript with the stored block.
// const simulatedEventContext = { ...NovaModules.ui.elements.myBtn }; // Pass button as 'this' for the event
// // runNovaScript(globalContext.eventHandlers["myBtn.click"].join("\n"), simulatedEventContext);