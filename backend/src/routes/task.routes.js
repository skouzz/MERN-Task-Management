import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createTask);
router.get('/', auth, getTasks);
router.patch('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

export default router;