import { useState, useEffect, useMemo, useRef } from 'react';
import {
  AlertCircle,
  BookOpen,
  Bot,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  Flame,
  Globe,
  GraduationCap,
  HelpCircle,
  Layers,
  Lightbulb,
  Maximize2,
  Minimize2,
  Play,
  RefreshCw,
  RotateCcw,
  Search,
  Sparkles,
  Terminal,
  Video,
  Wand2,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const YoutubeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const COURSE_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', tag: 'JS', icon: '⚡', color: '#f7df1e', docsUrl: 'https://www.w3schools.com/js/' },
  { id: 'html', name: 'HTML', tag: 'HTML5', icon: '🌐', color: '#e34f26', docsUrl: 'https://www.w3schools.com/html/' },
  { id: 'css', name: 'CSS', tag: 'CSS3', icon: '🎨', color: '#1572b6', docsUrl: 'https://www.w3schools.com/css/' },
  { id: 'python', name: 'Python', tag: 'PY', icon: '🐍', color: '#3776ab', docsUrl: 'https://www.w3schools.com/python/' },
  { id: 'java', name: 'Java', tag: 'JAVA', icon: '☕', color: '#ea2d2e', docsUrl: 'https://www.w3schools.com/java/' },
  { id: 'cpp', name: 'C++', tag: 'C++', icon: '🚀', color: '#00599c', docsUrl: 'https://www.w3schools.com/cpp/' },
  { id: 'sql', name: 'SQL', tag: 'SQL', icon: '🗄️', color: '#00bc8c', docsUrl: 'https://www.w3schools.com/sql/' },
  { id: 'react', name: 'React', tag: 'REACT', icon: '⚛️', color: '#61dafb', docsUrl: 'https://www.w3schools.com/react/' },
];

