import {Router, Request, Response} from 'express';
import {NextFunction} from 'connect';
import * as jwt from 'jsonwebtoken';
import * as AWS from '../../aws';
import * as c from '../../config/config';
import { FeedItem } from './model.index';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.send(`V0`);
});

const feedRouter: Router = Router();

feedRouter.get('/', async (req: Request, res: Response) => {
  const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
  items.rows.map((item) => {
    if (item.url) {
      item.url = AWS.getGetSignedUrl(item.url);
    }
  });
  res.send(items);
});

// Get a feed resource
feedRouter.get('/:id',
    async (req: Request, res: Response) => {
      const {id} = req.params;
      const item = await FeedItem.findByPk(id);
      res.send(item);
    });

// Get a signed url to put a new item in the bucket
feedRouter.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
      const {fileName} = req.params;
      const url = AWS.getPutSignedUrl(fileName);
      res.status(201).send({url: url});
    });

// Create feed with metadata
feedRouter.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
      const caption = req.body.caption;
      const fileName = req.body.url; // same as S3 key name

      if (!caption) {
        return res.status(400).send({message: 'Caption is required or malformed.'});
      }

      if (!fileName) {
        return res.status(400).send({message: 'File url is required.'});
      }

      const item = await new FeedItem({
        caption: caption,
        url: fileName,
      });

      const savedItem = await item.save();

      savedItem.url = AWS.getGetSignedUrl(savedItem.url);
      res.status(201).send(savedItem);
    });

router.use('/feed', feedRouter);

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).send({message: 'No authorization headers.'});
  }

  const tokenBearer = req.headers.authorization.split(' ');
  if (tokenBearer.length != 2) {
    return res.status(401).send({message: 'Malformed token.'});
  }

  const token = tokenBearer[1];
  return jwt.verify(token, c.config.jwt.secret, (err, decoded) => {
    if (err) {
      return res.status(500).send({auth: false, message: 'Failed to authenticate.'});
    }
    return next();
  });
}

export const IndexRouter: Router = router;
