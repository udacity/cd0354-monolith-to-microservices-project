import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';
import {IndexRouter} from './controllers/v0/index.router';
import {V0_USER_MODELS} from './controllers/v0/model.index';

(async () => {
  const SERVICE_NAME = 'User Microservice';
  const app = express();
  const PORT = process.env.PORT || 7000;

  await sequelize.addModels(V0_USER_MODELS);
  await sequelize.sync();

  try {
    await sequelize.authenticate();
    console.debug(`Initialize database connection for ${SERVICE_NAME}...`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  app.use(express.json());
  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    origin: '*',
  }));
  app.use('/api/v0/', IndexRouter);

  app.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
