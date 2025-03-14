export default () => ({
  database: {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  },
  mail: {
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
  },
});
