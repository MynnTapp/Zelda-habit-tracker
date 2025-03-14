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
      //solution: "public static int Sum(int a, int b) => a + b;",
      codesnippet: "",
      solutions: ["public static int Sum(int a, int b) => a + b;"],
      rewards: { xp: 10, coins: 5 },
    },
    {
      title: "Check Even or Odd",
      description: "Write a function that checks if a number is even or odd.",
      difficulty: "Easy",
      codesnippet: "",
      solutions: ["public static bool IsEven(int n) => n % 2 == 0;"],
      rewards: { xp: 10, coins: 5 },
    },
    {
      title: "Convert Celsius to Fahrenheit",
      description: "Write a function to convert Celsius to Fahrenheit.",
      difficulty: "Easy",
      //solution: "public static double CelsiusToFahrenheit(double c) => (c * 9 / 5) + 32;",
      codesnippet: "",
      solutions: ["public static double CelsiusToFahrenheit(double c) => (c * 9 / 5) + 32;"],
      rewards: { xp: 10, coins: 5 },
    },

    // 🟡 MEDIUM CHALLENGES
    {
      title: "Find the Largest Number",
      description: "Write a function that returns the largest number in an array.",
      difficulty: "Medium",
      codesnippet: "",
      //solution: "public static int MaxNumber(int[] arr) => arr.Max();",
      solutions: ["public static int MaxNumber(int[] arr) => arr.Max();"],
      rewards: { xp: 20, coins: 10 },
    },
    {
      title: "Reverse a String",
      description: "Write a function that reverses a given string.",
      difficulty: "Medium",
      codesnippet: "",
      //solution: "public static string ReverseString(string str) => new string(str.Reverse().ToArray());",
      solutions: ["public static string ReverseString(string str) => new string(str.Reverse().ToArray());"],
      rewards: { xp: 20, coins: 10 },
    },
    {
      title: "Find Factorial",
      description: "Write a function to find the factorial of a number.",
      difficulty: "Medium",
      codesnippet: "",
      //solution: "public static int Factorial(int n) => n <= 1 ? 1 : n * Factorial(n - 1);",
      solutions: ["public static int Factorial(int n) => n <= 1 ? 1 : n * Factorial(n - 1);"],
      rewards: { xp: 20, coins: 10 },
    },

    // 🔴 HARD CHALLENGES
    {
      title: "Check for Palindrome",
      description: "Write a function to check if a string is a palindrome.",
      difficulty: "Hard",
      //solution: "public static bool IsPalindrome(string str) => str == new string(str.Reverse().ToArray());",
      codesnippet: "",
      solutions: ["public static bool IsPalindrome(string str) => str == new string(str.Reverse().ToArray());"],
      rewards: { xp: 50, coins: 20 },
    },
    {
      title: "Find Prime Numbers in a Range",
      description: "Write a function that returns all prime numbers in a given range.",
      difficulty: "Hard",
      /*solution:
        "public static List<int> FindPrimes(int start, int end) { List<int> primes = new List<int>(); for (int i = start; i <= end; i++) { if (IsPrime(i)) primes.Add(i); } return primes; } private static bool IsPrime(int n) { if (n < 2) return false; for (int i = 2; i <= Math.Sqrt(n); i++) { if (n % i == 0) return false; } return true; }",
        */
      codesnippet: "",
      solutions: [
        "public static List<int> FindPrimes(int start, int end) { List<int> primes = new List<int>(); for (int i = start; i <= end; i++) { if (IsPrime(i)) primes.Add(i); } return primes; } private static bool IsPrime(int n) { if (n < 2) return false; for (int i = 2; i <= Math.Sqrt(n); i++) { if (n % i == 0) return false; } return true; }",
      ],
      rewards: { xp: 50, coins: 20 },
    },
    {
      title: "Fibonacci Sequence",
      description: "Write a function to generate the first N Fibonacci numbers.",
      difficulty: "Hard",
      //solution: "public static List<int> Fibonacci(int n) { List<int> fib = new List<int> { 0, 1 }; for (int i = 2; i < n; i++) { fib.Add(fib[i - 1] + fib[i - 2]); } return fib; }",
      codesnippet: "",
      solutions: ["public static List<int> Fibonacci(int n) { List<int> fib = new List<int> { 0, 1 }; for (int i = 2; i < n; i++) { fib.Add(fib[i - 1] + fib[i - 2]); } return fib; }"],
      rewards: { xp: 50, coins: 20 },
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
