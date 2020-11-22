import { Router } from 'express';

const router = Router();

router.post('/');

router.delete('/:clientId');

router.get('/');

router.get('/:clientId');

router.patch('/:clientId');

export default router;