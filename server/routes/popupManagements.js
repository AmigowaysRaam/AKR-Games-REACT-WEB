const express = require('express');
const router = express.Router();

const pool = require('../config/db');
const auth = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');
const path = require('path');
const fs = require('fs');


router.post('/add-popup', auth, admin, upload.single('image'), async (req, res) => {
  try {
    const {
      title,
      description,
      redirectUrl,
      startDate,
      endDate,
      status,
      priority
    } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: 'Title & image required' });
    }

    const id = Date.now(); // unique id
    const imageName = req.file.filename;

    await pool.query(
      `INSERT INTO popups 
      (id, title, description, image, redirect_url, start_date, end_date, status, priority)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, title, description, imageName, redirectUrl, startDate, endDate, status, priority]
    );

    res.json({
      message: 'Popup added',
      id
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/popups', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM popups ORDER BY priority ASC`
    );

    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

    const popups = result.rows.map(p => ({
      ...p,
      image: p.image ? baseUrl + p.image : null
    }));

    res.json({ popups });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/update-popup', auth, admin, upload.single('image'), async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      redirectUrl,
      startDate,
      endDate,
      status,
      priority
    } = req.body;

    const result = await pool.query(
      'SELECT image FROM popups WHERE id=$1',
      [id]
    );

    const oldImage = result.rows[0]?.image;
    let newImage = oldImage;

    if (req.file) {
      newImage = req.file.filename;

      if (oldImage) {
        const oldPath = path.join('uploads', oldImage);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }

    await pool.query(
      `UPDATE popups SET 
        title=$1,
        description=$2,
        image=$3,
        redirect_url=$4,
        start_date=$5,
        end_date=$6,
        status=$7,
        priority=$8
       WHERE id=$9`,
      [title, description, newImage, redirectUrl, startDate, endDate, status, priority, id]
    );

    res.json({ message: 'Popup updated' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/delete-popup', auth, admin, async (req, res) => {
  try {
    const { id } = req.body;

    const result = await pool.query(
      'SELECT image FROM popups WHERE id=$1',
      [id]
    );

    const image = result.rows[0]?.image;

    if (image) {
      const imagePath = path.join('uploads', image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await pool.query(
      'DELETE FROM popups WHERE id=$1',
      [id]
    );

    res.json({ message: 'Popup deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;