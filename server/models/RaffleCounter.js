import mongoose from 'mongoose';

const RaffleCounterSchema = new mongoose.Schema({
  _id: String, // raffle ID
  seq: Number
});

export const RaffleCounter = mongoose.model('RaffleCounter', RaffleCounterSchema);

export async function getNextTransactionId(raffleId) {
  const counter = await RaffleCounter.findByIdAndUpdate(
    raffleId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // create if doesn't exist
  );

  return String(counter.seq).padStart(3, '0'); // e.g., 5 → "005"
}
