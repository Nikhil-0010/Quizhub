import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 4000;


const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  }
})
const { ObjectId } = mongoose.Types;


let QuizAttempt;
let leaderboard = [];
const activeQuizWatchers = new Map(); // Store active watchers per quiz
let retryAttempts = 0;
const maxRetries = 4; // Limit retries to 4

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    QuizAttempt = conn.connection.db.collection("quizattempts");
    console.log("Attempts ",QuizAttempt);
    retryAttempts = 0;
  }catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    if (retryAttempts < maxRetries) {
      retryAttempts++;
      const retryDelay = Math.min(2000 + (retryAttempts*1000), 12000); // Increase delay, max 10s
      console.log(`Retrying connection... Attempt ${retryAttempts} of ${maxRetries} in ${retryDelay / 1000}s`);
      setTimeout(connectDB, retryDelay);
    } else {
      console.error("Max retries reached. Exiting...");
      process.exit(1);
    }
  }
}
(async () => {
  await connectDB();
})(); // IIFE to connect to MongoDB

// console.log(QuizAttempt);

const getLeaderboard = async (quizId) => {
  try {
    if (!QuizAttempt) throw new Error("Database not connected yet");

    // Fetch top 10 leaderboard entries based on scores
    let leaderboard = await QuizAttempt.find({ quizId: new ObjectId(quizId) })
      .sort({ score: -1 })
      .toArray();

    return leaderboard.map((attempt) => ({
      userEmail: attempt.userEmail,
      score: attempt.score,
    }));
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch leaderboard');
  }
};

const sendLeaderboardUpdate = async (quizId) => {
  leaderboard = await getLeaderboard(quizId);
  io.to(quizId).emit('leaderboardUpdate', leaderboard);
}

const watchQuizAttempt = async (quizId) => {
  try {
    let objectQuizId = new ObjectId(quizId);
    let pipeline = [
      {
        $match: {
          'fullDocument.quizId': objectQuizId,
          operationType: { $in: ['insert', 'update', 'replace'] },
        }
      }
    ]

    let changeStream = QuizAttempt.watch(pipeline, { fullDocument: 'updateLookup' });

    changeStream.on('change', async (change) => {
      console.log(`Change detected for quiz ${quizId}`, change);
      await sendLeaderboardUpdate(quizId);
    })

    changeStream.on('error', (err) => {
      console.error(`Change stream error for quiz ${quizId}:`, err);
      setTimeout(() => watchQuizAttempt(quizId), 5000); // Retry after 5s
    });

    // Store the Change Stream instance
    activeQuizWatchers.set(quizId, changeStream);
  } catch (error) {
    console.error('Error watching quiz attempt:', error);
  }
}

io.on('connection', async (socket) => {
  const { quizId } = socket.handshake.query;
  socket.join(quizId);
  console.log(`User joined quiz ${quizId}`, socket.id)

  // Send the initial leaderboard to user
  leaderboard = await getLeaderboard(quizId);
  console.log("Leaderboard: ", leaderboard);
  socket.emit('leaderboardUpdate', leaderboard);

  // Start watching if it's not already active
  if (!activeQuizWatchers.has(quizId)) {
    watchQuizAttempt(quizId);
  }

  socket.on('disconnect', () => {
    // console.log(`User left quiz ${quizId}`);
    const room = io.sockets.adapter.rooms.get(quizId);
    if (!room) {
      // console.log(`No users left in quiz ${quizId}, stopping watcher`);
      activeQuizWatchers.get(quizId)?.close();
      activeQuizWatchers.delete(quizId);
    }
  })
})


server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
})