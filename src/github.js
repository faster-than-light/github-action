/** Constants */
const core = require('@actions/core')
const github = require('@actions/github')
const bugcatcher = require('./bugcatcher')
const {
  // getRepoInfo,
  passesSeverity,
  statusSetupPending,
  // statusSetupFailure,
  // statusSetupFailureRepoMismatch,
  // statusUploadingSetup,
  statusUploadingPending,
  statusUploadingFailure,
  // statusTestingSetup,
  statusTestingPending,
  statusTestingFailure,
  // statusResultsSetup,
  statusResultsPending,
  statusResultsFailure,
  statusResultsSuccess,
  resultsUri,
} = require('./helpers')


module.exports = {

  push: async () => {
    let context = github.context
    context.token = core.getInput('BUGCATCHER_TOKEN', { required: true })

    context.severityThreshold = core.getInput('SEVERITY_THRESHOLD') || 'medium'
    const token = core.getInput('GITHUB_TOKEN', { required: true })
    context.github = new github.GitHub(token)

    const getTree = await bugcatcher.getTree(context)
    const { tree } = getTree['data']
    if (!tree) throw new Error('Failed to retrieve repo tree.')
    
    /** Upload repo from tree sha */
    statusSetupPending(context)
    statusUploadingPending(context)
    const uploaded = await bugcatcher.uploadFromTree(context, tree)
      .catch(() => null)
    if (!uploaded) {
      statusUploadingFailure(context)
      throw new Error('Failed to synchronize repo contents.')
    }

    /** Initiate a test */
    statusTestingPending(context)
    const testId = await bugcatcher.runTests(context)
      .catch(() => null)
    if (!testId) {
      statusTestingFailure(context)
      throw new Error('Failed to initialize tests.')
    }
    context.testId = testId
    const test = await bugcatcher.initCheckTestStatus(context)
    if (!test) {
      statusTestingFailure(context)
      throw new Error('Failed to complete tests.')
    }

    /** Fetch the results */
    statusResultsPending(context)
    const { results } = await bugcatcher.fetchResults(context)
      .catch(() => null)
    if (results && results.test_run_result) {
      let resultsMatrix = {
        low: 0,
        medium: 0,
        high: 0,
      }

      let failed
      results.test_run_result.forEach(hit => {
        const test_suite_test = hit['test_suite_test']
        const ftl_severity = test_suite_test['ftl_severity']
        resultsMatrix[ftl_severity]++
        if (!passesSeverity(ftl_severity, context.severityThreshold))
          failed = true
      })
      
      if (failed) {
        console.log(`Test Results : FAILED \"${context.severityThreshold}\" severity threshold`)
        console.log(`${resultsMatrix.high} high, ${resultsMatrix.medium} medium, ${resultsMatrix.low} low severity`)
        console.log(`see: ${resultsUri.replace(':stlid', context.testId)}`)
        context.resultsMatrix = resultsMatrix
        statusResultsFailure(context)
        return
      }

      console.log(`Test Results : PASSED \"${context.severityThreshold}\" severity threshold`)
      statusResultsSuccess(context)
    }
    else {
      statusResultsFailure(context)
      throw new Error('Failed to retrieve tests.')
    }
  
  },

}

