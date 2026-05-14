# QuickTools - Your Daily Utility Hub

Dark-themed utility hub with glassmorphism design and smooth page transitions.

## Tech Stack
- **HTML**: Tailwind CSS via CDN + Custom inline CSS
- **JS**: Vanilla JS, class-based architecture, localStorage
- **Icons**: Font Awesome 6.4.0
- **Fonts**: Outfit (Google Fonts)

## CSS Architecture

### Why Both Tailwind AND Custom CSS?

Tailwind handles: utilities (`flex`, `grid`, `text-white`, spacing, etc.)

Custom CSS (inline `<style>`) handles:
- `@keyframes` animations (fadeInUp, floatOrb, shake, etc.)
- Complex selectors (`.history-item:nth-child()`)
- Glassmorphism (`backdrop-filter: blur()`)
- Hover states with gradients (`::before` pseudo-elements)
- Page transition animations

This is intentional - Tailwind alone cannot do animations, keyframes, or complex pseudo-elements.

## Project Structure

```
project/
├── index.html       # Home page - utility hub with tool cards
├── calculator.html  # Scientific calculator app
├── js/
│   └── script.js    # Calculator logic, history, keyboard support
├── README.md        # Project info
└── AGENTS.md        # AI Agent Guidelines
```

## Features

### Home Page (index.html)
- Dark glassmorphism hub with floating orb animations
- Grid of tool cards with hover effects (scale, glow, translateY)
- Each tool links to its respective page
- Page transition animation on navigation

### Calculator Page (calculator.html)
- **Basic Operations**: `+`, `-`, `×`, `÷`, `%`, `^`
- **Scientific Functions**: sin, cos, tan, log, ln, √, !
- **Constants**: π, e
- **ANS Button**: Uses last answer from history
- **History Panel**: Stores last 50 calculations in localStorage
- **Keyboard Shortcuts**: Full support (Enter, Escape, Backspace, etc.)
- **Smooth Animations**: Page transitions, hover effects

### Design System
- **Background**: #0a0a0f
- **Primary Gradient**: #667eea → #764ba2
- **Cyan Accent**: #4facfe → #00f2fe
- **Typography**: Outfit (300-700 weights)

## Run

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`