/**
 * Calculator Application
 * Scientific calculator with history, localStorage persistence, and keyboard support
 */

class Calculator {
    //==========================================================================
    // CONSTANTS & CONFIG
    //==========================================================================
    static CONFIG = {
        MAX_HISTORY: 50,
        STORAGE_KEY: 'calculatorHistory'
    };

    static OPERATOR_MAP = {
        '*': '×',
        '/': '÷',
        '×': '*',
        '÷': '/'
    };

    static SUPPORTED_FUNCTIONS = ['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'abs', 'floor', 'ceil', 'round'];
    static VALID_OPERATORS = ['+', '-', '*', '/', '%', '^', '**'];

    //==========================================================================
    // CONSTRUCTOR
    //==========================================================================
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.lastResult = null;
        this.shouldResetDisplay = false;
        this.history = [];
        this.historyPanel = null;
        this.isHistoryOpen = false;

        this.initElements();
        this.createHistoryPanel();
        this.loadHistory();
        this.bindEvents();
    }

    //==========================================================================
    // INITIALIZATION
    //==========================================================================
    initElements() {
        this.previousDisplay = document.getElementById('previousCalculation');
        this.currentDisplay = document.getElementById('currentResult');
    }

    //==========================================================================
    // HISTORY PANEL
    //==========================================================================
    createHistoryPanel() {
        this.historyPanel = document.createElement('div');
        this.historyPanel.className = 'history-panel';
        this.historyPanel.innerHTML = `
            <h2 class="history-title">History</h2>
            <div class="history-list" id="historyList"></div>
            <button class="history-clear" id="historyClear">Clear All</button>
        `;
        document.body.appendChild(this.historyPanel);

        this.historyList = document.getElementById('historyList');
        this.historyClearBtn = document.getElementById('historyClear');

        this.historyClearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.clearHistory();
        });

        this.historyPanel.addEventListener('click', (e) => {
            if (e.target === this.historyPanel) {
                this.toggleHistory();
            }
        });
    }

    toggleHistory() {
        this.isHistoryOpen = !this.isHistoryOpen;
        if (this.isHistoryOpen) {
            this.historyPanel.classList.add('active');
            this.historyPanel.classList.remove('closing');
        } else {
            this.historyPanel.classList.add('closing');
            this.historyPanel.classList.remove('active');
        }
    }

    addToHistory(expression, result) {
        const historyItem = { expression, result, timestamp: Date.now() };
        this.history.unshift(historyItem);

        if (this.history.length > Calculator.CONFIG.MAX_HISTORY) {
            this.history.pop();
        }

        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p style="color: var(--text-secondary); text-align: center; padding: 20px;">No history yet</p>';
            return;
        }

        this.historyList.innerHTML = this.history.map((item, index) => `
            <div class="history-item" data-index="${index}">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
                <button class="history-delete" data-index="${index}" style="position: absolute; top: 8px; right: 8px; background: transparent; border: none; color: var(--text-secondary); cursor: pointer; padding: 4px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        this.historyList.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (e.target.closest('.history-delete')) {
                    e.stopPropagation();
                    const index = parseInt(e.target.closest('.history-delete').dataset.index);
                    this.deleteHistoryItem(index);
                } else {
                    const index = parseInt(item.dataset.index);
                    this.useHistoryItem(index);
                }
            });
        });
    }

    useHistoryItem(index) {
        const item = this.history[index];
        if (item) {
            const resultNum = parseFloat(item.result.replace(/,/g, ''));
            this.lastResult = resultNum;
            this.currentInput = item.result;
            this.shouldResetDisplay = false;
            this.previousInput = item.expression + ' =';
            this.toggleHistory();
            this.updateDisplay();
        }
    }

    deleteHistoryItem(index) {
        this.history.splice(index, 1);
        this.saveHistory();
        this.renderHistory();
    }

    clearHistory() {
        this.history = [];
        this.saveHistory();
        this.renderHistory();
    }

    //==========================================================================
    // LOCAL STORAGE
    //==========================================================================
    saveHistory() {
        try {
            localStorage.setItem(Calculator.CONFIG.STORAGE_KEY, JSON.stringify(this.history));
        } catch (e) {
            console.error('Failed to save history:', e);
        }
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem(Calculator.CONFIG.STORAGE_KEY);
            this.history = saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('Failed to load history:', e);
            this.history = [];
        }
        this.renderHistory();
    }

    //==========================================================================
    // EVENT BINDING
    //==========================================================================
    bindEvents() {
        const grid = document.querySelector('.button-grid');
        grid.addEventListener('click', (e) => {
            const btn = e.target.closest('.calc-btn');
            if (!btn) return;
            this.handleButtonClick(btn.dataset.value);
        });

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        const keyMap = {
            '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
            '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
            '.': '.', '+': '+', '-': '-', '*': '*', '/': '/',
            '^': '^', '%': '%', '(': '(', ')': ')'
        };

        if (keyMap[e.key]) {
            if (e.key === '/') {
                e.preventDefault();
            }
            this.handleButtonClick(keyMap[e.key]);
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.handleButtonClick('=');
        } else if (e.key === 'Escape') {
            this.handleButtonClick('ac');
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            this.handleButtonClick('backspace');
        }
    }

    //==========================================================================
    // BUTTON HANDLERS
    //==========================================================================
    handleButtonClick(value) {
        const handlers = {
            'clear': () => this.clear(),
            'ac': () => this.clear(),
            'backspace': () => this.backspace(),
            '=': () => this.calculate(),
            'history': () => this.toggleHistory(),
            'negate': () => this.negate(),
            'sqrt': () => this.handleFunction('sqrt'),
            'sin': () => this.handleScientific('sin'),
            'cos': () => this.handleScientific('cos'),
            'tan': () => this.handleScientific('tan'),
            'log': () => this.handleScientific('log'),
            'ln': () => this.handleScientific('ln'),
            'pi': () => this.insertConstant(Math.PI),
            'e': () => this.insertConstant(Math.E),
            'ans': () => this.insertAns(),
            '!': () => this.handleFactorial()
        };

        if (handlers[value]) {
            handlers[value]();
        } else if (Calculator.VALID_OPERATORS.includes(value)) {
            this.handleOperator(value);
        } else if (value === '(' || value === ')') {
            this.handleParentheses(value);
        } else {
            this.handleNumber(value);
        }

        this.updateDisplay();
    }

    //==========================================================================
    // INPUT HANDLERS
    //==========================================================================
    handleNumber(value) {
        if (this.shouldResetDisplay) {
            this.currentInput = value;
            this.shouldResetDisplay = false;
        } else {
            if (this.currentInput === '0' && value !== '.') {
                this.currentInput = value;
            } else if (value === '.' && this.currentInput.includes('.')) {
                return;
            } else if (this.previousInput && this.currentInput === '0') {
                this.currentInput = value;
            } else {
                this.currentInput += value;
            }
        }
    }

    handleOperator(operator) {
        const opSymbol = Calculator.OPERATOR_MAP[operator] || operator;

        if (this.shouldResetDisplay) {
            const currentNum = this.currentInput.replace(/,/g, '');
            this.previousInput = `${currentNum} ${opSymbol} `;
            this.currentInput = '';
            this.shouldResetDisplay = true;
            return;
        }

        const currentNum = this.currentInput.replace(/,/g, '');

        if (!currentNum || this.currentInput === '') {
            this.previousInput += `${opSymbol} `;
            this.currentInput = '';
            this.shouldResetDisplay = true;
            return;
        }

        const lastChar = this.currentInput.slice(-1);

        if (Calculator.VALID_OPERATORS.includes(lastChar)) {
            this.previousInput = `${this.currentInput.slice(0, -1).replace(/,/g, '')} ${opSymbol} `;
            this.currentInput = '';
        } else {
            this.previousInput += `${currentNum} ${opSymbol} `;
            this.currentInput = '';
        }

        this.shouldResetDisplay = true;
    }

    handleParentheses(value) {
        if (this.shouldResetDisplay && value === '(') {
            this.currentInput = value;
            this.previousInput = '';
            this.shouldResetDisplay = false;
        } else {
            if (this.previousInput && !this.currentInput) {
                this.currentInput += value;
            } else if (this.currentInput === '0' || this.currentInput === '') {
                this.currentInput = this.previousInput + value;
                this.previousInput = '';
            } else {
                this.currentInput += value;
            }
        }
    }

    //==========================================================================
    // SCIENTIFIC FUNCTIONS
    //==========================================================================
    handleFunction(func) {
        const num = parseFloat(this.currentInput);
        if (isNaN(num)) {
            this.showError('Invalid input');
            return;
        }

        let result;
        switch (func) {
            case 'sqrt': result = Math.sqrt(num); break;
        }

        this.previousInput = `√(${this.currentInput})`;
        this.currentInput = this.formatResult(result);
        this.lastResult = result;
        this.shouldResetDisplay = true;
    }

    handleScientific(func) {
        let num = parseFloat(this.currentInput);

        switch (func) {
            case 'sin': num = Math.sin(num * Math.PI / 180); break;
            case 'cos': num = Math.cos(num * Math.PI / 180); break;
            case 'tan': num = Math.tan(num * Math.PI / 180); break;
            case 'log': num = Math.log10(num); break;
            case 'ln': num = Math.log(num); break;
        }

        if (isNaN(num) || !isFinite(num)) {
            this.showError('Math error');
            return;
        }

        this.previousInput = `${func}(${this.currentInput})`;
        this.currentInput = this.formatResult(num);
        this.lastResult = num;
        this.shouldResetDisplay = true;
    }

    insertConstant(value) {
        if (this.shouldResetDisplay) {
            this.currentInput = this.formatResult(value);
            this.shouldResetDisplay = false;
        } else {
            this.currentInput = this.currentInput === '0'
                ? this.formatResult(value)
                : this.currentInput + this.formatResult(value);
        }
    }

    insertAns() {
        if (this.lastResult === null) return;

        if (this.shouldResetDisplay) {
            this.currentInput = this.formatResult(this.lastResult);
            this.shouldResetDisplay = false;
        } else {
            this.currentInput = this.currentInput === '0'
                ? this.formatResult(this.lastResult)
                : this.currentInput + this.formatResult(this.lastResult);
        }
    }

    negate() {
        const num = parseFloat(this.currentInput);
        if (!isNaN(num) && num !== 0) {
            this.currentInput = this.formatResult(-num);
        }
    }

    handleFactorial() {
        const num = parseFloat(this.currentInput);
        if (!Number.isInteger(num) || num < 0) {
            this.showError('Invalid factorial');
            return;
        }

        let result = 1;
        for (let i = 2; i <= num; i++) {
            result *= i;
        }

        this.previousInput = `${this.currentInput}!`;
        this.currentInput = this.formatResult(result);
        this.lastResult = result;
        this.shouldResetDisplay = true;
    }

    //==========================================================================
    // CALCULATION
    //==========================================================================
    calculate() {
        const expression = (this.previousInput + this.currentInput).trim();

        if (!expression || expression === '=') return;

        try {
            const result = this.safeEvaluate(expression);

            if (!isFinite(result)) {
                this.showError(result === Infinity ? 'Infinity' : 'Undefined');
                return;
            }

            const formattedResult = this.formatResult(result);
            const cleanExpression = expression.replace(/\s+/g, ' ');

            this.addToHistory(cleanExpression, formattedResult);

            this.previousInput = `${cleanExpression} =`;
            this.currentInput = formattedResult;
            this.lastResult = result;
            this.shouldResetDisplay = true;
        } catch (e) {
            console.error('Calculation error:', e);
            this.showError('Error');
        }
    }

    //==========================================================================
    // EXPRESSION PARSER
    //==========================================================================
    safeEvaluate(expression) {
        let expr = expression.replace(/\s+/g, ' ').trim();

        expr = expr
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/π/g, String(Math.PI))
            .replace(/\^/g, '**')
            .replace(/(\d+)!/g, (_, num) => {
                let fact = 1;
                for (let i = 2; i <= parseInt(num); i++) fact *= i;
                return String(fact);
            });

        for (const func of Calculator.SUPPORTED_FUNCTIONS) {
            const regex = new RegExp(`${func}\\(([^)]+)\\)`, 'g');
            let prev;
            do {
                prev = expr;
                expr = expr.replace(regex, (_, arg) => `__FUNC_${func}__(${arg})`);
            } while (prev !== expr);
        }

        expr = expr.replace(/\be\b(?![a-zA-Z])/g, String(Math.E));

        const tokens = this.tokenize(expr);
        if (tokens.length === 0) {
            throw new Error('Invalid expression');
        }

        return this.parseTokens(tokens);
    }

    tokenize(expr) {
        const tokenRegex = /(\d+\.?\d*)|(\()|(\))|(\*\*)|([+\-*/%])|(__FUNC_(?:sin|cos|tan|log|ln|sqrt|abs|floor|ceil|round)__)/g;
        const tokens = [];
        let match;

        while ((match = tokenRegex.exec(expr)) !== null) {
            if (match[1]) tokens.push({ type: 'number', value: parseFloat(match[1]) });
            else if (match[2]) tokens.push({ type: 'lparen', value: '(' });
            else if (match[3]) tokens.push({ type: 'rparen', value: ')' });
            else if (match[4]) tokens.push({ type: 'operator', value: '**' });
            else if (match[5]) tokens.push({ type: 'operator', value: match[5] });
            else if (match[6]) {
                const funcName = match[6].replace('__FUNC_', '').replace('__', '');
                tokens.push({ type: 'function', value: funcName });
            }
        }

        return tokens;
    }

    parseTokens(tokens) {
        let pos = 0;

        const peek = () => tokens[pos];
        const consume = () => tokens[pos++];

        const parseExpression = () => parseAddSub();

        const parseAddSub = () => {
            let left = parseMulDiv();
            while (peek() && (peek().value === '+' || peek().value === '-')) {
                const op = consume().value;
                const right = parseMulDiv();
                left = op === '+' ? left + right : left - right;
            }
            return left;
        };

        const parseMulDiv = () => {
            let left = parsePower();
            while (peek() && (peek().value === '*' || peek().value === '/')) {
                const op = consume().value;
                const right = parsePower();
                if (op === '*') {
                    left = (peek() && peek().value === '%')
                        ? (consume(), left * right / 100)
                        : left * right;
                } else {
                    if (right === 0) throw new Error('Division by zero');
                    left = left / right;
                }
            }
            return left;
        };

        const parsePower = () => {
            let left = parseUnary();
            if (peek() && peek().value === '**') {
                consume();
                left = Math.pow(left, parsePower());
            }
            return left;
        };

        const parseUnary = () => {
            if (peek() && peek().value === '-') {
                consume();
                return -parseUnary();
            }
            return parsePrimary();
        };

        const parsePrimary = () => {
            const token = peek();
            if (!token) throw new Error('Unexpected end of expression');

            if (token.type === 'number') {
                consume();
                if (peek() && peek().value === '%') {
                    consume();
                    return token.value / 100;
                }
                return token.value;
            }

            if (token.type === 'function') {
                const func = consume().value;
                if (!peek() || peek().type !== 'lparen') throw new Error('Expected ( after function');
                consume();
                const arg = parseExpression();
                if (!peek() || peek().type !== 'rparen') throw new Error('Expected )');
                consume();
                return this.evaluateFunction(func, arg);
            }

            if (token.type === 'lparen') {
                consume();
                const result = parseExpression();
                if (!peek() || peek().type !== 'rparen') throw new Error('Missing closing parenthesis');
                consume();
                return result;
            }

            throw new Error('Invalid token');
        };

        const result = parseExpression();

        if (pos < tokens.length) {
            throw new Error('Unexpected tokens at end');
        }

        return result;
    }

    evaluateFunction(func, arg) {
        const funcMap = {
            sin: (a) => Math.sin(a * Math.PI / 180),
            cos: (a) => Math.cos(a * Math.PI / 180),
            tan: (a) => Math.tan(a * Math.PI / 180),
            log: Math.log10,
            ln: Math.log,
            sqrt: Math.sqrt,
            abs: Math.abs,
            floor: Math.floor,
            ceil: Math.ceil,
            round: Math.round
        };

        if (funcMap[func]) {
            return funcMap[func](arg);
        }
        throw new Error(`Unknown function: ${func}`);
    }

    //==========================================================================
    // DISPLAY & ERROR HANDLING
    //==========================================================================
    formatResult(num) {
        if (num === null || num === undefined) return '0';
        if (typeof num !== 'number') return String(num);

        if (!Number.isFinite(num)) {
            return num > 0 ? 'Infinity' : '-Infinity';
        }

        if (Number.isInteger(num)) {
            return num.toLocaleString('en-US');
        }

        const rounded = parseFloat(num.toPrecision(12));
        return rounded.toLocaleString('en-US', { maximumFractionDigits: 10 });
    }

    showError(message) {
        this.previousInput = '';
        this.currentInput = message;
        this.shouldResetDisplay = true;

        this.currentDisplay.classList.add('error-shake');
        this.currentDisplay.parentElement.classList.add('error');
        setTimeout(() => {
            this.currentDisplay.classList.remove('error-shake');
            this.currentDisplay.parentElement.classList.remove('error');
        }, 500);
    }

    updateDisplay() {
        this.previousDisplay.textContent = this.previousInput;
        this.currentDisplay.textContent = this.currentInput;
    }

    //==========================================================================
    // CLEAR & BACKSPACE
    //==========================================================================
    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.shouldResetDisplay = false;
    }

    backspace() {
        if (this.currentInput.length === 1 || this.currentInput === 'Error') {
            this.currentInput = '0';
        } else {
            this.currentInput = this.currentInput.slice(0, -1);
        }
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
});