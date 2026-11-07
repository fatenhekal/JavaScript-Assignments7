import express from 'express';
import { PORT } from './config/config.service.js';
import connectDB from './DB/connection.js';
import { userRouter, noteRouter } from './modules/index.js';

const app = express();
app.use(express.json());

app.use('/users', userRouter);
app.use('/notes', noteRouter);

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// global error handler
app.use((err, req, res, next) => {
  if (err.code === 11000) return res.status(409).json({ message: 'Email already exists.' });
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((e) => e.message).join(', ');
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') return res.status(400).json({ message: `Invalid ${err.path}` });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON body' });
  res.status(err.status || 500).json({ message: err.message || 'Something went wrong' });
});

await connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));