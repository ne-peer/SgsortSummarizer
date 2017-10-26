# sgsort-summarizer
Summarize "sgsort" multiple results.

## Usage
1. Install [Node.js](https://nodejs.org/ja/) your PC.
2. Run `npm install`.
3. Configure sgsort result url, name, and more in `urlList` of `script/01_sgsort-scraping.js`.
4. Run `node ./script/01_sgsort-scraping.js`.
5. Stop the script. Run the `Ctrl + C`.
6. Run `node ./script/02_generate-result-summary.js`.
7. Completed. Generated summalize HTML page is stored in `./result` directory.
