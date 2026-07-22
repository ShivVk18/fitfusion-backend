export const logger = {
  info: (message, meta = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, Object.keys(meta).length ? JSON.stringify(meta) : '');
  },
  error: (message, error = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error.stack || error);
  },
  ai: (type, prompt, meta = {}) => {
    // console log disabled
  },
  http: (req, res, responseTimeMs) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} - ${responseTimeMs}ms`);
  }
};

export default logger;
