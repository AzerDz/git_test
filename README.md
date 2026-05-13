# QuickTools - Your Daily Utility Hub

Dark-themed utility hub with glassmorphism design and smooth page transitions.

## Tech Stack
- **HTML**: Tailwind CSS via CDN + Custom inline CSS
- **CSS**: Hybrid approach (see below)
- **JS**: Vanilla JS, class-based architecture, localStorage

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

## Features
- **Home Page**: Utility hub with tool cards
- **Scientific Calculator**: sin, cos, tan, log, ln, √, ^, !, π, e, history
- **Smooth Animations**: Page transitions, hover effects, floating orbs
- **Keyboard support**: Full keyboard shortcuts for calculator
- **Responsive**: Works on all screen sizes

## Pages
- `index.html` - Home page (utility hub)
- `calculator.html` - Scientific calculator

## Run
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`