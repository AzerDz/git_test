# AI Agent Guidelines

## Quick Start

```bash
cd /home/ouss/projects/repos/git_test
python3 -m http.server 8000
# Open http://localhost:8000 in browser
```

## Project Structure

```
git_test/
├── index.html      # Main HTML with Tailwind CDN
├── css/styles.css  # Custom styles (dark theme, glassmorphism, animations)
├── js/script.js    # Calculator logic, history, keyboard support
├── README.md       # Basic project info
└── AGENTS.md       # This file
```

## Tech Stack
- **HTML**: Tailwind CSS via CDN for rapid styling
- **CSS**: Custom animations, glassmorphism, dark theme, responsive breakpoints
- **JS**: Vanilla JS with class-based Calculator, localStorage for history

## Key Implementation Details

### Calculator Features
- Basic: `+`, `-`, `×`, `÷`, `%`
- Scientific: `sin`, `cos`, `tan`, `log`, `ln`, `√`, `^`, `!`, `π`, `e`
- `ANS` button - uses last answer from history

### History Panel
- Toggle with `h` key or button
- Stores last 50 calculations in localStorage
- Click any item to load it back into display

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `0-9` | Numbers |
| `+`, `-`, `*`, `/` | Operators |
| `Enter` | Calculate |
| `Escape` | Clear all |
| `Backspace` | Delete last char |
| `h` | Toggle history |
| `.` | Decimal |

### Animations
- Button hover/click effects
- Error shake animation on invalid input
- Result reveal animation on calculate
- Floating orbs background (CSS keyframes)
- Toast notification for copy action

### Copy Result
- Click copy icon or press `Ctrl+C` when result is focused
- Shows toast notification on success

## Common Issues Fixed

1. **Regex syntax error**: In percentage calculation, `/` inside regex must be escaped as `\/`
   ```js
   // Wrong: /\s*\/\s*/
   // Right: /\s*\\/\s*/
   ```

2. **Chrome DevTools warning**: Tailwind CDN warning is not an error - just a production guideline

3. **Calculator not responding**: Check browser cache - do hard refresh `Ctrl+Shift+R`

## Design Specs
- Dark theme with `#0f0f1a` background
- Glassmorphism panel with `backdrop-filter: blur(12px)`
- Primary accent: gradient `#667eea` → `#764ba2`
- Button grid: 5 columns, responsive

## Local Storage Keys
- `calc_history`: Array of calculation objects `{expression, result, timestamp}`
- `calc_ans`: Last calculation result (string)