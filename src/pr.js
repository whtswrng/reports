const moment = require('moment');
const axios = require('axios');

async function processRepo(periodStart, repo, token) {
  const apiUrl = `https://api.github.com/repos/${repo}/pulls`;
  const data = [];

  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        state: 'closed',
        sort: 'updated',
        direction: 'desc',
      },
    });

    const mergedPRs = response.data.filter((pr) => {
      const mergedAt = moment(pr.merged_at);
      const startDate = moment(periodStart);
      return mergedAt.isSameOrAfter(startDate);
    });

    mergedPRs.forEach((pr) => {
      data.push({ link: pr.html_url, title: pr.title });
    });
    console.log(
      `Repository ${repo} processed, merged prs: ${mergedPRs.length}`
    );
    return data;
  } catch (error) {
		throw error;
  }
}

module.exports = {
	processRepo
}