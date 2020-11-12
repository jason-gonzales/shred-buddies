
require('dotenv/config');
const express = require('express');

const db = require('./database');
const ClientError = require('./client-error');
const staticMiddleware = require('./static-middleware');
const sessionMiddleware = require('./session-middleware');

const app = express();

app.use(staticMiddleware);
app.use(sessionMiddleware);

app.use(express.json());

app.get('/api/health-check', (req, res, next) => {
  db.query('select \'successfully connected\' as "message"')
    .then(result => res.json(result.rows[0]))
    .catch(err => next(err));
});

app.get('/api/resort', (req, res, next) => {
  const sql = `
    select *
    from resort
    `;
  db.query(sql)
    .then(result => res.status(200).json(result.rows))
    .catch(err => next(err));
});

app.get('/api/profile', (req, res, next) => {
  const select = `
        select *
        from profile
  `;
  db.query(select)
    .then(result => res.status(200).json(result.rows[0]))
    .catch(err => next(err));
});

app.post('/api/profile', (req, res, next) => {
  if (!req.body.name && !req.body.email && !req.body.skill && !req.body.imgUrl && !req.body.description) throw new ClientError(' Name , email, skill, imgUrl,description must be fill out', 400);
  const insert = `
        insert into "profile"("name", "email","skill", "imgUrl", "description")
        values ($1,$2,$3,$4,$5)
        returning *
 `;
  const values = [req.body.name, req.body.email, req.body.skill, req.body.imgUrl, req.body.description];
  db.query(insert, values)
    .then(result => res.status(200).json(result.rows[0]))
    .catch(err => next(err));
});

app.get('/api/event', (req, res, next) => {
  const select = `
          select *
          from event
  `;
  db.query(select)
    .then(result => res.status(200).json(result.rows))
    .catch(err => next(err));
});

app.get('/api/event/:eventId', (req, res, next) => {
  const eventId = parseInt(req.params.eventId, 10);
  const select = `
        select *
        from "event"
        where "eventId" = $1
  `;
  db.query(select, [eventId])
    .then(result => {
      if (!result.rows[0]) {
        next(new ClientError(`cannot find eventId of ${eventId}`, 404));
      } else {
        res.status(200).json(result.rows[0]);
      }
    });
});

app.post('/api/event', (req, res, next) => {
  if (!req.body.resortId && !req.body.startDate && !req.body.endDate && !req.body.profileId && !req.body.description) throw new ClientError(' resortId , startDate, endDate, profileId, description must be fill out', 400);
  const insert = `
        insert into "event"("resortId", "startDate","endDate", "profileId", "description")
        values ($1,$2,$3,$4,$5)
        returning *
 `;
  const values = [req.body.resortId, req.body.startDate, req.body.endDate, req.body.profileId, req.body.description];
  db.query(insert, values)
    .then(result => res.status(200).json(result.rows[0]))
    .catch(err => next(err));
});

app.use('/api', (req, res, next) => {
  next(new ClientError(`cannot ${req.method} ${req.originalUrl}`, 404));
});

app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Listening on port', process.env.PORT);
});
