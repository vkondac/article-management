const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({
      where: {
        ArticleID: parseInt(id)
      }
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching the article' });
  }
});

router.get('/', async (req, res) => {
  try {
    const articles = await prisma.article.findMany();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching articles' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { PublishDate, Title, Reporter, Body, CategoryID, TagIDs } = req.body;

    // Basic validation
    if (!Title || !Reporter || !Body || !CategoryID || !TagIDs || !TagIDs.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const article = await prisma.article.create({
      data: {
        PublishDate,
        Title,
        Reporter,
        Body,
        CategoryID,
        Tags: { connect: TagIDs.map((TagID) => ({ TagID })) },
      },
    });
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { PublishDate, Title, Reporter, Body, CategoryID, TagIDs } = req.body;

    if (!Title || !Reporter || !Body || !CategoryID || !TagIDs || !TagIDs.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const article = await prisma.article.update({
      where: { ArticleID: parseInt(id) },
      data: {
        PublishDate,
        Title,
        Reporter,
        Body,
        CategoryID,
        Tags: { set: TagIDs.map((TagID) => ({ TagID })) },
      },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.delete({
      where: { ArticleID: parseInt(id) },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the article' });
  }
});

router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const articles = await prisma.article.findMany({
      where: { CategoryID: parseInt(categoryId) },
    });

    if (articles.length === 0) {
      return res.status(404).json({ error: 'No articles found for this category' });
    }

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get('/tag/:tagId', async (req, res) => {
  try {
    const { tagId } = req.params;
    const tag = await prisma.tag.findUnique({
      where: { TagID: parseInt(tagId) },
      include: { Articles: true }, 
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    const articles = tag.Articles

    if (articles.length === 0) {
      return res.status(404).json({ error: 'No articles found for this tag' });
    }

    res.json(articles);

  } catch (error) {
    res.status(500).json({ error: error });
  }
});


module.exports = router;
