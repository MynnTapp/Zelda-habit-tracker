// Function to test the user's code snippet dynamically
function testCodeSnippet(codeSnippet, testCases) {
  try {
    // Dynamically create a function from the code snippet
    const userFunction = new Function("...args", codeSnippet);

    // Run the function against all test cases
    for (const testCase of testCases) {
      const { input, expected } = testCase;
      const result = userFunction(...input);
      if (result !== expected) {
        return false; // Test failed
      }
    }

    return true; // All tests passed
  } catch (error) {
    console.error("Error testing code snippet:", error);
    return false;
  }
}
