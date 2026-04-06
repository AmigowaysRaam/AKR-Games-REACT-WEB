const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware');
const pool = require('../config/db');
const admin = require('../middleware/adminMiddleware');
const upload = require('../middleware/upload');


router.post('/add-banner', upload.single('image'), async (req, res) => {
  try {
    const { title, description, redirectUrl, startDate, endDate, status, priority } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: 'Title & image required' });
    }

    const result = await pool.query(
      `INSERT INTO banners 
       (title, description, image, redirect_url, start_date, end_date, status, priority)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING *`,
      [
        title,
        description,
        req.file.filename,
        redirectUrl,
        startDate,
        endDate,
        status || 'active',
        priority || 1
      ]
    );

    res.json({ message: 'Banner added', banner: result.rows[0] });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/banners', async (req, res) => {
  try {
    
        const result = await pool.query(
        `SELECT id, title, description, image,
        redirect_url, status, priority
        FROM banners
        ORDER BY priority ASC`
        );

        const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;

        const banners = result.rows.map(b => ({
        ...b,
        image: b.image ? baseUrl + b.image : null
        }));

        res.json({ banners });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/update-banner', auth, admin, upload.single('image'), async (req, res) => {
  try {
    const { id, title, description, redirectUrl, startDate, endDate, status, priority } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Banner ID required' });
    }

    // get old image
    const old = await pool.query('SELECT image FROM banners WHERE id=$1', [id]);
    const oldImage = old.rows[0]?.image;

    let query = `
      UPDATE banners SET
      title=$1,
      description=$2,
      redirect_url=$3,
      start_date=$4,
      end_date=$5,
      status=$6,
      priority=$7
    `;

    let values = [title, description, redirectUrl, startDate, endDate, status, priority];

    if (req.file) {
      query += `, image=$8 WHERE id=$9`;
      values.push(req.file.filename, id);

      if (oldImage) {
        const fs = require('fs');
        const path = require('path');

        const oldPath = path.join('uploads', oldImage);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

    } else {
      query += ` WHERE id=$8`;
      values.push(id);
    }

    await pool.query(query, values);

    res.json({ message: 'Banner updated' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/delete-banner', auth, admin, async (req, res) => {
  try {
    const { id } = req.body;

    const result = await pool.query(
      'SELECT image FROM banners WHERE id=$1',
      [id]
    );

    const image = result.rows[0]?.image;

    if (image) {
      const fs = require('fs');
      const path = require('path');

      const imagePath = path.join('uploads', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.query('DELETE FROM banners WHERE id=$1', [id]);

    res.json({ message: 'Banner deleted' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;