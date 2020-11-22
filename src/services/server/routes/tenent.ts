import { Router } from 'express';

const router = Router();

router.post('/');

router.delete('/:tenentId');

router.get('/');

router.get('/:tenentId');

router.patch('/:tenentId');

export default router;