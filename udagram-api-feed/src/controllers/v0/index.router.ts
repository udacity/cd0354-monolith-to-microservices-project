import {Router, Request, Response} from 'express';
import {FeedRouter} from './routes/feed.router';

const router: Router = Router();

router.use('/feed', FeedRouter);

router.get('/', async (req: Request, res: Response) => {
  res.send(`V0`);
});

export const IndexRouter: Router = router;
