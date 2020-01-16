const core = require('@actions/core')
const ftlGithub = require('./src/github')

const returnError = error => {
  console.error(error)
  core.setFailed(error.message)
}

try {
  ftlGithub.push().then(results => {
    core.setOutput("results", results)
  })
  .catch(returnError)
} catch (error) { returnError(error) }
