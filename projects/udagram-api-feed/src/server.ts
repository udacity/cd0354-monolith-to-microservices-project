import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';
import {IndexRouter} from './controllers/v0/index.router';
import {config} from './config/config';
import {V0_FEED_MODELS} from './controllers/v0/model.index';

(async () => {
  const SERVICE_NAME = "Feed microservice";
  await sequelize.addModels(V0_FEED_MODELS);

  console.debug(`Initialize database connection for ${SERVICE_NAME}...`);
  // await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8082;

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
  app.get( '/', async (req, res) => {
    res.send( '/api/v0/' );
  } );

  app.listen( port, () => {
    console.log( `server running ${config.url}` );
    console.log( `press CTRL+C to stop server` );
  } );
})();
