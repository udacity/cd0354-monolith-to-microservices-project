import {Router, Request, Response} from 'express';

import {User} from '../models/User';
import {AuthRouter} from './auth.router';
import os from 'os'; 

const router: Router = Router();

router.use('/auth', AuthRouter);

router.get('/whoami', async (req: Request, res: Response) => {
  res.send(`Handled by backend-user: ${os.hostname()}`);
});

router.get('/:id', async (req: Request, res: Response) => {
  const {id} = req.params;
  const item = await User.findByPk(id);
  res.send(item);
});

export const UserRouter: Router = router;
