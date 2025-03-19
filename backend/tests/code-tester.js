// const vm = require("vm");

// function testCodeSnippet(codeSnippet, testCases) {
//   try {
//     const sandbox = { sandbox: {} }; // Wrap sandbox inside an object

//     const functionNameRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/;
//     const match = codeSnippet.match(functionNameRegex);

//     if (!match || !match[1]) {
//       throw new Error("Invalid function definition. Please provide a valid function.");
//     }

//     const functionName = match[1]; // Extract function name
//     const wrappedCode = `
//       ${codeSnippet}
//       sandbox.${functionName} = ${functionName};
//     `;

//     vm.createContext(sandbox); // Create a sandboxed environment
//     vm.runInContext(wrappedCode, sandbox); // Run the user's code in the sandbox

//     const userFunction = sandbox.sandbox[functionName]; // Retrieve function

//     if (typeof userFunction !== "function") {
//       throw new Error(`Failed to retrieve function ${functionName} from sandbox.`);
//     }

//     for (const testCase of testCases) {
//       const { input, expected } = testCase;
//       const result = userFunction(...input);
//       if (result !== expected) {
//         return false;
//       }
//     }

//     return true;
//   } catch (error) {
//     console.error("Error testing code snippet:", error);
//     return false;
//   }
// }


// module.exports = testCodeSnippet;




const vm = require("vm");

function testCodeSnippet(codeSnippet, testCases) {
  try {
    const sandbox = { sandbox: {} };

    // Execute the user's code snippet in the sandbox
    vm.createContext(sandbox); // Create a sandboxed environment
    vm.runInContext(codeSnippet, sandbox); // Run the user's code in the sandbox

    // Extract the function name dynamically
    const functionNameRegex = /function\s+([a-zA-Z0-9_]+)\s*\(/;
    const match = codeSnippet.match(functionNameRegex);

    if (!match || !match[1]) {
      throw new Error("Invalid function definition. Please provide a valid function.");
    }

    const functionName = match[1]; // Extract the function name (e.g., "sum")

    // Retrieve the user's function from the sandbox
    const userFunction = sandbox[functionName];

    if (typeof userFunction !== "function") {
      throw new Error(`Failed to retrieve function ${functionName} from sandbox.`);
    }

    // Run the function against all test cases
    for (const testCase of testCases) {
      const { input, expected } = testCase;
      const result = userFunction(...input); // Call the user's function with test case inputs
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

module.exports = testCodeSnippet;