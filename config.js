module.exports = {

  // bugcatcherUri is optional. The NPM package will default to production
  // bugcatcherUri: "https://api.bugcatcher.fasterthanlight.dev/",
  resultsUri: "https://bugcatcher.fasterthanlight.dev/results/:stlid",
  
  labels: {
    setup: {
      context: "BugCatcher / Static Analysis",
      description: {
        setup: "Set up FTL static analysis tests",
        pending: "Setting up FTL static analysis...",
        error: "ERROR Setting up FTL static analysis",
        failure: "FAILED to setup FTL static analysis",
        success: "COMPLETED Setting up FTL static analysis",
      }
    },
    uploading: {
      context: "BugCatcher / Static Analysis",
      description: {
        setup: "Synchronize repository with BugCatcher",
        pending: "Synchronizing repository with BugCatcher...",
        error: "ERROR Synchronizing repository with BugCatcher",
        failure: "FAILED Synchronizing repository with BugCatcher",
        success: "COMPLETED Synchronization of repository",
      }
    },
    testing: {
      context: "BugCatcher / Static Analysis",
      description: {
        setup: "Perform Static Analysis testing",
        pending: "Performing Static Analysis testing...",
        pendingWithPercent: "Static Analysis testing (%percent_complete%% complete)...",
        error: "ERROR Performing Static Analysis testing",
        failure: "FAILURE Performing Static Analysis testing",
        success: "COMPLETED Static Analysis testing",
      }
    },
    results: {
      context: "BugCatcher / Static Analysis",
      description: {
        setup: "Fetch test results",
        pending: "Fetching test results...",
        error: "ERROR Getting test results",
        failure: "Found possible issues (%hits%)",
        success: "PASSED all tests with \"%severity%\" severity threshold",
      }
    },
  },

  statusSteps: {
    setup: 'setup',
    uploading: 'uploading',
    testing: 'testing',
    results: 'results',
  },

  statusStates: {
    error: 'error',
    failure: 'failure',
    pending: 'pending',
    pendingWithPercent: 'pendingWithPercent',
    setup: 'setup',
    success: 'success',
  }
  
}