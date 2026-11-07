import { Router } from 'express';
import * as controller from './user.controller.js';

const router = Router();

router.post('/signup', controller.signup);
router.post('/login', controller.login);
router.patch('/:id', controller.updateUser);
router.delete('/', controller.deleteUser);
router.get('/', controller.getUser);

export default router;
