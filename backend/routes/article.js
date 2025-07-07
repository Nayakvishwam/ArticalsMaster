const express = require('express');
const router = express.Router();
const {
    getAllArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    getArticleHistory
} = require('../controllers/article');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.get('/', getAllArticles);
router.get('/:id', getArticleById);

// Protected routes
router.post('/', authenticateToken, createArticle);
router.put('/:id', authenticateToken, updateArticle);
router.delete('/:id', authenticateToken, deleteArticle);
router.get('/:id/history', authenticateToken, getArticleHistory);

module.exports = { articleRouter: router };