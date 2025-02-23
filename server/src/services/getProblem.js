const axios = require("axios");
const cheerio = require("cheerio");

async function fetchProblemStatement(url) {
    try {
        const { data } = await axios.get(url);
        
        const $ = cheerio.load(data);

        console.log(data)
        
        const problemStatement = $(".problem-statement").html();

        console.log(problemStatement);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

fetchProblemStatement("https://codeforces.com/contest/2069/problem/A");
