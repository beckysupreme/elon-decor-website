const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    
    const db = mongoose.connection.db;
    console.log('📊 Database name:', db.databaseName);
    
    // List existing collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Existing collections:', collections.map(c => c.name));
    
    // Test creating a test document
    const testCollection = db.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection successful'
    });
    console.log('✅ Write test successful');
    
    // Clean up
    await testCollection.deleteOne({ test: true });
    console.log('✅ Cleanup successful');
    
    await mongoose.disconnect();
    console.log('✅ Test completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testConnection();