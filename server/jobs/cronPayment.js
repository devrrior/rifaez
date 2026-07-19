import cron from 'node-cron';
import Raffle from '../models/Raffle.js'; // adjust the path
import mongoose from 'mongoose';

cron.schedule('0 0 * * *', async () => {
  const now = new Date();
  try {
    const raffles = await Raffle.find({ isActive: true });

    for (const raffle of raffles) {
      const updatedParticipants = raffle.currentParticipants.filter(participant => {
        if (participant.status !== 'pending') return true;

        const participantDate = new Date(participant.date);
        const expiryDate = new Date(participantDate);
        expiryDate.setDate(expiryDate.getDate() + raffle.timeLimitPay);

        return now < expiryDate; // keep only participants who are still within limit
      });

      if (updatedParticipants.length !== raffle.currentParticipants.length) {
        raffle.currentParticipants = updatedParticipants;
        await raffle.save();
        console.log(`⏳ Cleaned up expired participants in raffle ${raffle._id}`);
      }
    }
  } catch (error) {
    console.error('❌ Error cleaning up pending participants:', error);
  }
});
