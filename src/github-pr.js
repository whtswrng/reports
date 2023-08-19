const axios = require('axios');
const moment = require('moment');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const processRepo = require('./pr').processRepo;

const accessToken = process.argv[2];
const rawRepositories = process.argv[4];
const repositores = rawRepositories.split(', ');
const periodStart = process.argv[3]; // YYYY-MM-DD

if (!accessToken || !rawRepositories || !periodStart)
  throw new Error('Missing or invalid params, read README.MD');

let result = [];

async function main() {
  for (const repo of repositores) {
    const data = await processRepo(periodStart, repo, accessToken);
    result = [...result, ...data];
  }

  // Define the CSV header and keys
  const csvHeader = [
    { id: 'link', title: 'Link' },
    { id: 'title', title: 'Title' },
  ];
  const csvWriter = createCsvWriter({
    path: 'output.csv', // Replace with your desired output file name
    header: csvHeader,
  });

  csvWriter
    .writeRecords(result)
    .then(() => {
      console.log('CSV file written successfully into "output.csv" file');
    })
    .catch((error) => {
      console.error('Error writing CSV file:', error.message);
    });
}

main();