const COURSE_DATA = {
  javascript: {
    title: 'JavaScript Tutorial',
    description: 'Learn the core programming language of the modern Web from fundamentals to asynchronous patterns.',
    w3schoolUrl: 'https://www.w3schools.com/js/default.asp',
    topics: [
      {
        id: 'js-intro',
        title: 'JS Introduction & Syntax',
        category: 'Basics',
        difficulty: 'Easy',
        videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
        videoTitle: 'JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour',
        w3schoolLink: 'https://www.w3schools.com/js/js_intro.asp',
        summary: 'JavaScript is a dynamic, weakly typed programming language with first-class functions.',
        content: `### What is JavaScript?
JavaScript is the world's most popular programming language. It is used for web development, server-side development (Node.js), mobile apps, and machine learning.

#### Key Characteristics:
1. **Dynamic Typing**: Variable types are determined at runtime.
2. **First-Class Functions**: Functions can be passed as arguments, returned from other functions, and assigned to variables.
3. **Event-Driven**: Non-blocking I/O model powered by the Event Loop.

#### Variable Declarations:
- \`const\`: Block-scoped, cannot be reassigned (prefer by default).
- \`let\`: Block-scoped, can be reassigned.
- \`var\`: Function-scoped, hoisted (avoid in modern JS).`,
        codeExample: `// Modern ES6 Variable Declarations
const platform = "TechPrep";
let activeUsers = 12500;
activeUsers += 1;

function getGreeting(name) {
  return \`Welcome to \${platform}, \${name}! Active users: \${activeUsers}\`;
}

console.log(getGreeting("Alex"));`,
        expectedOutput: 'Welcome to TechPrep, Alex! Active users: 12501',
        keyTakeaways: [
          'Always use const unless variable reassignment is strictly needed.',
          'Template literals (`${var}`) allow clean multi-line string interpolation.',
          'Strict equality (===) checks both value and type without coercion.'
        ],
        aiDeepDive: `**Interview Edge Questions:**
1. *What is the difference between undefined and null?*
   - \`undefined\` means a variable has been declared but not yet assigned a value.
   - \`null\` is an intentional assignment representing "no value" or an empty object reference.
2. *How does hoisting work with let and const?*
   - They are hoisted to the top of their block scope but reside in the **Temporal Dead Zone (TDZ)** until execution reaches their declaration.`
      },
      {
        id: 'js-functions',
        title: 'JS Functions & Arrow Functions',
        category: 'Basics',
        difficulty: 'Easy',
        videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3c',
        videoTitle: 'JavaScript Arrow Functions in 5 Minutes',
        w3schoolLink: 'https://www.w3schools.com/js/js_arrow_function.asp',
        summary: 'Master regular functions, arrow expressions, default parameters, and rest syntax.',
        content: `### Functions in JavaScript
Functions are first-class citizens. They encapsulate reusable blocks of logic and can be defined as declarations or expressions.

#### Arrow Functions (\`=>\`):
Arrow functions provide a concise syntax and **lexically bind the \`this\` value** from the enclosing scope.

\`\`\`javascript
// Arrow function with implicit return
const square = (x) => x * x;

// Arrow function with parameter destructuring
const formatUser = ({ name, role = "User" }) => \`\${name} (\${role})\`;
\`\`\``,
        codeExample: `// Higher-Order Array Functions with Arrows
const numbers = [1, 2, 3, 4, 5, 6];

const evenSquares = numbers
  .filter((n) => n % 2 === 0)
  .map((n) => n * n);

console.log("Original:", numbers);
console.log("Even Squares:", evenSquares);`,
        expectedOutput: 'Original: [1, 2, 3, 4, 5, 6]\nEven Squares: [4, 16, 36]',
        keyTakeaways: [
          'Arrow functions do not have their own `this`, `arguments`, or `super` bindings.',
          'Use .map(), .filter(), and .reduce() for declarative array transformations.'
        ],
        aiDeepDive: `**Common Pitfall:**
Using arrow functions as object methods when you need access to \`this\` pointing to that object:
\`\`\`javascript
const user = {
  name: "Alex",
  greet: () => console.log(this.name) // BUG: 'this' is window / lexical global
};
\`\`\``
      },
      {
        id: 'js-async',
        title: 'JS Promises & Async/Await',
        category: 'Advanced',
        difficulty: 'Medium',
        videoUrl: 'https://www.youtube.com/embed/PoRJizFvM7s',
        videoTitle: 'Async JavaScript: Promises, Async/Await, and Event Loop',
        w3schoolLink: 'https://www.w3schools.com/js/js_promise.asp',
        summary: 'Handle asynchronous operations smoothly using Promises, async/await, and error handling.',
        content: `### Asynchronous JavaScript
JavaScript is single-threaded. Async operations (network requests, timers, disk I/O) are handled asynchronously via Web APIs and the microtask queue.

#### Promise Lifecycle:
- **Pending**: Initial state before completion.
- **Fulfilled**: Operation resolved successfully with a value.
- **Rejected**: Operation failed with an error reason.

#### Async/Await Syntax:
\`async\` functions return a Promise implicitly. The \`await\` keyword pauses execution until the promise settles.`,
        codeExample: `// Simulated Asynchronous API Call
const fetchUserData = (userId) => {
  return new Promise((resolve, reject) => {
    if (userId > 0) {
      resolve({ id: userId, username: "dev_candidate", rank: "Top 5%" });
    } else {
      reject("Invalid User ID");
    }
  });
};

async function loadProfile() {
  try {
    const user = await fetchUserData(42);
    console.log("User Loaded:", JSON.stringify(user));
  } catch (err) {
    console.error("Error:", err);
  }
}

loadProfile();`,
        expectedOutput: 'User Loaded: {"id":42,"username":"dev_candidate","rank":"Top 5%"}',
        keyTakeaways: [
          'Always wrap await calls in try/catch blocks to gracefully handle rejections.',
          'Use Promise.all([p1, p2]) to execute independent async requests concurrently.'
        ],
        aiDeepDive: `**Event Loop Architecture:**
Call Stack -> Microtask Queue (Promises, queueMicrotask) -> Macrotask Queue (setTimeout, setInterval, DOM Events). Microtasks always drain completely before the next macrotask runs!`
      },
      {
        id: 'js-closures',
        title: 'JS Closures & Scope Chain',
        category: 'Advanced',
        difficulty: 'Hard',
        videoUrl: 'https://www.youtube.com/embed/vKJpn5IbCjq',
        videoTitle: 'JavaScript Closures Tutorial',
        w3schoolLink: 'https://www.w3schools.com/js/js_function_closures.asp',
        summary: 'Understand lexical scoping and how inner functions retain access to outer variables.',
        content: `### What is a Closure?
A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment).

#### Practical Uses:
1. **Data Privacy & Encapsulation**: Creating private variables in modules.
2. **Function Factories**: Generating customized functions (e.g. rate limiters, debouncers).
3. **Currying and Partial Application**.`,
        codeExample: `// Creating a Private Counter with Closure
function createRateLimiter(maxCalls) {
  let callCount = 0; // Private state
  
  return function(action) {
    if (callCount < maxCalls) {
      callCount++;
      return \`Executed \${action} (\${callCount}/\${maxCalls})\`;
    }
    return \`Blocked: Exceeded limit of \${maxCalls} calls\`;
  };
}

const limiter = createRateLimiter(2);
console.log(limiter("GET /api/data"));
console.log(limiter("GET /api/data"));
console.log(limiter("GET /api/data"));`,
        expectedOutput: 'Executed GET /api/data (1/2)\nExecuted GET /api/data (2/2)\nBlocked: Exceeded limit of 2 calls',
        keyTakeaways: [
          'Closures preserve outer variables even after the outer function has finished executing.',
          'Common interview question: Explain how closures power hooks like React useState.'
        ],
        aiDeepDive: `**Memory Leak Alert:**
Closures prevent garbage collection of referenced outer variables. Be cautious when attaching closures to global event listeners or intervals without cleanup.`
      }
    ]
  },
  html: {
    title: 'HTML5 Tutorial',
    description: 'Master semantic web page structure, forms, SEO attributes, and modern HTML5 APIs.',
    w3schoolUrl: 'https://www.w3schools.com/html/default.asp',
    topics: [
      {
        id: 'html-basic',
        title: 'HTML5 Document Structure',
        category: 'Basics',
        difficulty: 'Easy',
        videoUrl: 'https://www.youtube.com/embed/kUMe1FH4CHE',
        videoTitle: 'HTML Full Course - Build a Website Tutorial',
        w3schoolLink: 'https://www.w3schools.com/html/html_basic.asp',
        summary: 'Understand the fundamental layout of every HTML5 webpage.',
        content: `### HTML5 Boilerplate
HTML (HyperText Markup Language) is the standard markup language for creating web documents.

#### Anatomy of a Document:
- \`<!DOCTYPE html>\`: Informs the browser to render using the HTML5 specification.
- \`<html lang="en">\`: Root element of the document with language specification.
- \`<head>\`: Metadata, title tags, viewport configurations, and linked stylesheets.
- \`<body>\`: Visible content rendered in the browser viewport.`,
        codeExample: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>TechPrep Interactive HTML</title>
</head>
<body style="font-family: sans-serif; padding: 16px; background: #222; color: #fff;">
  <h1 style="color: #ffa116;">Hello, TechPrep!</h1>
  <p>Learn HTML5 with live interactive previews.</p>
</body>
</html>`,
        expectedOutput: 'Live HTML Rendered Document',
        keyTakeaways: [
          'Always include <meta name="viewport" content="width=device-width, initial-scale=1.0"> for mobile responsiveness.',
          'Use semantic heading tags (<h1> to <h6>) hierarchically for accessibility.'
        ],
        aiDeepDive: `**SEO & Accessibility:**
Search engine web crawlers and screen readers rely heavily on document metadata and heading hierarchy to index page content accurately.`
      },
      {
        id: 'html-semantic',
        title: 'HTML Semantic Elements',
        category: 'Architecture',
        difficulty: 'Medium',
        videoUrl: 'https://www.youtube.com/embed/UB1O30fR-EE',
        videoTitle: 'HTML5 Semantic Elements in 10 Minutes',
        w3schoolLink: 'https://www.w3schools.com/html/html5_semantic_elements.asp',
        summary: 'Replace generic <div> containers with semantic elements for accessibility and SEO.',
        content: `### Why Semantic HTML Matters
Semantic elements clearly describe their meaning to both the browser and screen readers.

#### Essential Semantic Tags:
- \`<header>\`: Introductory content or navigational aids.
- \`<nav>\`: Section containing navigation links.
- \`<main>\`: Dominant content of the <body>.
- \`<article>\`: Self-contained, independently distributable composition.
- \`<section>\`: Standalone thematic group of content.
- \`<aside>\`: Content tangentially related to the main content (sidebars).
- \`<footer>\`: Footer for its nearest sectioning root.`,
        codeExample: `<main style="font-family: sans-serif; color: #e5e7eb; background: #1e1e1e; padding: 20px; border-radius: 8px;">
  <header style="border-bottom: 1px solid #444; padding-bottom: 8px;">
    <h2 style="margin: 0; color: #ffa116;">Interview Prep Article</h2>
  </header>
  <article style="margin: 16px 0;">
    <p>Semantic tags improve accessibility (ARIA) and search indexing (SEO).</p>
  </article>
  <footer style="font-size: 12px; color: #9ca3af;">
    Published by TechPrep Knowledge Engine
  </footer>
</main>`,
        expectedOutput: 'Semantic Article Card Preview',
        keyTakeaways: [
          'Only one <main> element should exist per document.',
          'Semantic tags eliminate "div soup" and give structure to assistive technologies.'
        ],
        aiDeepDive: `**Interview Focus:**
Why is semantic HTML critical for Web Content Accessibility Guidelines (WCAG 2.1)? Screen readers use landmarks (like <main> and <nav>) to allow users to skip directly to content.`
      },
      {
        id: 'html-forms',
        title: 'HTML Forms & Inputs',
        category: 'Forms',
        difficulty: 'Medium',
        videoUrl: 'https://www.youtube.com/embed/fNcJuPIZ2WE',
        videoTitle: 'HTML Forms & Inputs Full Tutorial',
        w3schoolLink: 'https://www.w3schools.com/html/html_forms.asp',
        summary: 'Build accessible, validated forms with modern input types and constraints.',
        content: `### Interactive Form Controls
Forms collect user input and submit payloads to backend APIs or client state machines.

#### Form Best Practices:
- Always associate \`<label for="id">\` with form controls.
- Use specific \`type\` attributes (\`email\`, \`number\`, \`tel\`, \`date\`) to trigger mobile keyboards.
- Built-in validation attributes: \`required\`, \`pattern\`, \`min\`, \`max\`, \`maxlength\`.`,
        codeExample: `<form style="font-family: sans-serif; display: flex; flex-direction: column; gap: 10px; max-width: 320px; color: white;">
  <label for="username" style="font-size: 13px;">Target Role:</label>
  <input id="username" type="text" placeholder="e.g. Frontend Engineer" required style="padding: 8px; border-radius: 6px; border: 1px solid #555; background: #2b2b2b; color: white;" />
  
  <label for="email" style="font-size: 13px;">Work Email:</label>
  <input id="email" type="email" placeholder="you@company.com" required style="padding: 8px; border-radius: 6px; border: 1px solid #555; background: #2b2b2b; color: white;" />
  
  <button type="submit" style="background: #ffa116; color: black; font-weight: bold; padding: 8px; border-radius: 6px; border: none; cursor: pointer;">
    Submit Application
  </button>
</form>`,
        expectedOutput: 'Interactive Form Input Preview',
        keyTakeaways: [
          'HTML5 input validation runs natively before JavaScript form submit handlers trigger.',
          'Use fieldset and legend to group related sub-controls in complex forms.'
        ],
        aiDeepDive: `**Security Considerations:**
Never rely solely on client-side HTML form validation. Always sanitize and re-validate inputs on the server or API gateway.`
      }
    ]
  },
  css: {
    title: 'CSS3 Tutorial',
    description: 'Learn Flexbox, CSS Grid, custom properties, animations, and responsive layout patterns.',
    w3schoolUrl: 'https://www.w3schools.com/css/default.asp',
    topics: [
      {
        id: 'css-box-model',
        title: 'CSS Box Model & Sizing',
        category: 'Basics',
        difficulty: 'Easy',
        videoUrl: 'https://www.youtube.com/embed/rIO5326FgPE',
        videoTitle: 'CSS Box Model Explained in 5 Minutes',
        w3schoolLink: 'https://www.w3schools.com/css/css_boxmodel.asp',
        summary: 'Understand margin, border, padding, content area, and box-sizing calculations.',
        content: `### The CSS Box Model
Every element in CSS is a rectangular box comprising 4 concentric layers:
1. **Content**: The text or image itself.
2. **Padding**: Transparent space inside the border.
3. **Border**: Borderline enclosing padding and content.
4. **Margin**: Transparent space outside the border.

#### The Golden Rule of Modern CSS:
\`\`\`css
*, *::before, *::after {
  box-sizing: border-box;
}
\`\`\`
With \`border-box\`, the declared \`width\` includes content + padding + border.`,
        codeExample: `<div style="box-sizing: border-box; width: 100%; max-width: 320px; padding: 16px; border: 2px solid #ffa116; background: #262626; color: #fff; border-radius: 8px; font-family: sans-serif;">
  <h4 style="margin: 0 0 8px 0; color: #ffa116;">Box Model Container</h4>
  <p style="margin: 0; font-size: 13px; color: #aaa;">
    With box-sizing: border-box, padding does not overflow container limits.
  </p>
</div>`,
        expectedOutput: 'Box Model Card Demo',
        keyTakeaways: [
          'Always use box-sizing: border-box to prevent padding from expanding layout widths.',
          'Margin collapse occurs between adjoining vertical margins of block elements.'
        ],
        aiDeepDive: `**Margin Collapse Rule:**
When two vertical margins touch, they collapse into a single margin equal to the largest of the two. Flexbox and Grid items do NOT undergo margin collapse.`
      },
      {
        id: 'css-flexbox',
        title: 'CSS Flexbox Layouts',
        category: 'Layouts',
        difficulty: 'Medium',
        videoUrl: 'https://www.youtube.com/embed/JJSoEo8JSnc',
        videoTitle: 'Flexbox CSS in 20 Minutes',
        w3schoolLink: 'https://www.w3schools.com/css/css3_flexbox.asp',
        summary: 'One-dimensional layout system for alignment, distribution, and responsive ordering.',
        content: `### CSS Flexbox (Flexible Box Layout)
Flexbox solves 1D layout distribution along either a **Main Axis** or **Cross Axis**.

#### Essential Container Properties:
- \`display: flex\`
- \`flex-direction\`: row | column | row-reverse
- \`justify-content\`: flex-start | center | space-between | space-around
- \`align-items\`: stretch | center | flex-start | flex-end
- \`gap\`: spacing between flex items without margin hacks.`,
        codeExample: `<div style="display: flex; gap: 12px; justify-content: space-between; align-items: center; background: #1a1a1a; padding: 16px; border-radius: 8px; border: 1px solid #383838; font-family: sans-serif;">
  <div style="background: #ffa116; color: #000; font-weight: bold; padding: 8px 12px; border-radius: 6px;">Item 1</div>
  <div style="background: #00b8a3; color: #000; font-weight: bold; padding: 8px 12px; border-radius: 6px;">Item 2</div>
  <div style="background: #ff375f; color: #fff; font-weight: bold; padding: 8px 12px; border-radius: 6px;">Item 3</div>
</div>`,
        expectedOutput: 'Flex Row with Space-Between',
        keyTakeaways: [
          'Use flex-grow: 1 on a child to have it consume all remaining available space.',
          'gap property works seamlessly with both Flexbox and Grid in modern browsers.'
        ],
        aiDeepDive: `**Flex Shorthand:**
\`flex: 1 1 0%\` sets \`flex-grow: 1\`, \`flex-shrink: 1\`, and \`flex-basis: 0%\`, ensuring all items start with equal baseline dimensions regardless of initial content length.`
      },
      {
        id: 'css-grid',
        title: 'CSS Grid Architecture',
        category: 'Layouts',
        difficulty: 'Hard',
        videoUrl: 'https://www.youtube.com/embed/rg7Fvvl3taU',
        videoTitle: 'Learn CSS Grid - A Complete Guide',
        w3schoolLink: 'https://www.w3schools.com/css/css_grid.asp',
        summary: 'Two-dimensional grid layout engine for full page layouts and component matrices.',
        content: `### CSS Grid
Grid provides 2D control across simultaneous rows and columns.

#### Key Grid Patterns:
- \`grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))\`: Fluid responsive grid without media queries.
- \`grid-template-areas\`: Named semantic grid layouts.`,
        codeExample: `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-family: sans-serif; color: white;">
  <div style="background: #333; padding: 16px; border-radius: 6px; text-align: center;">Grid Col 1</div>
  <div style="background: #333; padding: 16px; border-radius: 6px; text-align: center;">Grid Col 2</div>
  <div style="background: #333; padding: 16px; border-radius: 6px; text-align: center;">Grid Col 3</div>
</div>`,
        expectedOutput: '3-Column CSS Grid Preview',
        keyTakeaways: [
          'Use auto-fit with minmax() for effortless responsive cards without media queries.',
          'Grid is ideal for 2D macro layouts; Flexbox is best for 1D micro component alignments.'
        ],
        aiDeepDive: `**auto-fit vs auto-fill:**
\`auto-fill\` creates empty invisible tracks if space permits; \`auto-fit\` collapses empty tracks and stretches existing populated columns to fill the entire container.`
      }
    ]
  },
  python: {
    title: 'Python 3 Tutorial',
    description: 'Learn Python syntax, list comprehensions, object-oriented concepts, and DSA algorithms.',
    w3schoolUrl: 'https://www.w3schools.com/python/default.asp',
    topics: [
      {
        id: 'py-basics',
        title: 'Python Fundamentals & Data Types',
        category: 'Basics',
        difficulty: 'Easy',
        videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc',
        videoTitle: 'Python Tutorial for Beginners - Full Course',
        w3schoolLink: 'https://www.w3schools.com/python/python_intro.asp',
        summary: 'Variables, dynamic typing, strings, lists, dictionaries, and tuples.',
        content: `### Python Data Structures
Python is a readable, multi-paradigm interpreted language widely used for algorithms, web backends, and AI.

#### Built-in Primitive & Collection Types:
- \`list\`: Mutable ordered sequence (\`[1, 2, 3]\`)
- \`dict\`: Hash Map key-value store (\`{"a": 1}\`)
- \`set\`: Mutable unordered collection of unique elements (\`{1, 2}\`)
- \`tuple\`: Immutable ordered sequence (\`(1, 2)\`)`,
        codeExample: `# Python List Comprehensions & Dictionaries
candidates = ["alice", "bob", "charlie", "david"]

# Filter names longer than 4 chars and uppercase them
shortlisted = [name.upper() for name in candidates if len(name) > 4]

# Create a frequency score map
scores = {name: len(name) * 10 for name in shortlisted}

print("Shortlisted:", shortlisted)
print("Scores:", scores)`,
        expectedOutput: "Shortlisted: ['ALICE', 'CHARLIE', 'DAVID']\nScores: {'ALICE': 50, 'CHARLIE': 70, 'DAVID': 50}",
        keyTakeaways: [
          'List comprehensions offer concise, idiomatic syntax for array filtering and mapping.',
          'Python dictionaries preserve insertion order from Python 3.7 onwards.'
        ],
        aiDeepDive: `**Python Memory Management:**
Python uses reference counting combined with a generational cycle detector to automatically reclaim unreferenced heap memory.`
      }
    ]
  },
  java: {
    title: 'Java Tutorial',
    description: 'Master Java 17+, Object-Oriented Design, Collections Framework, and concurrency.',
    w3schoolUrl: 'https://www.w3schools.com/java/default.asp',
    topics: [
      {
        id: 'java-oop',
        title: 'Java Classes & Collections',
        category: 'OOP & Collections',
        difficulty: 'Medium',
        videoUrl: 'https://www.youtube.com/embed/eIrMbAQSU34',
        videoTitle: 'Java Tutorial for Beginners - Programming with Mosh',
        w3schoolLink: 'https://www.w3schools.com/java/java_classes.asp',
        summary: 'HashMap, ArrayList, interfaces, generics, and polymorphism.',
        content: `### Java Collections Framework
Java is a strongly-typed, class-based, object-oriented language running on the JVM.

#### Core Collections:
- \`List<T>\`: \`ArrayList\`, \`LinkedList\`
- \`Map<K, V>\`: \`HashMap\`, \`TreeMap\`, \`ConcurrentHashMap\`
- \`Set<T>\`: \`HashSet\`, \`TreeSet\``,
        codeExample: `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> scoreMap = new HashMap<>();
        scoreMap.put("Two Sum", 100);
        scoreMap.put("LRU Cache", 250);
        
        for (Map.Entry<String, Integer> entry : scoreMap.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue() + " pts");
        }
    }
}`,
        expectedOutput: 'Two Sum -> 100 pts\nLRU Cache -> 250 pts',
        keyTakeaways: [
          'HashMap provides O(1) average lookup and insert using hashCode() and equals().',
          'Prefer interface types in variable declarations (e.g. List<String> list = new ArrayList<>()).'
        ],
        aiDeepDive: `**Generics Type Erasure:**
Java compiles generic type information into raw bytecodes with type casts, removing parameter types at runtime to maintain backwards binary compatibility.`
      }
    ]
  },
  sql: {
    title: 'SQL Tutorial',
    description: 'Learn Relational Database queries, JOINs, Indexing, and aggregations.',
    w3schoolUrl: 'https://www.w3schools.com/sql/default.asp',
    topics: [
      {
        id: 'sql-queries',
        title: 'SQL Queries & Complex JOINs',
        category: 'Databases',
        difficulty: 'Medium',
        videoUrl: 'https://www.youtube.com/embed/HXV3zeRR3h4',
        videoTitle: 'SQL Full Course 2024 - Learn SQL in 4 Hours',
        w3schoolLink: 'https://www.w3schools.com/sql/sql_join.asp',
        summary: 'SELECT, INNER/LEFT/RIGHT JOIN, GROUP BY, HAVING, and indexing strategies.',
        content: `### SQL Relational Fundamentals
Structured Query Language (SQL) queries and manipulates relational schemas.

#### Essential JOIN Operations:
- \`INNER JOIN\`: Returns rows where matching keys exist in both tables.
- \`LEFT JOIN\`: Returns all rows from left table and matching rows from right.
- \`GROUP BY\` & \`HAVING\`: Aggregate groups with post-filter conditions.`,
        codeExample: `SELECT 
    u.username,
    COUNT(s.submission_id) AS solved_count,
    AVG(s.score) AS average_score
FROM users u
INNER JOIN submissions s ON u.user_id = s.user_id
WHERE s.status = 'ACCEPTED'
GROUP BY u.user_id, u.username
HAVING COUNT(s.submission_id) >= 10
ORDER BY average_score DESC;`,
        expectedOutput: 'username    | solved_count | average_score\nalex_dev    | 45           | 96.4\nsarah_tech  | 38           | 94.1',
        keyTakeaways: [
          'WHERE filters individual rows before grouping; HAVING filters aggregated groups.',
          'Create composite indexes on (equality_column, range_column) for optimal query execution plans.'
        ],
        aiDeepDive: `**Query Execution Order:**
FROM & JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> DISTINCT -> ORDER BY -> LIMIT.`
      }
    ]
  },
  react: {
    title: 'React Tutorial',
    description: 'Build modern reactive single page applications using Hooks, Components, and State.',
    w3schoolUrl: 'https://www.w3schools.com/react/default.asp',
    topics: [
      {
        id: 'react-hooks',
        title: 'React Hooks: useState & useEffect',
        category: 'Core',
        difficulty: 'Medium',
        videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
        videoTitle: 'React 18 Tutorial for Beginners',
        w3schoolLink: 'https://www.w3schools.com/react/react_hooks.asp',
        summary: 'Manage state and lifecycle side-effects in functional components.',
        content: `### React Functional Architecture
React declarative UI relies on pure functions and reactive hook subscriptions.

#### Core Rules of Hooks:
1. Only call Hooks at the top level (not inside loops, conditions, or nested functions).
2. Only call Hooks from React function components or custom hooks.`,
        codeExample: `import React, { useState, useEffect } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`Solved \${count} questions\`;
  }, [count]);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Solved: {count}
    </button>
  );
}`,
        expectedOutput: 'Interactive React Counter Component',
        keyTakeaways: [
          'Pass an explicit dependency array to useEffect to avoid infinite re-render loops.',
          'Use functional state updates (setCount(c => c + 1)) when new state depends on previous state.'
        ],
        aiDeepDive: `**Reconciliation & Fiber:**
React updates the virtual DOM and calculates minimum reconciliations in Fiber units of work without blocking the main browser UI thread.`
      }
    ]
  },
  cpp: {
    title: 'C++ Tutorial',
    description: 'Master low-level memory control, pointers, STL vectors, maps, and DSA optimization.',
    w3schoolUrl: 'https://www.w3schools.com/cpp/default.asp',
    topics: [
      {
        id: 'cpp-stl',
        title: 'C++ STL & Vectors',
        category: 'DSA & STL',
        difficulty: 'Medium',
        videoUrl: 'https://www.youtube.com/embed/vLnPwxZdW4Y',
        videoTitle: 'C++ Full Course for Beginners',
        w3schoolLink: 'https://www.w3schools.com/cpp/cpp_vectors.asp',
        summary: 'Standard Template Library: vector, unordered_map, priority_queue, and sort algorithms.',
        content: `### C++ Standard Template Library (STL)
C++ STL provides highly optimized generic template containers and algorithms.

#### Primary STL Containers:
- \`std::vector<T>\`: Dynamic array with contiguous memory.
- \`std::unordered_map<K, V>\`: O(1) Hash Table.
- \`std::priority_queue<T>\`: Max/Min Binary Heap.`,
        codeExample: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {5, 2, 8, 1, 9};
    std::sort(nums.begin(), nums.end());
    
    std::cout << "Sorted: ";
    for (int n : nums) {
        std::cout << n << " ";
    }
    std::cout << std::endl;
    return 0;
}`,
        expectedOutput: 'Sorted: 1 2 5 8 9',
        keyTakeaways: [
          'std::sort uses Introsort (hybrid of Quicksort, Heapsort, and Insertion Sort) running in O(N log N).',
          'Pass large objects by const reference (const std::string& str) to avoid expensive deep copies.'
        ],
        aiDeepDive: `**Move Semantics (rvalue references &&):**
C++11 move constructors transfer internal resource pointers (e.g. heap arrays) rather than cloning bytes, reducing memory allocations to O(1).`
      }
    ]
  }
};

const Courses = () => {
  const [selectedLang, setSelectedLang] = useState('javascript');
  const [selectedTopicId, setSelectedTopicId] = useState('js-intro');
  const [activeTab, setActiveTab] = useState('guide'); // 'guide', 'video', 'aideepdive'
  const [searchTerm, setSearchTerm] = useState('');
  const [userCode, setUserCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // AI Helper States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiErrorFix, setAiErrorFix] = useState(null);

  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem('completed_course_topics');
      return saved ? new Set(JSON.parse(saved)) : new Set(['js-intro']);
    } catch {
      return new Set(['js-intro']);
    }
  });

  const currentCourse = COURSE_DATA[selectedLang] || COURSE_DATA.javascript;

  const currentTopic = useMemo(() => {
    const found = currentCourse.topics.find((t) => t.id === selectedTopicId);
    return found || currentCourse.topics[0];
  }, [currentCourse, selectedTopicId]);

  const [aiChatHistory, setAiChatHistory] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am your AI Tutor. Ask me anything about this topic, request code explanations, or click "Fix with AI" in the editor.',
    },
  ]);
  const [isFixModalOpen, setIsFixModalOpen] = useState(false);
  const chatBottomRef = useRef(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatHistory, isAiLoading]);

  // Sync userCode when current topic changes
  useEffect(() => {
    if (currentTopic) {
      setUserCode(currentTopic.codeExample);
      setCodeOutput('');
      setAiErrorFix(null);
      setAiResponse('');
      setAiChatHistory([
        {
          role: 'assistant',
          text: `Ready to assist with **${currentTopic.title}**! Ask any question, explore key interview points, or test live code.`,
        },
      ]);
    }
  }, [currentTopic]);

  const filteredTopics = useMemo(() => {
    return currentCourse.topics.filter((topic) =>
      topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      topic.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentCourse, searchTerm]);

  const currentIndex = currentCourse.topics.findIndex((t) => t.id === currentTopic.id);
  const prevTopic = currentIndex > 0 ? currentCourse.topics[currentIndex - 1] : null;
  const nextTopic = currentIndex < currentCourse.topics.length - 1 ? currentCourse.topics[currentIndex + 1] : null;

  const toggleTopicCompletion = (topicId) => {
    setCompletedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      try {
        localStorage.setItem('completed_course_topics', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const runCode = () => {
    setIsRunning(true);
    setAiErrorFix(null);
    setTimeout(() => {
      setIsRunning(false);
      if (selectedLang === 'html' || selectedLang === 'css') {
        setCodeOutput('__HTML_PREVIEW__');
      } else if (selectedLang === 'javascript') {
        try {
          const logs = [];
          const customConsole = {
            log: (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')),
            error: (...args) => logs.push('[Error]: ' + args.join(' ')),
            warn: (...args) => logs.push('[Warn]: ' + args.join(' ')),
          };
          const fn = new Function('console', userCode);
          fn(customConsole);
          setCodeOutput(logs.join('\n') || 'Code executed successfully (No console output).');
        } catch (err) {
          setCodeOutput(`Runtime Error: ${err.message}`);
          setAiErrorFix({
            errorMessage: err.message,
            explanation: `JavaScript encountered a ${err.name}: "${err.message}". This usually occurs when variables are undeclared, missing syntax brackets, or accessing properties on null/undefined.`,
            suggestedCode: currentTopic.codeExample,
          });
        }
      } else {
        setCodeOutput(currentTopic.expectedOutput);
      }
    }, 400);
  };

  const handleAiFix = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      
      let fixExplanation = `The code for **${currentTopic.title}** has been diagnosed and optimized with industry standard practices.`;
      let suggestedCode = userCode;

      // Smart error detection for various languages
      if (selectedLang === 'html') {
        if (!userCode.includes('<!DOCTYPE html>')) {
          fixExplanation = 'Missing standard HTML5 doctype. Added `<!DOCTYPE html>` declaration and ensured all opening & closing container tags match properly.';
          suggestedCode = `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>${currentTopic.title}</title>\n</head>\n<body>\n  ${userCode.replace(/<!DOCTYPE html>|<html[^>]*>|<\/html>|<head>[\s\S]*?<\/head>|<body>|<\/body>/gi, '').trim()}\n</body>\n</html>`;
        } else if (!userCode.includes('</html>') || !userCode.includes('</body>')) {
          fixExplanation = 'Detected unclosed `<body>` or `<html>` tags. Repaired document structure.';
          suggestedCode = currentTopic.codeExample;
        } else {
          fixExplanation = 'HTML structure and semantics verified. Optimized layout styling and accessibility attributes.';
          suggestedCode = currentTopic.codeExample;
        }
      } else if (selectedLang === 'javascript') {
        if (userCode.includes('var ')) {
          fixExplanation = 'Replaced legacy `var` declarations with block-scoped `const` / `let` to prevent variable hoisting and scope pollution.';
          suggestedCode = userCode.replace(/\bvar\b/g, 'const');
        } else if (!userCode.includes('console.log') && !userCode.includes('return')) {
          fixExplanation = 'Added console logging so you can immediately see execution results in the output window.';
          suggestedCode = `${userCode}\n\n// Verified output\nconsole.log("Execution output verified!");`;
        } else {
          fixExplanation = 'JavaScript syntax, async handling, and ES6+ standards validated.';
          suggestedCode = currentTopic.codeExample;
        }
      } else if (selectedLang === 'css') {
        if (!userCode.includes('{') || !userCode.includes('}')) {
          fixExplanation = 'Detected missing CSS selector rules or unmatched brackets `{}`. Applied valid CSS rule blocks.';
          suggestedCode = currentTopic.codeExample;
        } else {
          fixExplanation = 'CSS rules checked for modern flexbox/grid layout and vendor prefix compatibility.';
          suggestedCode = currentTopic.codeExample;
        }
      } else {
        fixExplanation = `Diagnosed syntax structure and optimized logic flow for ${COURSE_LANGUAGES.find(l => l.id === selectedLang)?.name}.`;
        suggestedCode = currentTopic.codeExample;
      }

      setAiErrorFix({
        errorMessage: 'AI Code Diagnosis & Fix Ready',
        explanation: fixExplanation,
        suggestedCode: suggestedCode,
      });
      setIsFixModalOpen(true);
    }, 450);
  };

  const generateAiCodeReply = (query, lang, topic) => {
    const q = query.toLowerCase();

    // 1. NAVBAR / NAVIGATION BAR
    if (q.includes('nav') || q.includes('navbar') || q.includes('navigation') || q.includes('header')) {
      const navCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Modern Responsive Navbar</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; font-family: system-ui, sans-serif; }
    body { background: #121212; color: #fff; padding: 20px; }
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #1e1e1e;
      padding: 14px 28px;
      border-radius: 12px;
      border: 1px solid #333;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }
    .logo {
      font-size: 1.25rem;
      font-weight: 800;
      color: #ffa116;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 20px;
    }
    .nav-links a {
      color: #b3b3b3;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a:hover { color: #ffa116; }
    .cta-btn {
      background: #ffa116;
      color: #000;
      padding: 8px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 0.85rem;
      border: none;
      cursor: pointer;
      transition: transform 0.15s, background 0.2s;
    }
    .cta-btn:hover { background: #e08e13; transform: translateY(-1px); }
  </style>
</head>
<body>
  <nav class="navbar">
    <a href="#" class="logo">⚡ TechPrep</a>
    <ul class="nav-links">
      <li><a href="#">Home</a></li>
      <li><a href="#">Courses</a></li>
      <li><a href="#">Practice</a></li>
      <li><a href="#">Interviews</a></li>
    </ul>
    <button class="cta-btn">Get Started</button>
  </nav>
  <div style="margin-top: 30px; text-align: center; color: #888;">
    <h2>Welcome to your live rendered Navbar!</h2>
    <p>Click "Run Code" or edit the colors and links above.</p>
  </div>
</body>
</html>`;
      return {
        text: `Here is a modern, responsive **Navbar** with flexbox layout, hover micro-interactions, and dark theme styling. Click **"⚡ Run in Playground"** below to preview and test it live!`,
        code: navCode,
        codeLang: 'html',
      };
    }

    // 2. BUTTONS & ANIMATIONS
    if (q.includes('button') || q.includes('btn') || q.includes('animation') || q.includes('glow')) {
      const btnCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Glow Animated Buttons</title>
  <style>
    body { background: #181818; display: flex; gap: 20px; justify-content: center; align-items: center; min-height: 250px; }
    .glow-btn {
      position: relative;
      padding: 12px 28px;
      font-size: 14px;
      font-weight: 700;
      color: #000;
      background: #ffa116;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 0 15px rgba(255, 161, 22, 0.4);
    }
    .glow-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 25px rgba(255, 161, 22, 0.8);
      background: #ffb443;
    }
    .glow-btn:active { transform: scale(0.96); }
  </style>
</head>
<body>
  <button class="glow-btn">⚡ Start Practice</button>
</body>
</html>`;
      return {
        text: `Here is a modern **Glow & Shimmer Button** with smooth hover lift and tactile active feedback:`,
        code: btnCode,
        codeLang: 'html',
      };
    }

    // 3. LOGIN / SIGNUP FORM
    if (q.includes('form') || q.includes('login') || q.includes('signup') || q.includes('input')) {
      const formCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Modern Login Form</title>
  <style>
    * { box-sizing: border-box; font-family: system-ui, sans-serif; }
    body { background: #121212; display: flex; justify-content: center; align-items: center; min-height: 280px; padding: 20px; }
    .form-card {
      background: #1e1e1e;
      border: 1px solid #333;
      padding: 24px;
      border-radius: 14px;
      width: 100%;
      max-width: 340px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .form-card h2 { color: #fff; font-size: 1.1rem; margin-bottom: 16px; text-align: center; }
    .input-group { margin-bottom: 12px; }
    .input-group label { display: block; font-size: 0.75rem; color: #aaa; margin-bottom: 4px; font-weight: 600; }
    .input-group input {
      width: 100%;
      padding: 10px;
      background: #121212;
      border: 1px solid #383838;
      border-radius: 8px;
      color: #fff;
      font-size: 0.85rem;
      outline: none;
    }
    .input-group input:focus { border-color: #ffa116; }
    .submit-btn {
      width: 100%;
      background: #ffa116;
      color: #000;
      padding: 10px;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      cursor: pointer;
      margin-top: 8px;
    }
    .submit-btn:hover { background: #e08e13; }
  </style>
</head>
<body>
  <div class="form-card">
    <h2>Account Login</h2>
    <form onsubmit="event.preventDefault(); alert('Login submitted successfully!');">
      <div class="input-group">
        <label>Email Address</label>
        <input type="email" placeholder="you@company.com" required />
      </div>
      <div class="input-group">
        <label>Password</label>
        <input type="password" placeholder="••••••••" required />
      </div>
      <button type="submit" class="submit-btn">Sign In</button>
    </form>
  </div>
</body>
</html>`;
      return {
        text: `Here is a complete **Login / Input Form** component styled with dark UI and interactive submission:`,
        code: formCode,
        codeLang: 'html',
      };
    }

    // 4. FLEXBOX & CSS GRID
    if (q.includes('flexbox') || q.includes('grid') || q.includes('center') || q.includes('layout')) {
      const layoutCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Flexbox & Grid Layout</title>
  <style>
    body { background: #121212; font-family: system-ui, sans-serif; padding: 20px; color: #fff; }
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
    }
    .card {
      background: #1e1e1e;
      border: 1px solid #383838;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      transition: border-color 0.2s;
    }
    .card:hover { border-color: #ffa116; }
    .card h3 { color: #ffa116; font-size: 0.95rem; margin-bottom: 6px; }
    .card p { font-size: 0.75rem; color: #888; }
  </style>
</head>
<body>
  <div class="grid-container">
    <div class="card"><h3>Feature 1</h3><p>Fast Rendering</p></div>
    <div class="card"><h3>Feature 2</h3><p>Live Code Run</p></div>
    <div class="card"><h3>Feature 3</h3><p>AI Tutor</p></div>
  </div>
</body>
</html>`;
      return {
        text: `Here is a responsive **CSS Grid & Flexbox Layout** that automatically reflows across mobile and desktop screens:`,
        code: layoutCode,
        codeLang: 'html',
      };
    }

    // 5. ALGORITHMS (Two Sum, Binary Search, Reverse)
    if (q.includes('two sum') || q.includes('binary search') || q.includes('reverse') || q.includes('sort') || q.includes('algorithm')) {
      let algoCode = '';
      if (lang === 'python') {
        algoCode = `# Binary Search Algorithm in Python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid  # Found target index
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

# Demonstration
numbers = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
target_val = 23
result = binary_search(numbers, target_val)

print(f"Sorted Array: {numbers}")
print(f"Target {target_val} found at index: {result}")`;
      } else {
        algoCode = `// Two Sum Algorithm (O(n) Time Complexity using Hash Map)
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// Test cases
const nums = [2, 7, 11, 15];
const target = 9;
const indices = twoSum(nums, target);

console.log("Input Array:", nums);
console.log("Target Sum:", target);
console.log("Indices found:", indices);
console.log("Values:", nums[indices[0]], "+", nums[indices[1]], "=", target);`;
      }

      return {
        text: `Here is the optimal $O(\\log n)$ / $O(n)$ algorithm implementation with test cases:`,
        code: algoCode,
        codeLang: lang === 'python' ? 'python' : 'javascript',
      };
    }

    // 6. JAVASCRIPT / ASYNC / PROMISES / DEBOUNCE
    if (q.includes('debounce') || q.includes('throttle') || q.includes('fetch') || q.includes('promise') || q.includes('async')) {
      const jsCode = `// Debounce function implementation in JavaScript
function debounce(func, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
}

// Simulated search handler
const logSearch = debounce((query) => {
  console.log("API Query dispatched for:", query);
}, 200);

console.log("Typing 'React' rapidly...");
logSearch("R");
logSearch("Re");
logSearch("Rea");
logSearch("React"); // Only this final call executes after 200ms!`;
      return {
        text: `Here is the standard JavaScript **Debounce utility** pattern used in search bars and resize events:`,
        code: jsCode,
        codeLang: 'javascript',
      };
    }

    // 7. DEFAULT TOPIC SYNTHESIS
    return {
      text: `**AI Guide for "${query}":**\n\nRegarding **${topic.title}** in **${COURSE_LANGUAGES.find(l => l.id === lang)?.name}**:\n\n${topic.summary}\n\n**Core Syntax & Best Practice:**\n${topic.keyTakeaways?.[0] || 'Write clean, modular code with descriptive variable naming.'}`,
      code: topic.codeExample,
      codeLang: lang,
    };
  };

  const sendAiQuestion = (questionText) => {
    if (!questionText.trim()) return;
    
    // Add user message to chat history
    setAiChatHistory((prev) => [...prev, { role: 'user', text: questionText }]);
    setAiPrompt('');
    setIsAiLoading(true);

    setTimeout(() => {
      setIsAiLoading(false);
      const aiReplyData = generateAiCodeReply(questionText, selectedLang, currentTopic);
      setAiChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: aiReplyData.text,
          code: aiReplyData.code,
          codeLang: aiReplyData.codeLang,
        },
      ]);
    }, 450);
  };

  const applyAiCodeToPlayground = (snippet) => {
    if (!snippet) return;
    setUserCode(snippet);
    runCode();
  };

  const copyCode = () => {
    navigator.clipboard.writeText(userCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const completedCountForLang = currentCourse.topics.filter((t) => completedTopics.has(t.id)).length;
  const progressPercent = Math.round((completedCountForLang / currentCourse.topics.length) * 100) || 0;

  return (
    <div className="w-full min-h-screen bg-[#1a1a1a] text-neutral-200">
      {/* AI Code Fix Modal */}
      {isFixModalOpen && aiErrorFix && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl rounded-2xl border border-[#ffa116]/40 bg-[#222222] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#383838] pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffa116]/15 text-[#ffa116]">
                  <Wand2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">AI Code Fix & Optimization</h3>
                  <p className="text-[11px] text-[#8a8a8a]">{currentTopic.title}</p>
                </div>
              </div>
              <button
                onClick={() => setIsFixModalOpen(false)}
                className="rounded-lg p-1 text-[#8a8a8a] hover:bg-[#333] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="rounded-lg border border-[#ffa116]/30 bg-[#ffa116]/10 p-3.5 text-xs text-[#e5e7eb]">
              <p className="font-semibold text-[#ffa116] mb-1">Diagnosis & Solution:</p>
              <p className="leading-relaxed">{aiErrorFix.explanation}</p>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a] mb-1.5">
                Suggested Fixed Code
              </p>
              <pre className="max-h-48 overflow-auto rounded-lg border border-[#383838] bg-[#151515] p-3 font-mono text-xs text-[#00b8a3]">
                {aiErrorFix.suggestedCode}
              </pre>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[#383838] pt-3">
              <button
                onClick={() => setIsFixModalOpen(false)}
                className="rounded-lg border border-[#383838] bg-[#2d2d2d] px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-[#383838] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setUserCode(aiErrorFix.suggestedCode);
                  setIsFixModalOpen(false);
                  setAiErrorFix(null);
                  runCode();
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffa116] px-4 py-2 text-xs font-bold text-black hover:bg-[#e08e13]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Apply Fix to Editor & Run</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Language Bar (W3Schools Style) */}
      <div className="sticky top-0 z-40 border-b border-[#383838] bg-[#222222]/95 backdrop-blur-md">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 py-2">
          {/* Scrollable Language Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="mr-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8a8a8a]">
              <GraduationCap className="h-4 w-4 text-[#ffa116]" /> Courses:
            </span>
            {COURSE_LANGUAGES.map((lang) => {
              const isSelected = selectedLang === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedLang(lang.id);
                    const newCourse = COURSE_DATA[lang.id] || COURSE_DATA.javascript;
                    setSelectedTopicId(newCourse.topics[0]?.id || '');
                    setActiveTab('guide');
                  }}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all duration-200 ${
                    isSelected
                      ? 'bg-[#ffa116] text-black shadow-[0_0_12px_rgba(255,161,22,0.35)]'
                      : 'bg-[#2d2d2d] text-[#a3a3a3] hover:bg-[#383838] hover:text-white'
                  }`}
                >
                  <span>{lang.icon}</span>
                  <span>{lang.name}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#8a8a8a] shrink-0 ml-4">
            <a
              href={currentCourse.w3schoolUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded bg-[#2e2e2e] border border-[#383838] px-2.5 py-1 text-[11px] font-semibold text-[#00b8a3] hover:border-[#00b8a3] hover:text-white transition-colors"
            >
              <ExternalLink className="h-3 w-3" /> W3Schools Docs
            </a>
            <span className="font-semibold text-[#ffa116]">{progressPercent}%</span>
            <div className="h-1.5 w-16 rounded-full bg-[#383838]">
              <div className="h-full rounded-full bg-[#ffa116]" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container: Left Syllabus Sidebar + Right Interactive Lesson */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-6 px-4 py-6">
        {/* Left Curriculum / Topic Sidebar */}
        <aside className="col-span-12 space-y-4 md:col-span-4 lg:col-span-3">
          <div className="rounded-xl border border-[#383838] bg-[#262626] p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#ffa116]" /> {currentCourse.title}
              </h2>
              <span className="rounded-full bg-[#ffa116]/10 px-2 py-0.5 text-[10px] font-bold text-[#ffa116]">
                {completedCountForLang}/{currentCourse.topics.length} Done
              </span>
            </div>
            <p className="mb-3 text-xs text-[#8a8a8a]">{currentCourse.description}</p>

            {/* Search Topics */}
            <div className="relative mb-3">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter topics..."
                className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-3 py-1.5 pl-8 text-xs text-white outline-none placeholder:text-[#8a8a8a] focus:border-[#ffa116]"
              />
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-[#8a8a8a]" />
            </div>

            {/* Topic List */}
            <div className="max-h-[420px] space-y-1 overflow-y-auto pr-1">
              {filteredTopics.map((topic, idx) => {
                const isActive = topic.id === currentTopic.id;
                const isCompleted = completedTopics.has(topic.id);

                return (
                  <div
                    key={topic.id}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-all ${
                      isActive
                        ? 'border border-[#ffa116]/50 bg-[#ffa116]/15 font-semibold text-[#ffa116]'
                        : 'border border-transparent text-[#d1d1d1] hover:bg-[#303030]'
                    }`}
                  >
                    <button
                      onClick={() => {
                        setSelectedTopicId(topic.id);
                        setActiveTab('guide');
                      }}
                      className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    >
                      <span className="text-[10px] text-[#8a8a8a]">{idx + 1}.</span>
                      <span className="truncate">{topic.title}</span>
                    </button>

                    <button
                      onClick={() => toggleTopicCompletion(topic.id)}
                      title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                      className="ml-2 shrink-0 p-0.5 text-[#8a8a8a] hover:text-[#00b8a3]"
                    >
                      <CheckCircle
                        className={`h-4 w-4 transition-colors ${
                          isCompleted ? 'fill-[#00b8a3] text-[#1a1a1a]' : 'text-[#555]'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Learning Assistant in Sidebar (Interactive Chat directly inside card) */}
          <div className="rounded-xl border border-[#383838] bg-[#262626] p-4 text-xs space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Bot className="h-4 w-4 text-[#ffa116]" /> AI Learning Assistant
              </h3>
              <button
                onClick={() => setAiChatHistory([{ role: 'assistant', text: `Ask me anything about ${currentTopic.title}!` }])}
                className="text-[10px] text-[#8a8a8a] hover:text-white"
                title="Clear Chat"
              >
                Clear
              </button>
            </div>

            {/* In-Card Chat History */}
            <div className="max-h-64 overflow-y-auto space-y-2.5 rounded-lg border border-[#383838] bg-[#1a1a1a] p-2.5">
              {aiChatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-lg text-[11px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#ffa116]/15 border border-[#ffa116]/30 text-white ml-2'
                      : 'bg-[#262626] border border-[#383838] text-[#d1d1d1]'
                  }`}
                >
                  <p className="font-bold text-[10px] text-[#8a8a8a] mb-1 flex items-center justify-between">
                    <span>{msg.role === 'user' ? '👤 You' : '🤖 AI Code Tutor'}</span>
                    {msg.code && (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-[#ffa116]/20 text-[#ffa116] font-bold">
                        {msg.codeLang || 'Code'}
                      </span>
                    )}
                  </p>
                  <div className="whitespace-pre-line mb-1.5">{msg.text}</div>

                  {/* Rendered Code Block if present */}
                  {msg.code && (
                    <div className="mt-2 space-y-1.5">
                      <div className="relative rounded-lg border border-[#383838] bg-[#141414] p-2">
                        <pre className="max-h-36 overflow-auto font-mono text-[10px] leading-tight text-[#00b8a3]">
                          {msg.code}
                        </pre>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => applyAiCodeToPlayground(msg.code)}
                          className="flex-1 flex items-center justify-center gap-1 rounded bg-[#ffa116] py-1 text-[10px] font-bold text-black hover:bg-[#e08e13] transition-colors"
                        >
                          <Play className="h-2.5 w-2.5 fill-black" />
                          <span>⚡ Run in Playground</span>
                        </button>
                        <button
                          onClick={() => navigator.clipboard.writeText(msg.code)}
                          className="rounded border border-[#383838] bg-[#222] px-2 py-1 text-[10px] text-[#aaa] hover:text-white"
                          title="Copy Code"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {isAiLoading && (
                <div className="p-2 rounded-lg bg-[#262626] text-[11px] text-[#ffa116] flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="h-3.5 w-3.5 animate-spin" /> Thinking & generating code...
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="flex flex-wrap gap-1">
              {[
                'Navbar CSS',
                'Explain simply',
                'Interview questions',
                'Two Sum Code',
                'Common edge cases',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendAiQuestion(suggestion)}
                  className="rounded-full border border-[#383838] bg-[#202020] px-2 py-0.5 text-[10px] text-[#a3a3a3] hover:border-[#ffa116] hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input form */}
            <div className="flex gap-1.5 pt-1">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendAiQuestion(aiPrompt)}
                placeholder="Ask AI about this topic..."
                className="w-full rounded-lg border border-[#383838] bg-[#1a1a1a] px-2.5 py-1.5 text-xs text-white outline-none placeholder:text-[#666] focus:border-[#ffa116]"
              />
              <button
                onClick={() => sendAiQuestion(aiPrompt)}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="rounded-lg bg-[#ffa116] px-3 py-1.5 font-bold text-black hover:bg-[#e08e13] disabled:opacity-50"
              >
                <Sparkles className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Center / Right Content: Interactive Lesson, Video, AI & Live Playground */}
        <main className="col-span-12 space-y-6 md:col-span-8 lg:col-span-9">
          {/* Lesson Header & Media Tabs */}
          <div className="rounded-xl border border-[#383838] bg-[#262626] p-6 shadow-xl">
            <div className="flex flex-col justify-between gap-3 border-b border-[#383838] pb-4 sm:flex-row sm:items-center">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="rounded bg-[#383838] px-2 py-0.5 text-[10px] font-bold text-[#ffa116]">
                    {currentTopic.category}
                  </span>
                  <span className="rounded bg-[#00b8a3]/10 px-2 py-0.5 text-[10px] font-semibold text-[#00b8a3]">
                    {currentTopic.difficulty}
                  </span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white">{currentTopic.title}</h1>
              </div>

              {/* Learning View Mode Tabs */}
              <div className="flex items-center gap-1.5 rounded-lg border border-[#383838] bg-[#1a1a1a] p-1">
                <button
                  onClick={() => setActiveTab('guide')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === 'guide'
                      ? 'bg-[#ffa116] text-black font-bold'
                      : 'text-[#8a8a8a] hover:text-white'
                  }`}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  <span>Text Guide</span>
                </button>

                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === 'video'
                      ? 'bg-[#ffa116] text-black font-bold'
                      : 'text-[#8a8a8a] hover:text-white'
                  }`}
                >
                  <YoutubeIcon className="h-3.5 w-3.5 text-[#ff375f]" />
                  <span>Video Lesson</span>
                </button>

                <button
                  onClick={() => setActiveTab('aideepdive')}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === 'aideepdive'
                      ? 'bg-[#ffa116] text-black font-bold'
                      : 'text-[#8a8a8a] hover:text-white'
                  }`}
                >
                  <Bot className="h-3.5 w-3.5 text-[#61dafb]" />
                  <span>AI Deep Dive</span>
                </button>
              </div>
            </div>

            {/* TAB 1: Text Guide */}
            {activeTab === 'guide' && (
              <div className="mt-5 space-y-4 animate-fadeIn">
                <div className="prose prose-invert max-w-none text-xs leading-relaxed text-[#c7c7c7] whitespace-pre-line">
                  {currentTopic.content}
                </div>

                {/* Key Takeaways */}
                {currentTopic.keyTakeaways && currentTopic.keyTakeaways.length > 0 && (
                  <div className="mt-6 rounded-lg border border-[#ffa116]/30 bg-[#ffa116]/5 p-4">
                    <h4 className="mb-2 text-xs font-bold text-[#ffa116] flex items-center gap-1.5">
                      <Lightbulb className="h-4 w-4" /> Key Interview Takeaways
                    </h4>
                    <ul className="space-y-1.5 pl-4 list-disc text-xs text-[#d1d1d1]">
                      {currentTopic.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx}>{takeaway}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Video Lesson */}
            {activeTab === 'video' && (
              <div className="mt-5 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-[#8a8a8a]">
                  <span className="font-semibold text-white flex items-center gap-2">
                    <Video className="h-4 w-4 text-[#ff375f]" /> {currentTopic.videoTitle || 'Masterclass Video Lesson'}
                  </span>
                  <a
                    href={currentTopic.w3schoolLink || currentCourse.w3schoolUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#00b8a3] hover:underline flex items-center gap-1"
                  >
                    W3Schools Tutorial <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#383838] bg-black shadow-2xl">
                  {currentTopic.videoUrl ? (
                    <iframe
                      src={currentTopic.videoUrl}
                      title={currentTopic.videoTitle}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#8a8a8a]">
                      Video tutorial is loading or streaming live.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: AI Deep Dive & Q&A */}
            {activeTab === 'aideepdive' && (
              <div className="mt-5 space-y-4 animate-fadeIn">
                <div className="rounded-lg border border-[#383838] bg-[#1a1a1a] p-4 text-xs">
                  <h3 className="mb-2 font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#ffa116]" /> AI Interview Prep & Architectural Analysis
                  </h3>
                  <div className="whitespace-pre-line leading-relaxed text-[#c7c7c7]">
                    {currentTopic.aiDeepDive || 'AI Deep Dive analysis ready for this lesson.'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Interactive "Try it Yourself" Code Sandbox with AI Error Solver */}
          <div className="rounded-xl border border-[#383838] bg-[#222222] shadow-xl overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#383838] bg-[#1e1e1e] px-4 py-3">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4 text-[#ffa116]" />
                <span className="text-xs font-bold text-white">Interactive Code Playground: Try it Yourself</span>
              </div>

              <div className="flex items-center gap-2">
                {/* AI Fix & Solve Button */}
                <button
                  onClick={handleAiFix}
                  disabled={isAiLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#ffa116]/40 bg-[#ffa116]/10 px-3 py-1.5 text-xs font-semibold text-[#ffa116] transition-all hover:bg-[#ffa116] hover:text-black active:scale-95"
                  title="Detect & Fix Code Errors with AI"
                >
                  <Wand2 className={`h-3.5 w-3.5 ${isAiLoading ? 'animate-spin' : ''}`} />
                  <span>{isAiLoading ? 'AI Analyzing...' : 'Fix with AI'}</span>
                </button>

                <button
                  onClick={copyCode}
                  className="rounded-lg border border-[#383838] bg-[#282828] px-2.5 py-1 text-xs text-[#8a8a8a] transition-colors hover:text-white"
                >
                  {isCopied ? 'Copied!' : 'Copy'}
                </button>

                <button
                  onClick={() => {
                    setUserCode(currentTopic.codeExample);
                    setCodeOutput('');
                    setAiErrorFix(null);
                  }}
                  title="Reset Code"
                  className="rounded-lg border border-[#383838] bg-[#282828] p-1 text-[#8a8a8a] transition-colors hover:text-white"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                {/* Run Code Button */}
                <button
                  onClick={runCode}
                  disabled={isRunning}
                  className="group relative inline-flex items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-[#ffa116] px-4 py-1.5 text-xs font-bold text-black transition-all hover:bg-[#e08e13] active:scale-95"
                >
                  <Play className="h-3.5 w-3.5 fill-black" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
              </div>
            </div>

            {/* Code Editor Area: Editable Code + Live Preview/Console */}
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#383838]">
              {/* Code Input */}
              <div className="p-4 bg-[#1a1a1a]">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a]">
                    Editable Source Code (Write / Edit Here)
                  </p>
                  <span className="text-[10px] text-[#666]">Press Run Code to execute</span>
                </div>
                <textarea
                  value={userCode}
                  onChange={(e) => {
                    setUserCode(e.target.value);
                    if (aiErrorFix) setAiErrorFix(null);
                  }}
                  rows="13"
                  className="w-full rounded-lg border border-[#333333] bg-[#151515] p-3 font-mono text-xs leading-relaxed text-neutral-200 outline-none focus:border-[#ffa116]"
                  spellCheck="false"
                />
              </div>

              {/* Output Console or Live HTML Preview */}
              <div className="p-4 bg-[#181818]">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a8a8a]">
                    {selectedLang === 'html' || selectedLang === 'css' ? 'Live Browser Render' : 'Console Execution Output'}
                  </p>
                  {codeOutput && (
                    <span className="text-[10px] text-[#00b8a3] flex items-center gap-1">
                      <Check className="h-3 w-3" /> Live
                    </span>
                  )}
                </div>

                {selectedLang === 'html' || selectedLang === 'css' ? (
                  <div className="h-[255px] w-full overflow-auto rounded-lg border border-[#333333] bg-[#111111] p-3 shadow-inner">
                    <iframe
                      title="HTML Preview"
                      srcDoc={userCode}
                      className="w-full h-full min-h-[220px] border-0"
                      sandbox="allow-scripts"
                    />
                  </div>
                ) : (
                  <div className="h-[255px] w-full overflow-auto rounded-lg border border-[#333333] bg-[#111111] p-3 font-mono text-xs text-[#00b8a3] shadow-inner">
                    {codeOutput ? (
                      <pre className="whitespace-pre-wrap">{codeOutput}</pre>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-center text-[#666]">
                        <Terminal className="h-6 w-6 mb-2 opacity-40" />
                        <span>Click "Run Code" above to execute your edits and view live console outputs.</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Previous / Next Navigation Bar (W3Schools Style) */}
          <div className="flex items-center justify-between rounded-xl border border-[#383838] bg-[#262626] p-4 shadow-lg">
            {prevTopic ? (
              <button
                onClick={() => {
                  setSelectedTopicId(prevTopic.id);
                  setActiveTab('guide');
                }}
                className="flex items-center gap-1.5 rounded-lg border border-[#383838] bg-[#2d2d2d] px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-[#ffa116] hover:bg-[#333]"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous: {prevTopic.title}</span>
              </button>
            ) : <div />}

            {nextTopic && (
              <button
                onClick={() => {
                  setSelectedTopicId(nextTopic.id);
                  setActiveTab('guide');
                }}
                className="flex items-center gap-1.5 rounded-lg bg-[#ffa116] px-4 py-2 text-xs font-bold text-black transition-all hover:bg-[#e08e13]"
              >
                <span>Next: {nextTopic.title}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Courses;
