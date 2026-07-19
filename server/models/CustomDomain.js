import mongoose from 'mongoose';

const customDomainSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // optional if you're using a users collection
    required: true,
    unique: true,
  },
  domain: {
    type: String,
    required: true,
    unique: true, // ensures one domain can't be added twice
    lowercase: true,
    trim: true,
  },
  domainType: {
    type: String,
    enum: ['apex', 'subdomain'],
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: true,
  },
  hostnameId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastVerifiedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['verified', 'unverified', 'expired'],
    default: 'unverified',
  },
});

export default mongoose.model('CustomDomain', customDomainSchema);