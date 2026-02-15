const authService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * Register a new user
 * @route POST /api/v1/auth/register
 * @access Public
 */
exports.register = catchAsync(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const { user, token } = await authService.register({
    email,
    password,
    firstName,
    lastName,
  });

  ApiResponse.success(res, 201, 'User registered successfully', { user, token });
});

/**
 * Login user
 * @route POST /api/v1/auth/login
 * @access Public
 */
exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login(email, password);

  ApiResponse.success(res, 200, 'Login successful', { user, token });
});

/**
 * Get current user
 * @route GET /api/v1/auth/me
 * @access Protected
 */
exports.getCurrentUser = catchAsync(async (req, res) => {
  const user = await authService.getUserById(req.user.id);

  ApiResponse.success(res, 200, 'User retrieved successfully', { user });
});

/**
 * Logout user
 * @route POST /api/v1/auth/logout
 * @access Protected
 */
exports.logout = catchAsync(async (req, res) => {
  // In JWT, logout is typically handled on the client by removing the token
  // You can implement token blacklisting here if needed

  ApiResponse.success(res, 200, 'Logout successful', null);
});
