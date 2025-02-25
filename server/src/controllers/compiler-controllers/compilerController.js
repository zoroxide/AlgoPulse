const Problem = require('../../models/Problem');
const User = require('../../models/User');
const fetch = require('node-fetch');
const Submission = require('../../models/Submission');

module.exports = {
    compileSheetCode: async (req, res) => {
        const { userID, problemID, code, language } = req.body;
        try {
            // Check if problem exists
            const problem = await Problem.findById(problemID);
            if (!problem) {
                return res.status(404).json({ message: 'Problem not found' });
            }

            // Check if user exists
            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            // Get test cases
            const testCases = problem.testcases;

            // Execute test cases
            const results = await Promise.all(
                testCases.map(async (testCase) => {
                    try {
                        const response = await fetch('http://localhost:8080/', {
                            method: 'POST',
                            body: JSON.stringify({ input: testCase.input, code, language }),
                            headers: { 'Content-Type': 'application/json' }
                        });
                        const data = await response.json();

                        // Check if response contains output
                        if (!data.output) {
                            console.error("Compiler service response does not contain 'output':", data.error);
                            return {
                                input: testCase.input,
                                expectedOutput: testCase.output ? testCase.output.trim() + '\n' : "No expected output",
                                actualOutput: `Error during execution: ${data.error}`,
                                passed: false,
                                status: "Error",
                            };
                        }

                        // Storing these data to Compare actual output with expected output in present
                        const actualOutput = data.output.trim() + '\n';
                        const expectedOutput = testCase.output ? testCase.output.trim() + '\n' : "No expected output";
                        console.log(actualOutput, expectedOutput);

                        return {
                            input: testCase.input,
                            expectedOutput,
                            actualOutput,
                            passed: (actualOutput === expectedOutput),
                            status: (actualOutput === expectedOutput) ? "Accepted" : "Wrong Answer",
                        };
                    } catch (error) {
                        console.error("Error executing test case:", error);
                        return {
                            input: testCase.input,
                            expectedOutput: testCase.output ? testCase.output.trim() + '\n' : "No expected output",
                            actualOutput: "Error during execution, Please Contact any Admin",
                            err: error.message,
                            passed: false,
                            status: "Error",
                        };
                    }
                })
            );

            // Check if all test cases passed
            const allPassed = results.every(result => result.passed);

            // Update user score and solved problems
            if (allPassed) {
                user.solved_problems.push(problemID);
                if (problem.difficulty === "easy") user.score += 1;
                else if (problem.difficulty === "medium") user.score += 2;
                else if (problem.difficulty === "hard") user.score += 3;
                await user.save();
            }

            // Save submission
            const newSubmission = new Submission({
                user: userID,
                problem: problemID,
                time: Date.now(),
                code,
                status: allPassed ? "Accepted" : "Wrong Answer",
                failedTestcase: allPassed ? null : results.findIndex(result => !result.passed),
            });
            await newSubmission.save();

            res.json({ results, allPassed });
        } catch (err) {
            res.status(500).json({ message: 'Error compiling code', error: err.message });
        }
    },

    compileContestCode: async (req, res) => {
        const { userID, problemID, code, language } = req.body;
        try {
            // Check if problem exists
            const problem = await Problem.findById(problemID);
            if (!problem) {
                return res.status(404).json({ message: 'Problem not found' });
            }

            // Check if user exists
            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            // Get test cases
            const testCases = problem.testcases;

            // Execute test cases
            const results = await Promise.all(
                testCases.map(async (testCase) => {
                    try {
                        const response = await fetch('http://localhost:8080/', {
                            method: 'POST',
                            body: JSON.stringify({ input: testCase.input, code, language }),
                            headers: { 'Content-Type': 'application/json' }
                        });
                        const data = await response.json();

                        // Check if response contains output
                        if (!data.output) {
                            console.error("Compiler service response does not contain 'output':", data.error);
                            return {
                                input: testCase.input,
                                expectedOutput: testCase.output ? testCase.output.trim() + '\n' : "No expected output",
                                actualOutput: `Error during execution: ${data.error}`,
                                passed: false,
                                status: "Error",
                            };
                        }

                        // Storing these data to Compare actual output with expected output in present
                        const actualOutput = data.output.trim() + '\n';
                        const expectedOutput = testCase.output ? testCase.output.trim() + '\n' : "No expected output";
                        console.log(actualOutput, expectedOutput);

                        return {
                            input: testCase.input,
                            expectedOutput,
                            actualOutput,
                            passed: (actualOutput === expectedOutput),
                            status: (actualOutput === expectedOutput) ? "Accepted" : "Wrong Answer",
                        };
                    } catch (error) {
                        console.error("Error executing test case:", error);
                        return {
                            input: testCase.input,
                            expectedOutput: testCase.output ? testCase.output.trim() + '\n' : "No expected output",
                            actualOutput: "Error during execution, Please Contact any Admin",
                            err: error.message,
                            passed: false,
                            status: "Error",
                        };
                    }
                })
            );

            // Check if all test cases passed
            const allPassed = results.every(result => result.passed);
            const overallStatus = allPassed ? "Accepted" : results.some(result => result.status === "Error") ? "Error" : "Wrong Answer";

            // Update user score and solved problems
            if (allPassed) {
                user.solved_problems.push(problemID);
                if (problem.difficulty === "easy") user.score += 1;
                else if (problem.difficulty === "medium") user.score += 2;
                else if (problem.difficulty === "hard") user.score += 3;
                await user.save();
            }

            // Save submission
            const newSubmission = new Submission({
                user: userID,
                problem: problemID,
                time: Date.now(),
                code,
                status: overallStatus,
                failedTestcase: allPassed ? null : results.findIndex(result => !result.passed),
            });
            await newSubmission.save();

            res.json({ status: overallStatus });
        } catch (err) {
            res.status(500).json({ message: 'Error compiling code', error: err.message });
        }
    }
};