import express from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from '../controllers/Projects.js';
import { verifyUser } from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', verifyUser, createProject);
router.patch('/projects/:id', verifyUser, updateProject);
router.delete('/projects/:id', verifyUser, deleteProject);

export default router;
