const mongoose = require('mongoose');
require('dotenv').config();

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections before cleanup:', collections.map(c => c.name));
    
    // Drop the problematic 'test' collection if it exists
    if (collections.some(c => c.name === 'test')) {
      await db.collection('test').drop();
      console.log('✅ Dropped "test" collection');
    }
    
    // Drop the problematic 'Test' collection if it exists
    if (collections.some(c => c.name === 'Test')) {
      await db.collection('Test').drop();
      console.log('✅ Dropped "Test" collection');
    }
    
    console.log('✅ Cleanup completed');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

cleanup();