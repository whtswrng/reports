const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const processRepo = require('./pr').processRepo;

const accessToken = process.argv[2];
const periodStart = process.argv[3]; // YYYY-MM-DD
const orgName = process.argv[4];

if (!accessToken || !periodStart || !orgName)
  throw new Error('Missing or invalid params, read README.MD');

let result = [];

async function main() {
  const response = await axios.get(
    `https://api.github.com/orgs/${orgName}/repos`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: {
        sort: 'pushed',
        per_page: 100
      },
    }
  );
  const repos = response.data.map((r) => orgName + '/' + r.name);

  for (const repo of repos) {
    const data = await processRepo(periodStart, repo, accessToken);
    result = [...result, ...data];
  }

  // Define the CSV header and keys
  const csvHeader = [
    { id: 'link', title: 'Link' },
    { id: 'title', title: 'Title' },
  ];
  const csvWriter = createCsvWriter({
    path: orgName+'.csv', // Replace with your desired output file name
    header: csvHeader,
  });

  csvWriter
    .writeRecords(result)
    .then(() => {
      console.log(`CSV file written successfully into "${orgName}.csv" file`);
    })
    .catch((error) => {
      console.error('Error writing CSV file:', error.message);
    });
}

main();
