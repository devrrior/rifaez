// import mongoose from 'mongoose';

// async function updateIndexes() {
//   await mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   const collection = mongoose.connection.collection('users');

//   // Remove old index
//   try {
//     await collection.dropIndex('facebookId_1');
//     console.log('Dropped old facebookId index.');
//   } catch (err) {
//     console.log('Index may not exist:', err.message);
//   }

//   // Create sparse unique index
//   await collection.createIndex({ facebookId: 1 }, { unique: true, sparse: true });
//   console.log('Created sparse unique index on facebookId.');

//   const indexes = await collection.indexes();
//   console.log('Current indexes:', indexes);

//   await mongoose.disconnect();
// }

// updateIndexes();
