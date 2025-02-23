const Problem = require('../../models/Problem');
const User = require('../../models/User');
const fetch = require('node-fetch');
const Submission = require('../../models/Submission');

module.exports = {
    compileCode: async (req, res) => {
        const { userID, problemID, code, language } = req.body;
        try {
            const problem = await Problem.findById(problemID);
            if (!problem) {
                return res.status(404).json({ message: 'Problem not found' });
            }
            const testCases = problem.testcases;

            const results = await Promise.all(
                testCases.map(async (testCase) => {
                    try {
                        const response = await fetch('http://localhost:8080/', {
                            method: 'POST',
                            body: JSON.stringify({ input: testCase.input, code, language }),
                            headers: { 'Content-Type': 'application/json' }
                        });
                        const data = await response.json();
                        const actualOutput = data.output.trim();
                        const expectedOutput = testCase.output.trim();

                        return {
                            input: testCase.input,
                            expectedOutput,
                            actualOutput,
                            passed: actualOutput === expectedOutput,
                        };
                    } catch (error) {
                        console.error("Error executing test case:", error);
                        return {
                            input: testCase.input,
                            expectedOutput: testCase.output.trim(),
                            actualOutput: "Error during execution",
                            passed: false,
                        };
                    }
                })
            );

            const allPassed = results.every(result => result.passed);

            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (allPassed) {
                user.solved_problems.push(problemID);
                user.score += 2;
                await user.save();
            }

            // Save submission
            const newSubmission = new Submission({
                user: userID,
                problem: problemID,
                time: Date.now(),
                code,
                accepted: allPassed,
                failedTestcase: allPassed ? null : results.findIndex(result => !result.passed),
            });
            await newSubmission.save();

            res.json({ results, allPassed });
        } catch (err) {
            res.status(500).json({ message: 'Error compiling code', error: err.message });
        }
    }
};