import express from 'express';
import {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
} from '../controllers/Projects';

const router = express.Router();

router.get('/projects', getProjects);
router.get('/projects/:id', getProjectById);
router.post('/projects', createProject);
router.patch('/projects', updateProject);
router.delete('/projects', deleteProject);

export default router;
