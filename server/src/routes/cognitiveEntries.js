import express from 'express';
import { createCognitiveEntry } from '../controllers/cognitiveEntryController.js';

const router = express.Router();

// POST /api/cognitive-entries - Create a new cognitive entry
router.post('/', createCognitiveEntry);

export default router;

