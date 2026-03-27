/**
 * Unified Response Formatgong ju
 */

/**
 * Succeededxiang ying
 * @param {Object} res Expressxiang ying dui xiang
 * @param {*} data xiang ying shu ju
 * @param {string} message xiang ying xiao xi
 * @returns {Object} Expressxiang ying
 */
function successResponse(res, data = null, message = 'cao zuoSucceeded') {
  return res.status(200).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
}

/**
 * Errorxiang ying
 * @param {Object} res Expressxiang ying dui xiang
 * @param {string} code Error Codes
 * @param {string} message Errorxiao xi
 * @param {string} details ErrorDetails
 * @param {number} status HTTPStatusma
 * @returns {Object} Expressxiang ying
 */
function errorResponse(res, code, message, details = null, status = 400) {
  // gen juError CodesSettingsHTTPStatusma
  const statusCode = getStatusCodeByErrorCode(code) || status;
  
  return res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      message,
      details
    },
    timestamp: new Date().toISOString()
  });
}

/**
 * gen juError Codeshuo quHTTPStatusma
 * @param {string} code Error Codes
 * @returns {number} HTTPStatusma
 */
function getStatusCodeByErrorCode(code) {
  const statusCodeMap = {
    'AUTH_001': 401,
    'AUTH_002': 401,
    'AUTH_003': 401,
    'AUTH_004': 403,
    'USER_001': 400,
    'USER_002': 404,
    'USER_003': 409,
    'PROD_001': 404,
    'PROD_002': 400,
    'CART_001': 400,
    'ORDER_001': 400,
    'ORDER_002': 404,
    'SYS_001': 500,
    'SYS_002': 503
  };
  
  return statusCodeMap[code];
}

/**
 * Paginationxiang ying
 * @param {Object} res Expressxiang ying dui xiang
 * @param {Array} items shu juList
 * @param {Object} pagination PaginationInfo
 * @param {string} message xiang ying xiao xi
 * @returns {Object} Expressxiang ying
 */
function paginatedResponse(res, items, pagination, message = 'huo qu shu juSucceeded') {
  return res.status(200).json({
    success: true,
    message,
    data: {
      items,
      pagination
    },
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse,
  getStatusCodeByErrorCode
};