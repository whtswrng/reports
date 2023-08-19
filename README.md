## Installation
Need NodeJs >= 10 + github personal access token
```
npm i
```
## Use cases
### Fetch all merged pull requests for organisation
node src/github-org.js "personal token" "YYYY-MM-DD" "orgName"
### Fetch all merged pull requests for given repositories
node src/github-pr.js "personal token" "YYYY-MM-DD" "organisation/repository, organisation/repo-2"