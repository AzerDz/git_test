# AI Agent Guidelines

## Quick Start

```bash
cd /path/to/project
python3 -m http.server 8000
# Open http://localhost:8000 in browser
```

## Project Structure

```
project/
├── index.html       # Home page - utility hub with tool cards
├── calculator.html  # Scientific calculator app
├── js/
│   └── script.js    # Calculator logic, history, keyboard support
├── README.md        # Project info
└── AGENTS.md        # This file
```

## CSS Architecture

**Tailwind CSS** (via CDN) handles: utilities (`flex`, `grid`, `text-white`, spacing, gradients, etc.)

**Custom CSS** (inline `<style>` tags) handles:
- `@keyframes` animations (`fadeInUp`, `floatOrb`, `shake`, `slideInPanel`, etc.)
- Complex selectors (`.history-item:nth-child()` with animation delays)
- Glassmorphism (`backdrop-filter: blur()`)
- Hover states with gradient overlays (`::before` pseudo-elements)
- Page transition classes (`.page-enter`, `.page-transition-out`)

This is intentional. Tailwind alone cannot do animations, keyframes, or complex pseudo-elements.

## Pages

### Home Page (index.html)
- Dark glassmorphism hub with floating orb animations
- Grid of tool cards with hover effects (scale, glow, translateY)
- Each tool links to its respective page
- Placeholder cards for "Coming soon" features
- Page transition animation on navigation

### Calculator Page (calculator.html)
- Full scientific calculator with history panel
- Back button with slide-in animation
- See Calculator Features below

## Design System

### Colors
| Element | Colors |
|---------|--------|
| **Background** | `#0a0a0f` |
| **Card Background** | `rgba(255, 255, 255, 0.05)` to `rgba(26, 26, 46, 1)` |
| **Border** | `rgba(255, 255, 255, 0.1)` |
| **Primary Gradient** | `#667eea` → `#764ba2` |
| **Cyan Accent** | `#4facfe` → `#00f2fe` |
| **Error/Clear** | `#f093fb` → `#f5576c` |

### Typography
- **Font:** Outfit (Google Fonts), weights 300-700
- **Headings:** 2-3rem, font-bold
- **Body:** 1rem, font-medium/normal

### Animations
| Name | Purpose | Duration |
|------|---------|----------|
| `floatOrb` | Background orb movement | 8-15s, infinite |
| `fadeInUp` | Elements appearing | 0.5s, forwards |
| `slideInFromLeft` | Back button slide | 0.4s, forwards |
| `shake` | Error feedback | 0.5s |
| `slideInPanel` | History panel slide | 0.3s |

## Calculator Features

### Basic Operations
- `+`, `-`, `×`, `÷`, `%`, `^`

### Scientific Functions
- `sin`, `cos`, `tan`, `log`, `ln`, `√`, `!`
- Constants: `π`, `e`
- `ANS` button - uses last answer from history

### History Panel
- Stores last 50 calculations in localStorage
- Click any item to reload it
- Delete individual items or clear all
- Slides in from right (350px width)

### Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `0-9` | Numbers |
| `+`, `-`, `*`, `/` | Operators |
| `Enter` | Calculate |
| `Escape` | Clear all |
| `Backspace` | Delete last char |
| `.` | Decimal |
| `(`, `)` | Parentheses |

## Common Issues

1. **Regex syntax error**: `/` inside regex must be escaped as `\/`
2. **Calculator not responding**: Hard refresh `Ctrl+Shift+R`
3. **Storage errors**: Check browser localStorage permissions

## Local Storage
- `calculatorHistory`: Array of `{expression, result, timestamp}`