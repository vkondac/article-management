const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tags' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { Title } = req.body;

    // Basic validation
    if (!Title) {
      return res.status(400).json({ error: 'Title field is required' });
    }

    const tag = await prisma.tag.create({
      data: {
        Title,
      },
    });
    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Error creating the tag' });
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

    const tag = await prisma.tag.update({
      where: { TagID: parseInt(id) },
      data: {
        Title,
      },
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.json(tag);
  } catch (error) {
    res.status(500).json({ error: 'Error updating the tag' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await prisma.tag.delete({
      where: { TagID: parseInt(id) },
    });

    if (!tag) {
      return res.status(404).json({ error: 'Tag not found' });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Error deleting the tag' });
  }
});

module.exports = router;
