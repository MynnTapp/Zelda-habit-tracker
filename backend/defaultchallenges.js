const mongoose = require("mongoose");
require("dotenv").config();

const Challenge = require("./models/Challenge");

const challenges = [
  {
    title: "Sum of Two Numbers",
    description: "Write a function that returns the sum of two numbers.",
    difficulty: "Easy",
    solutions: ["function sum(a, b) { return a + b; }"],
    testCases:  [
  { input: [1, 2], expected: 3 },
  { input: [5, 7], expected: 12 },
  { input: [-1, -1], expected: -2 },
],
    rewards: { xp: 10, coins: 5 },
  },
  {
    title: "Check Even or Odd",
    description: "Write a function that checks if a number is even or odd.",
    difficulty: "Easy",
    solutions: ["function isEven(n) { return n % 2 === 0; }"],
    testCases: [{ input: [2], expected: true },  
  { input: [3], expected: false },
  { input: [0], expected: true },  
  { input: [-4], expected: true }, 
  { input: [-7], expected: false }],
    rewards: { xp: 10, coins: 5 },
  },
  {
    title: "Convert Celsius to Fahrenheit",
    description: "Write a function to convert Celsius to Fahrenheit.",
    difficulty: "Easy",
    solutions: ["function celsiusToFahrenheit(c) { return (c * 9) / 5 + 32; }"],
    testCases:[{ input: [0], expected: 32 }, 
  { input: [100], expected: 212 },  
  { input: [-40], expected: -40 },  
  { input: [37], expected: 98.6 },
  { input: [25], expected: 77 }],
    rewards: { xp: 10, coins: 5 },
  },
  {
    title: "Find the Largest Number",
    description: "Write a function that returns the largest number in an array.",
    difficulty: "Medium",
    solutions: ["function maxNumber(arr) { return Math.max(...arr); }"],
    rewards: { xp: 20, coins: 10 },
    testCases: [
  { input: [[1, 2, 3, 4, 5]], expected: 5 },      
  { input: [[-10, -5, -1, -20]], expected: -1 }, 
  { input: [[5]], expected: 5 },                 
  { input: [[100, 50, 200, 150]], expected: 200 },
  { input: [[0, -1, -2, -3]], expected: 0 },      
  { input: [[9, 9, 9, 9]], expected: 9 },      
]
  },
  {
    title: "Reverse a String",
    description: "Write a function that reverses a given string.",
    difficulty: "Medium",
    solutions: ["function reverseString(str) { return str.split('').reverse().join(''); }"],
    testCases:  [
  { input: ["hello"], expected: "olleh" },    
  { input: ["world"], expected: "dlrow" },    
  { input: ["racecar"], expected: "racecar" },
  { input: ["12345"], expected: "54321" },  
  { input: [""], expected: "" },            
  { input: ["a"], expected: "a" },        
  { input: ["!@#$$#@!"], expected: "!@#$$#@!" }
     ],
    rewards: { xp: 20, coins: 10 },
  },
  {
    title: "Find Factorial",
    description: "Write a function to find the factorial of a number.",
    difficulty: "Medium",
    solutions: ["function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }"],
    testCases: [
  { input: [0], expected: 1 },   
  { input: [1], expected: 1 }, 
  { input: [5], expected: 120 }, 
  { input: [7], expected: 5040 },
  { input: [10], expected: 3628800 }
],
    rewards: { xp: 20, coins: 10 },
  },
  {
    title: "Check for Palindrome",
    description: "Write a function to check if a string is a palindrome.",
    difficulty: "Hard",
    solutions: ["function isPalindrome(str) { return str === str.split('').reverse().join(''); }"],
    testCases: [
  { input: ["racecar"], expected: true }, 
  { input: ["madam"], expected: true },
  { input: ["hello"], expected: false },
  { input: ["12321"], expected: true },   
  { input: ["123456"], expected: false }, 
  { input: [""], expected: true },
  { input: ["A man a plan a canal Panama"], expected: false },
  { input: ["No lemon, no melon"], expected: false }
],
    rewards: { xp: 50, coins: 20 },
  },
  {
    title: "Find Prime Numbers in a Range",
    description: "Write a function that returns all prime numbers in a given range.",
    difficulty: "Hard",
    solutions: [
      "function findPrimes(start, end) {\n  let primes = [];\n  for (let i = start; i <= end; i++) {\n    if (isPrime(i)) primes.push(i);\n  }\n  return primes;\n}\nfunction isPrime(n) {\n  if (n < 2) return false;\n  for (let i = 2; i <= Math.sqrt(n); i++) {\n    if (n % i === 0) return false;\n  }\n  return true;\n}",
    ],
    testCases: [
  { input: [1, 10], expected: [2, 3, 5, 7] },  
  { input: [10, 20], expected: [11, 13, 17, 19] }, 
  { input: [0, 1], expected: [] },
  { input: [20, 30], expected: [23, 29] }, 
  { input: [50, 60], expected: [53, 59] },
  { input: [2, 2], expected: [2] },
  { input: [14, 16], expected: [] }], 
    rewards: { xp: 50, coins: 20 },
  },
  {
    title: "Fibonacci Sequence",
    description: "Write a function to generate the first N Fibonacci numbers.",
    difficulty: "Hard",
    solutions: ["function fibonacci(n) { let fib = [0, 1]; for (let i = 2; i < n; i++) { fib.push(fib[i - 1] + fib[i - 2]); } return fib; }"],
    testCases: [
  { input: [1], expected: [0] },          
  { input: [2], expected: [0, 1] },
  { input: [5], expected: [0, 1, 1, 2, 3] },
  { input: [7], expected: [0, 1, 1, 2, 3, 5, 8] }, 
  { input: [10], expected: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34] },
  { input: [0], expected: [] },
],
    rewards: { xp: 50, coins: 20 },
  },
];

async function seedChallenges() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Challenge.deleteMany({});
    await Challenge.insertMany(challenges);
    console.log("Challenges seeded successfully!");
  } catch (error) {
    console.error("Error seeding challenges:", error);
  } finally {
    mongoose.connection.close();
  }
}

seedChallenges();
