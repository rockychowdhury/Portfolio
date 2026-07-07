const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    for (let c of collections) {
      const docs = await db.collection(c.name).find({}).toArray();
      docs.forEach(d => {
        const str = JSON.stringify(d);
        if (str.includes('bookings-table') || str.includes('3-')) {
          console.log(`Found in ${c.name}: ${str}`);
        }
      });
    }
    mongoose.connection.close();
  });
