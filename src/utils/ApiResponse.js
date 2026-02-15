/**
 * Standardized API Response Utility
 * Ensures consistent response structure across all endpoints
 */
class ApiResponse {
  /**
   * Success Response
   * @param {Object} res - Express response object
   * @param {Number} code - HTTP status code
   * @param {String} message - Success message
   * @param {Any} data - Response data
   */
  static success(res, code = 200, message = 'Success', data = null) {
    return res.status(code).json({
      success: true,
      code,
      message,
      data,
    });
  }

  /**
   * Error Response
   * @param {Object} res - Express response object
   * @param {Number} code - HTTP status code
   * @param {String} message - Error message
   * @param {Any} errors - Error details
   */
  static error(res, code = 500, message = 'Internal Server Error', errors = null) {
    return res.status(code).json({
      success: false,
      code,
      message,
      ...(errors && { errors }),
    });
  }

  /**
   * Paginated Response
   * @param {Object} res - Express response object
   * @param {Number} code - HTTP status code
   * @param {String} message - Success message
   * @param {Array} data - Response data
   * @param {Object} pagination - Pagination metadata
   */
  static paginated(res, code = 200, message = 'Success', data = [], pagination = {}) {
    return res.status(code).json({
      success: true,
      code,
      message,
      data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 10,
        total: pagination.total || 0,
        totalPages: Math.ceil((pagination.total || 0) / (pagination.limit || 10)),
      },
    });
  }
}

module.exports = ApiResponse;
