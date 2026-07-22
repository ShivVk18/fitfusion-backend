import { ApiError } from '../utils/ApiError.js';

export const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body || {},
      params: req.params || {},
      query: req.query || {},
    });

    if (validated.body) req.body = validated.body;
    if (validated.params) req.params = validated.params;
    if (validated.query) req.query = validated.query;

    next();
  } catch (error) {
    if (error.errors) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      const errorMsg = formattedErrors.map((e) => `${e.field}: ${e.message}`).join(', ');
      return next(new ApiError(400, errorMsg || 'Validation Error', formattedErrors));
    }
    return next(new ApiError(400, error.message || 'Invalid Request Data'));
  }
};

export default validate;
