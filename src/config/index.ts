export const CORS_CONFIG = {
  origin: [
    // 'http://localhost:3000',
    // 'http://localhost:8080',
    'https://dev-today-fe.vercel.app',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
