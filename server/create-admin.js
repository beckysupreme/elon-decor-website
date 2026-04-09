const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    console.log('📊 Database name:', db.databaseName);
    
    // List existing collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Existing collections:', collections.map(c => c.name));
    
    // Check if admins collection exists
    const adminCollection = db.collection('admins');
    
    // Try to find existing admin
    let existingAdmin = null;
    try {
      existingAdmin = await adminCollection.findOne({ username: 'admin' });
    } catch (err) {
      console.log('Collection does not exist yet, will create new one');
    }
    
    if (existingAdmin) {
      console.log('✅ Admin already exists');
      console.log('Username:', existingAdmin.username);
      await mongoose.disconnect();
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    // Create admin
    await adminCollection.insertOne({
      username: 'admin',
      password: hashedPassword,
      createdAt: new Date(),
      __v: 0
    });
    
    console.log('✅ Admin created successfully!');
    console.log('📝 Username: admin');
    console.log('📝 Password: admin123');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createAdmin();