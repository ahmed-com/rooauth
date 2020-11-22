import { Router } from 'express';

const router = Router();

router.delete('/:subjectId');

router.get('/');

router.get('/:subjectId');

router.patch('/:subjectId');

router.post('/');

export default router;