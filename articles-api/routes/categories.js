const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching categories' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { Title } = req.body;

    if (!Title) {
      return res.status(400).json({ error: 'Title field is required' });
    }

    const category = await prisma.category.create({
      data: {
        Title,
      },
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error creating the category' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { Title } = req.body;

    // Basic validation
    if (!Title) {
      return res.status(400).json({ error: 'Title field is required' });
    }

    const category = await prisma.category.update({
      where: { CategoryID: parseInt(id) },
      data: {
        Title,
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the category' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.delete({
      where: { CategoryID: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the category' });
  }
});

module.exports = router;
