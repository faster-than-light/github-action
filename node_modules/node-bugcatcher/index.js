import axios from 'axios'

export default function(apiUri, stlSID) {

  apiUri = apiUri || "https://api.bugcatcher.fasterthanlight.dev/"

  if (!apiUri.endsWith('/')) apiUri += '/'

  function setSid(sid) {
    stlSID = sid
  }

  function getSid(options) {
    const { token } = options
    return get (apiUri + 'get_sid?id_token=' + token)
  }

  function getStlSid() {
    return stlSID
  }

  function getUserData(options) {
    const { sid } = options
    return get(apiUri + 'sid/' + sid)
  }

  /**
   * @title GET Project data
   * @dev Get file list and other data for a project
   * 
   * @param {string} project Name of project being queried
   */
  function getProject(project) {
    if (!project) return get(apiUri + 'project')
    else return get(apiUri + 'project/' + project)
  }

  /**
   * @title PUT/POST Code
   * @dev For uploading files to the backend with a project name
   * 
   * @param {object} options JSON object holding our input properties
   * @property {options.string} code Base64 encoded file data
   * @property {options.string} name Filename of posted code
   * @property {options.string} project Optional name for containing project (default used when empty)
   */
  function postCode(options) {
    const { name, code, project = 'project' } = options
    return post(apiUri + 'project/' + encodeURIComponent(project) + '/' + encodeURIComponent(name), {
      name,
      code,
    })
  }

  /**
   * @dev PUT & POST should both persist data to the backend
   */
  const putCode = postCode

  /**
   * @title GET Test Project
   * @dev Get the status of a test on a project or a file
   * 
   * @param {object} options JSON object holding our input properties
   * @property {options.string} stlid Identifier of the test
   */
  function getRunTests(options) {
    const { 
      stlid, // required
    } = options
    return get(apiUri + 'run_tests/' + stlid)
  }

  /**
   * @title POST Test Project
   * @dev Initiate a test on a project or a file
   * 
   * @param {object} options JSON object holding our input properties
   * @property {options.string} projectName Name of the project
   * @property {options.string} fileName Optional filename if running est on 1 file
   */
  function postTestProject(options) {
    const { 
      projectName, // required
      fileName // optional
    } = options
    let uri = apiUri + 'test_project/' + projectName
    if (fileName) uri += '/' + fileName
    return post(uri)
  }

  /**
   * @title GET Test Results
   * @dev Get results on a completed test
   * 
   * @param {object} _options JSON object holding our input properties
   * @property {_options.string} stlid Security Identifier of the completed test
   * @property {_options.object} options Optional JSON object holding request configuration properties
   *    @note `options` may include properties like `headers`, `responseType`, etc. which will be
   *        added to the request.
   * @property {options.object} headers Optional JSON object containing request headers
   * @property {options.string} responseType Optional XHR `responseType` desired {blob|json}
   * @property {options.string} format Optional specified response format desired {pdf|json}
   */
  function getTestResult(_options) {
    const { 
      stlid, // required
      format, // optional {pdf || json(default)} format
      options, // optional request options (headers, etc.)
    } = _options
    let uri = apiUri + 'test_result/' + stlid
    if (format) uri += '?format=' + format
    return get(uri, options || { responseType: 'stream' })
  }

  function submitPaymentMethodToken(options) {
    return post(apiUri + 'payment_method', options)
  }

  function subscribeToBugCatcher(options) {
    return post(apiUri + 'subscription', options)
  }

  function updateSubscriptionStatus(options) {
    const { stlid, data } = options
    return put(`${apiUri}subscription/stlid/${stlid}`, data)
  }

  function addLead(options) {
    return post(apiUri + 'bugcatcher_interest', options)
  }

  function deleteCode(pathToCode) {
    return del(apiUri + 'project/' + pathToCode)
  }

  function deleteProject(project) {
    return del(apiUri + 'project/' + project)
  }

  /**
   * @title PUT/POST Annotation
   * @dev For adding notes to the results of tests 
   * 
   * @uri `PUT` or `POST` to `/test_run_result/<test_run_result_id>`
   * @param {uri.param} testResultId Test ID to be used in the API URI
   * @param {object} options JSON object holding our input properties
   * @property {options.string} annotation The annotation to be saved for the `test_run_result_id`
   */
  function postAnnotation(options) {
    const { annotation, testResultId } = options
    return post(`${apiUri}test_run_result/${testResultId}`, { annotation })
  }

  /**
   * @dev PUT & POST should both persist data to the backend
   */
  const putAnnotation = postAnnotation


  /** @return Promises resolving to javascript objects */
  async function get(url, options) {
    let headers
    if (options && options.headers) headers = options.headers
    return axios.get(url, {
      ...options,
      headers: {
        'STL-SID': stlSID,
        ...headers
      }
    })
  }
  async function post(url, data) {
    return axios.post(url, data, {
      headers: {
        'STL-SID': stlSID,
        'Content-Type': 'application/json',
      }
    })
  }
  async function put(url, data) {
    return axios.put(url, data, {
      headers: {
        'STL-SID': stlSID,
        'Content-Type': 'application/json',
      }
    })
  }
  async function del(url) {
    return axios.delete(url, {
      headers: {
        'STL-SID': stlSID,
        'Content-Type': 'application/json',
      }
    })
  }

  // return exports
  return {
    addLead,
    deleteCode,
    deleteProject,
    getProject,
    getRunTests,
    getSid,
    getStlSid,
    getTestResult,
    getUserData,
    postAnnotation,
    postCode,
    postTestProject,
    putAnnotation,
    putCode,
    setSid,
    submitPaymentMethodToken,
    subscribeToBugCatcher,
    updateSubscriptionStatus,
    greeter: (name = 'User') => {
      return `Hey, ${name}!`;
    }
  }

}
