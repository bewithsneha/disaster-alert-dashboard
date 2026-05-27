const express = require('express');
const router = express.Router();
const db = require('../database');

// GET /api/alerts - List alerts with filters
router.get('/', (req, res) => {
  const { type, severity, country, search } = req.query;
  
  let query = 'SELECT * FROM alerts WHERE 1=1';
  const params = [];

  if (type && type !== 'all') {
    query += ' AND type = ?';
    params.push(type);
  }
  if (severity && severity !== 'all') {
    query += ' AND severity = ?';
    params.push(severity);
  }
  if (country) {
    query += ' AND country LIKE ?';
    params.push(`%${country}%`);
  }
  if (search) {
    query += ' AND (title LIKE ? OR type LIKE ? OR country LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY timestamp DESC LIMIT 200';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET /api/alerts/stats - Alert statistics
router.get('/stats', (req, res) => {
  const stats = {};

  db.get('SELECT COUNT(*) as total FROM alerts', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.total = row.total;

    db.all(
      'SELECT type, COUNT(*) as count FROM alerts GROUP BY type ORDER BY count DESC',
      [],
      (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.byType = {};
        rows.forEach(r => { stats.byType[r.type] = r.count; });

        db.all(
          'SELECT severity, COUNT(*) as count FROM alerts GROUP BY severity ORDER BY count DESC',
          [],
          (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.bySeverity = {};
            rows.forEach(r => { stats.bySeverity[r.severity] = r.count; });

            db.get(
              "SELECT COUNT(*) as count FROM alerts WHERE timestamp >= datetime('now', '-24 hours')",
              [],
              (err, row) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.last24h = row.count;

                db.all(
                  'SELECT country, COUNT(*) as count FROM alerts GROUP BY country ORDER BY count DESC LIMIT 5',
                  [],
                  (err, rows) => {
                    if (err) return res.status(500).json({ error: err.message });
                    stats.topRegions = rows;
                    res.json(stats);
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;
