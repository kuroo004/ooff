const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const FACE_SERVICE_URL = process.env.FACE_SERVICE_URL || 'http://localhost:8001';

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbPath = path.join(__dirname, 'interview_assistant.db');
const db = new sqlite3.Database(dbPath);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// User registration
app.post('/api/auth/register', async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)',
      [username, hashedPassword, email],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Username already exists' });
          }
          return res.status(500).json({ error: 'Database error' });
        }

        const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET);
        res.json({ token, user: { id: this.lastID, username, email } });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// User login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      try {
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
        res.json({ 
          token, 
          user: { 
            id: user.id, 
            username: user.username, 
            email: user.email 
          } 
        });
      } catch (error) {
        res.status(500).json({ error: 'Server error' });
      }
    }
  );
});

// Get user profile
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, username, email, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    }
  );
});

// Get interview questions (with shuffling logic)
app.get('/api/questions/:topic', authenticateToken, (req, res) => {
  const { topic } = req.params;
  const { count = 5 } = req.query;

  // First, check how many questions the user has used for this topic
  db.get(
    `SELECT COUNT(DISTINCT q.id) as used_count 
     FROM questions q 
     JOIN question_usage qu ON q.id = qu.question_id 
     WHERE q.topic = ? AND qu.user_id = ?`,
    [topic, req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const usedCount = result.used_count || 0;

      // Get total questions for this topic
      db.get(
        'SELECT COUNT(*) as total FROM questions WHERE topic = ?',
        [topic],
        (err, totalResult) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          const totalQuestions = totalResult.total;

          // If all questions have been used, reset usage for this user and topic
          if (usedCount >= totalQuestions) {
            db.run(
              `DELETE FROM question_usage 
               WHERE user_id = ? AND question_id IN (
                 SELECT id FROM questions WHERE topic = ?
               )`,
              [req.user.id, topic],
              (err) => {
                if (err) {
                  return res.status(500).json({ error: 'Database error' });
                }
                // Continue to get questions (now all questions are available again)
                getRandomQuestions();
              }
            );
          } else {
            getRandomQuestions();
          }

          function getRandomQuestions() {
            // Get questions that haven't been used by this user for this topic
            db.all(
              `SELECT q.* FROM questions q 
               WHERE q.topic = ? 
               AND q.id NOT IN (
                 SELECT qu.question_id 
                 FROM question_usage qu 
                 WHERE qu.user_id = ?
               )
               ORDER BY RANDOM() 
               LIMIT ?`,
              [topic, req.user.id, parseInt(count)],
              (err, questions) => {
                if (err) {
                  return res.status(500).json({ error: 'Database error' });
                }

                // Mark these questions as used
                const insertUsage = db.prepare(
                  'INSERT INTO question_usage (user_id, question_id) VALUES (?, ?)'
                );

                questions.forEach(question => {
                  insertUsage.run([req.user.id, question.id]);
                });

                insertUsage.finalize();

                res.json(questions);
              }
            );
          }
        }
      );
    }
  );
});

