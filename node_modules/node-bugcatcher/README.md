# Faster Than Light BugCatcher Client API Library

[![npm version](https://badge.fury.io/js/node-bugcatcher.svg)](https://badge.fury.io/js/node-bugcatcher) ![WIP Badge](https://img.shields.io/badge/status-beta-blue.svg)

## Installation &amp; Common Usage
1 - Install package

```
npm install node-bugcatcher
```

2 - Configure module to work with desired environment

```
import BugCatcher from 'node-bugcatcher'
const api = BugCatcher(
  'https://api.bugcatcher.fasterthanlight.dev', // api uri
  '<stl_sid>' // authentication token (optional, can be set after init)
)
```

3 - Consume API endpoints through the initiated NPM package

```
const projectList = api.getProject()
// -> ["solidity_project"]

const projectName = projectList[0] || 'new project'
// -> 'solidity_project'

const { stlId } = await api.putCode({
  name: 'solidity_project/contracts/token.sol',
  code: 'data:application/octet-stream;base64,U1RMIFJvY2tzIQ==',
  project: projectName
})
// -> stlId = 'psHXGXnOMfwV4wngfBMURXOExWigv7eGNzlzLsiK'

const runTests = await api.postTestProject({ projectName })
const { stlid: testId } = runTests.data
// -> testId = 'Gx0NtFOGBlHVEOmiUvyUs3KNwhkXKDe8ERAYQly3'
```
