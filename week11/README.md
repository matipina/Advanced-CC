# Week 11: Beyond p5.js — DOM & Browser APIs

This week marks the transition from p5.js canvas-based creative coding to traditional JavaScript development with direct DOM manipulation and browser APIs.

## 🎯 Learning Objectives

By the end of this week, you will be able to:

- Manipulate DOM elements programmatically using vanilla JavaScript
- Create and handle various HTML form inputs and controls
- Implement event-driven interactions with addEventListener()
- Use localStorage for client-side data persistence

## 📚 Topics Covered

### 1. DOM Manipulation Basics

- `document.getElementById()`, `document.querySelector()`
- Modifying content with `innerHTML` and `textContent`
- Changing styles programmatically
- Event listeners with `addEventListener()`

### 2. Forms & User Input

- Input types: text, number, email, textarea, select
- Form submission with `addEventListener('submit')`
- Accessing input values with `.value`
- Preventing default form behavior with `event.preventDefault()`

### 3. Event Handlers

- Modern: `element.addEventListener('eventType', handler)`
- Event object properties: `event.target`, `event.target.value`, `event.type`
- Common events: `'click'`, `'submit'`, `'input'`, `'change'`
- Real-time feedback vs. final validation

### 4. localStorage API

- Storing and retrieving data: `setItem()`, `getItem()`
- JSON serialization: `JSON.stringify()` and `JSON.parse()`
- Cross-session persistence

## 🚀 Getting Started

1. Open `index.html` in your web browser to explore the examples
2. Check out `palindrome-demo/` for a complete, production-ready example combining forms, DOM manipulation, and localStorage
3. Each section demonstrates different concepts — try modifying the code to experiment

## 📁 File Structure

```
week11/
├── index.html              # Main overview page with Sketch 1
├── style.css               # Shared styles
├── jsconfig.json           # JavaScript configuration
├── LESSON_PLAN.md          # Internal teaching guide
├── sketch1.js              # DOM manipulation example
└── palindrome-demo/        # Complete interactive example
    ├── index.html          # Palindrome checker interface
    ├── script.js           # Forms, events, localStorage
    ├── style.css           # Modern styling with Quicksand font
    └── README.md           # Detailed code documentation
```

## 💡 Key Concepts & Code Patterns

### Form Submission with Event Listeners

```javascript
// Listen for form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();  // Stop page reload
    const userInput = input.value;  // Get the input value
    // Process the data here
});
```

### Real-time Input Feedback

```javascript
// Listen while user is typing
input.addEventListener('input', function(event) {
    const currentText = event.target.value;
    console.log('User typed:', currentText);
});
```

### localStorage with JSON

```javascript
// Save an object
const data = { name: 'Alice', score: 95 };
localStorage.setItem('user', JSON.stringify(data));

// Retrieve and parse
const retrieved = JSON.parse(localStorage.getItem('user'));
console.log(retrieved.name);  // 'Alice'
```

## 🎓 Connection to Project 4

This week's concepts directly support the Interactive Web Tool project:

- DOM manipulation for dynamic UI creation
- Forms for user configuration and input
- localStorage for saving user preferences and state
- Event handlers for interactive features

## 📖 Additional Resources

- [MDN Web Docs: DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)
- [MDN Web Docs: Events](https://developer.mozilla.org/en-US/docs/Web/Events)
- [MDN Web Docs: localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [MDN Web Docs: JSON](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON)

## 🎯 Practice Exercises

1. **DOM Builder**: Create a tool that generates HTML elements based on user selections
2. **Persistent Todo List**: Build a todo app that saves items to localStorage
3. **Form Validator**: Create a registration form with comprehensive validation
4. **Page Modifier Extension**: Build an extension that customizes web pages

Experiment with the examples, modify the code, and build your own interactive tools!</content>
<parameter name="filePath">/Users/matipina/Documents/Parsons/Teaching/Advanced-CC/week11/README.md
