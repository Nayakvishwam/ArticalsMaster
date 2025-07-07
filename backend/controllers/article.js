const { models } = require('../config/dbConnection');
const { Op } = require('sequelize');
const { askGemini } = require('../gemini');

// Get all articles with pagination
async function getAllArticles(req, res) {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    if (status) whereClause.status = status;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { content: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const articles = await models.articlemaster.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: models.users,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      articles: articles.rows,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(articles.count / limit),
        totalItems: articles.count,
        itemsPerPage: parseInt(limit)
      },
      status: 'success'
    });
  } catch (error) {
    console.error('Get articles error:', error);
    res.status(500).json({ message: 'Internal server error', status: 'error' });
  }
}

// Get single article by ID
async function getArticleById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const article = await models.articlemaster.findOne({
      where: { id },
      include: [{
        model: models.users,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });

    if (!article) {
      return res.status(404).json({ message: 'Article not found', status: 'error' });
    }

    // Check if user can view this article
    if (article.status === 'draft' && article.createdBy !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied', status: 'error' });
    }

    res.json({ article, status: 'success' });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({ message: 'Internal server error', status: 'error' });
  }
}

// Create new article
async function createArticle(req, res) {
  try {
    const { title, content, status = 'draft' } = req.body;
    const userId = req.user.id;

    let summary = null;
    if (content) {
      summary = await askGemini(content);
    };
    const article = await models.articlemaster.create({
      title,
      content,
      createdBy: userId,
      status,
      summary
    });
    const articleWithAuthor = await models.articlemaster.findOne({
      where: { id: article.id },
      include: [{
        model: models.users,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.status(201).json({
      article: articleWithAuthor,
      message: 'Article created successfully',
      status: 'success'
    });
  } catch (error) {
    console.error('Create article error:', error);
    res.status(500).json({ message: 'Internal server error', status: 'error' });
  }
}

// Update article
async function updateArticle(req, res) {
  try {
    const { id } = req.params;
    const { title, content, status, editReason } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const article = await models.articlemaster.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found', status: 'error' });
    }

    // Check permissions
    if (article.createdBy !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied', status: 'error' });
    };
    let summary = null;
    if (article?.content != content) {
      summary = await askGemini(content);
    };
    // Store current version in revisions before updating
    const currentRevisionCount = await models.articlerevision.count({
      where: { articleId: id }
    });

    await models.articlerevision.create({
      articleId: id,
      title: article.title,
      content: article.content,
      editedBy: userId,
      editReason: editReason || 'No reason provided',
      revisionNumber: currentRevisionCount + 1
    });

    // Update the article
    await article.update({
      title: title || article.title,
      content: content || article.content,
      status: status || article.status,
      summary
    });

    const updatedArticle = await models.articlemaster.findOne({
      where: { id },
      include: [{
        model: models.users,
        as: 'author',
        attributes: ['id', 'name', 'email']
      }]
    });

    res.json({
      article: updatedArticle,
      message: 'Article updated successfully',
      status: 'success'
    });
  } catch (error) {
    console.error('Update article error:', error);
    res.status(500).json({ message: 'Internal server error', status: 'error' });
  }
}

// Delete article
async function deleteArticle(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const article = await models.articlemaster.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found', status: 'error' });
    }

    // Check permissions
    if (article.createdBy !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied', status: 'error' });
    }

    // Delete associated revisions first
    await models.articlerevision.destroy({
      where: { articleId: id }
    });

    // Delete the article
    await article.destroy();

    res.json({ message: 'Article deleted successfully', status: 'success' });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({ message: 'Internal server error', status: 'error' });
  }
}

// Get article revision history
async function getArticleHistory(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const article = await models.articlemaster.findByPk(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found', status: 'error' });
    }

    // Check permissions - only author or admin can see history
    if (article.createdBy !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Access denied', status: 'error' });
    }

    const revisions = await models.articlerevision.findAll({
      where: { articleId: id },
      include: [{
        model: models.users,
        as: 'editor',
        attributes: ['id', 'name', 'email']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json({ revisions, status: 'success' });
  } catch (error) {
    console.error('Get article history error:', error);
    res.status(500).json({ message: 'Internal server error', status: 'error' });
  }
}

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticleHistory
};