// Submit interview attempt
app.post('/api/attempts', authenticateToken, (req, res) => {
  const { 
    topic, 
    score, 
    totalQuestions, 
    correctAnswers, 
    durationMinutes,
    confidenceScore,
    facialExpressionScore 
  } = req.body;

  if (!topic || score === undefined || !totalQuestions || correctAnswers === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.run(
    `INSERT INTO interview_attempts 
     (user_id, topic, score, total_questions, correct_answers, duration_minutes, confidence_score, facial_expression_score) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, topic, score, totalQuestions, correctAnswers, durationMinutes, confidenceScore, facialExpressionScore],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ 
        id: this.lastID,
        message: 'Attempt saved successfully' 
      });
    }
  );
});

// Get user's interview attempts
app.get('/api/attempts', authenticateToken, (req, res) => {
  db.all(
    `SELECT * FROM interview_attempts 
     WHERE user_id = ? 
     ORDER BY attempt_date DESC`,
    [req.user.id],
    (err, attempts) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(attempts);
    }
  );
});

// Get performance analytics
app.get('/api/analytics', authenticateToken, (req, res) => {
  // Get overall statistics
  db.get(
    `SELECT 
       COUNT(*) as total_attempts,
       AVG(score) as average_score,
       MAX(score) as best_score,
       MIN(score) as worst_score,
       AVG(duration_minutes) as avg_duration
     FROM interview_attempts 
     WHERE user_id = ?`,
    [req.user.id],
    (err, overall) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get topic-wise statistics
      db.all(
        `SELECT 
           topic,
           COUNT(*) as attempts,
           AVG(score) as avg_score,
           MAX(score) as best_score,
           MIN(score) as worst_score
         FROM interview_attempts 
         WHERE user_id = ? 
         GROUP BY topic`,
        [req.user.id],
        (err, topicStats) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          // Get recent attempts for trend analysis
          db.all(
            `SELECT 
               score,
               attempt_date,
               topic,
               confidence_score,
               facial_expression_score
             FROM interview_attempts 
             WHERE user_id = ? 
             ORDER BY attempt_date DESC 
             LIMIT 20`,
            [req.user.id],
            (err, recentAttempts) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              res.json({
                overall,
                topicStats,
                recentAttempts
              });
            }
          );
        }
      );
    }
  );
});

// Get available topics
app.get('/api/topics', (req, res) => {
  db.all(
    'SELECT DISTINCT topic FROM questions ORDER BY topic',
    (err, topics) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(topics.map(t => t.topic));
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Proctoring: proxy face verification to Python service (proctored mode only)
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FormData = require('form-data');
const multer = require('multer');
const upload = multer();

app.post('/api/proctor/verify', authenticateToken, upload.fields([{ name: 'image1' }, { name: 'image2' }]), async (req, res) => {
  try {
    const files = req.files || {};
    const image1 = files.image1 && files.image1[0];
    const image2 = files.image2 && files.image2[0];
    if (!image1 || !image2) {
      return res.status(400).json({ error: 'image1 and image2 are required' });
    }

    const form = new FormData();
    form.append('image1', image1.buffer, { filename: image1.originalname, contentType: image1.mimetype });
    form.append('image2', image2.buffer, { filename: image2.originalname, contentType: image2.mimetype });
    form.append('model', 'Facenet512');
    form.append('metric', 'cosine');

    const resp = await fetch(`${FACE_SERVICE_URL}/verify`, { method: 'POST', body: form, headers: form.getHeaders() });
    const data = await resp.json();
    return res.status(resp.status).json(data);
  } catch (e) {
    console.error('Proxy verify error:', e);
    return res.status(500).json({ error: 'Face service unavailable' });
  }
});
// Simple face detection proxy for proctored mode (OpenCV-based)
app.post('/api/proctor/detect', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    console.log('Detect request received');
    const file = req.file;
    if (!file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'image is required' });
    }
    console.log(`File received: ${file.originalname}, size: ${file.size}`);
    
    const form = new FormData();
    form.append('image', file.buffer, { filename: file.originalname || 'frame.jpg', contentType: file.mimetype || 'image/jpeg' });
    
    console.log(`Calling Python service at: ${FACE_SERVICE_URL}/detect`);
    const resp = await fetch(`${FACE_SERVICE_URL}/detect`, { method: 'POST', body: form, headers: form.getHeaders() });
    console.log(`Python service response status: ${resp.status}`);
    
    const data = await resp.json();
    console.log('Python service response:', data);
    return res.status(resp.status).json(data);
  } catch (e) {
    console.error('Proxy detect error:', e);
    return res.status(500).json({ error: 'Face service unavailable' });
  }
});

// Ensure embeddings table exists
db.run(
  `CREATE TABLE IF NOT EXISTS user_face_embeddings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    embedding_json TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`
);

// Enrollment: upload N reference selfies, store embeddings
app.post('/api/proctor/enroll', authenticateToken, upload.array('images', 10), async (req, res) => {
  try {
    const files = req.files || [];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No images provided' });
    }

    let saved = 0;
    for (const file of files) {
      const form = new FormData();
      form.append('image', file.buffer, { filename: file.originalname, contentType: file.mimetype });
      form.append('model', 'Facenet512');
      const resp = await fetch(`${FACE_SERVICE_URL}/embed`, { method: 'POST', body: form, headers: form.getHeaders() });
      if (!resp.ok) {
        continue;
      }
      const data = await resp.json();
      const embedding = data && data.embedding;
      if (Array.isArray(embedding) && embedding.length > 0) {
        await new Promise((resolve, reject) => {
          db.run(
            'INSERT INTO user_face_embeddings (user_id, embedding_json) VALUES (?, ?)',
            [req.user.id, JSON.stringify(embedding)],
            function(err) { if (err) reject(err); else resolve(null); }
          );
        });
        saved += 1;
      }
    }

    return res.json({ saved });
  } catch (e) {
    console.error('Enroll error:', e);
    return res.status(500).json({ error: 'Enrollment failed' });
  }
});

// Live verify: embed current frame, compare to stored embeddings using cosine distance
function cosineDistance(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 1;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = Number(a[i]);
    const bi = Number(b[i]);
    dot += ai * bi;
    na += ai * ai;
    nb += bi * bi;
  }
  if (na === 0 || nb === 0) return 1;
  const cosineSim = dot / (Math.sqrt(na) * Math.sqrt(nb));
  return 1 - cosineSim;
}

app.post('/api/proctor/verify-live', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'image is required' });

    // Get embedding for live frame
    const form = new FormData();
    form.append('image', file.buffer, { filename: file.originalname || 'frame.jpg', contentType: file.mimetype || 'image/jpeg' });
    form.append('model', 'Facenet512');
    const resp = await fetch(`${FACE_SERVICE_URL}/embed`, { method: 'POST', body: form, headers: form.getHeaders() });
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      return res.status(502).json({ error: 'Face service error', details: err });
    }
    const data = await resp.json();
    const liveEmbedding = data.embedding;

    // Load user's stored embeddings
    db.all(
      'SELECT id, embedding_json FROM user_face_embeddings WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        if (!rows || rows.length === 0) {
          return res.status(400).json({ error: 'No enrollments found for user' });
        }
        let best = { distance: 1, id: null };
        for (const r of rows) {
          try {
            const ref = JSON.parse(r.embedding_json);
            const dist = cosineDistance(liveEmbedding, ref);
            if (dist < best.distance) best = { distance: dist, id: r.id };
          } catch (_) {}
        }
        // Threshold can be tuned; start with 0.4 for Facenet512 cosine distance
        const threshold = 0.4;
        const match = best.distance <= threshold;
        return res.json({ match, distance: best.distance, threshold });
      }
    );
  } catch (e) {
    console.error('Verify-live error:', e);
    return res.status(500).json({ error: 'Verification failed' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
}); 