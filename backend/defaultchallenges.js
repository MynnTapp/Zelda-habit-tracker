require("dotenv").config();
const mongoose = require("mongoose");
const Challenge = require("./models/Challenge");

console.log(Challenge);


async function seedChallenges() {
  await mongoose.connect(process.env.MONGO_URI);
  const challenges = [
    // 🟢 EASY CHALLENGES
    {
      title: "Sum of Two Numbers",
      description: "Write a function that returns the sum of two numbers.",
      difficulty: "Easy",
      codesnippet: "function sum(a, b) { return a + b; }",
      solutions: ["function sum(a, b) { return a + b; }"],
      rewards: { rupees: 10, xp: 5 },
    },
    {
      title: "Check Even or Odd",
      description: "Write a function that checks if a number is even or odd.",
      difficulty: "Easy",
      codesnippet: "function isEven(n) { return n % 2 === 0; }",
      solutions: ["function isEven(n) { return n % 2 === 0; }"],
      rewards: { rupees: 10, xp: 5 },
    },
    {
      title: "Convert Celsius to Fahrenheit",
      description: "Write a function to convert Celsius to Fahrenheit.",
      difficulty: "Easy",
      codesnippet: "function celsiusToFahrenheit(c) { return (c * 9/5) + 32; }",
      solutions: ["function celsiusToFahrenheit(c) { return (c * 9/5) + 32; }"],
      rewards: { rupees: 10, xp: 5 },
    },

    // 🟡 MEDIUM CHALLENGES
    {
      title: "Find the Largest Number",
      description: "Write a function that returns the largest number in an array.",
      difficulty: "Medium",
      codesnippet: "function maxNumber(arr) { return Math.max(...arr); }",
      solutions: ["function maxNumber(arr) { return Math.max(...arr); }"],
      rewards: { rupees: 20, xp: 10 },
    },
    {
      title: "Reverse a String",
      description: "Write a function that reverses a given string.",
      difficulty: "Medium",
      codesnippet: 'function reverseString(str) { return str.split("").reverse().join(""); }',
      solutions: ['function reverseString(str) { return str.split("").reverse().join(""); }'],
      rewards: { rupees: 20, xp: 10 },
    },
    {
      title: "Find Factorial",
      description: "Write a function to find the factorial of a number.",
      difficulty: "Medium",
      codesnippet: "function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }",
      solutions: ["function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }"],
      rewards: { rupees: 20, xp: 10 },
    },

    // 🔴 HARD CHALLENGES
    {
      title: "Check for Palindrome",
      description: "Write a function to check if a string is a palindrome.",
      difficulty: "Hard",
      codesnippet: 'function isPalindrome(str) { return str === str.split("").reverse().join(""); }',
      solutions: ['function isPalindrome(str) { return str === str.split("").reverse().join(""); }'],
      rewards: { rupees: 50, xp: 20 },
    },
    {
      title: "Find Prime Numbers in a Range",
      description: "Write a function that returns all prime numbers in a given range.",
      difficulty: "Hard",
      codesnippet: `
function findPrimes(start, end) {
  let primes = [];
  for (let i = start; i <= end; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}`,
      solutions: [
        `
function findPrimes(start, end) {
  let primes = [];
  for (let i = start; i <= end; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}`,
      ],
      rewards: { rupees: 50, xp: 20 },
    },
    {
      title: "Fibonacci Sequence",
      description: "Write a function to generate the first N Fibonacci numbers.",
      difficulty: "Hard",
      codesnippet: `
function fibonacci(n) {
  let fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
}`,
      solutions: [
        `
function fibonacci(n) {
  let fib = [0, 1];
  for (let i = 2; i < n; i++) {
    fib.push(fib[i - 1] + fib[i - 2]);
  }
  return fib;
}`,
      ],
      rewards: { rupees: 50, xp: 20 },
    },
  ];
  try {
    await Challenge.deleteMany({}); // Clear existing challenges
    await Challenge.insertMany(challenges);
    console.log("Challenges seeded successfully!");
  } catch (error) {
    console.error("Error seeding challenges:", error);
  } finally {
    mongoose.connection.close();
  }
}

// Connect to MongoDB and seed the database
seedChallenges();
