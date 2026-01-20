import { MongoClient } from 'mongodb';

// MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ai_danoci:ai_danoci123@cluster0.lxtsyeg.mongodb.net/?appName=Cluster0';

// Sample data
const sampleLeads = [
  {
    date: new Date().toLocaleDateString(),
    name: 'Michael Schmidt',
    phone: '+49 731 555 0123',
    car: 'BMW 320d 2019',
    issue: 'Engine warning light appearing intermittently. Loss of power when accelerating.',
    status: 'new'
  },
  {
    date: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
    name: 'Anna Weber',
    phone: '+49 731 555 0456',
    car: 'Audi A4 2021',
    issue: 'Brake pedal feels soft. Needs inspection before long trip.',
    status: 'contacted'
  },
  {
    date: new Date(Date.now() - 86400000 * 5).toLocaleDateString(),
    name: 'Thomas Müller',
    phone: '+49 731 555 0789',
    car: 'Mercedes C-Class 2018',
    issue: 'Air conditioning not cooling properly. Strange smell from vents.',
    status: 'new'
  },
  {
    date: new Date(Date.now() - 86400000 * 7).toLocaleDateString(),
    name: 'Sarah Fischer',
    phone: '+49 731 555 0321',
    car: 'VW Golf GTI 2020',
    issue: 'Interested in Stage 1 tuning package. Want to discuss options.',
    status: 'resolved'
  },
  {
    date: new Date(Date.now() - 86400000 * 10).toLocaleDateString(),
    name: 'David Bauer',
    phone: '+49 731 555 0654',
    car: 'Porsche 911 2017',
    issue: 'Suspension making clunking noise over bumps. Needs diagnostic.',
    status: 'contacted'
  }
];

const sampleRecords = [
  {
    date: new Date(Date.now() - 86400000 * 3).toLocaleDateString(),
    car: 'BMW 530d',
    issue: 'DPF clogged',
    solution: 'DPF cleaning + software reset',
    cost: 180,
    revenue: 350
  },
  {
    date: new Date(Date.now() - 86400000 * 7).toLocaleDateString(),
    car: 'Audi Q7',
    issue: 'Brake pads worn',
    solution: 'Front & rear brake pad replacement',
    cost: 240,
    revenue: 480
  },
  {
    date: new Date(Date.now() - 86400000 * 10).toLocaleDateString(),
    car: 'Mercedes E-Class',
    issue: 'Oil service due',
    solution: 'Full service + oil change (synthetic)',
    cost: 95,
    revenue: 189
  },
  {
    date: new Date(Date.now() - 86400000 * 14).toLocaleDateString(),
    car: 'VW Golf R',
    issue: 'Stage 1 tuning request',
    solution: 'ECU remap + dyno testing',
    cost: 200,
    revenue: 450
  },
  {
    date: new Date(Date.now() - 86400000 * 18).toLocaleDateString(),
    car: 'Porsche Cayenne',
    issue: 'AC refrigerant low',
    solution: 'AC recharge + leak test',
    cost: 45,
    revenue: 95
  },
  {
    date: new Date(Date.now() - 86400000 * 21).toLocaleDateString(),
    car: 'BMW M3',
    issue: 'Suspension bushings worn',
    solution: 'Control arm bushing replacement',
    cost: 180,
    revenue: 380
  },
  {
    date: new Date(Date.now() - 86400000 * 25).toLocaleDateString(),
    car: 'Audi A6',
    issue: 'Timing chain noise',
    solution: 'Timing chain replacement + tensioner',
    cost: 650,
    revenue: 1250
  },
  {
    date: new Date(Date.now() - 86400000 * 30).toLocaleDateString(),
    car: 'Mercedes AMG GT',
    issue: 'Detailing requested',
    solution: 'Full paint correction + ceramic coating',
    cost: 320,
    revenue: 850
  },
  {
    date: new Date(Date.now() - 86400000 * 35).toLocaleDateString(),
    car: 'VW Tiguan',
    issue: 'Wheel alignment needed',
    solution: 'Laser 4-wheel alignment',
    cost: 35,
    revenue: 85
  },
  {
    date: new Date(Date.now() - 86400000 * 40).toLocaleDateString(),
    car: 'Audi RS6',
    issue: 'Performance upgrade',
    solution: 'Exhaust system upgrade + tune',
    cost: 1200,
    revenue: 2800
  }
];

async function migrate() {
  console.log('🚀 Starting database migration...\n');

  let client: MongoClient | null = null;

  try {
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB Atlas...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected successfully!\n');

    const db = client.db('kercishta');

    // Create collections if they don't exist
    console.log('📦 Setting up collections...');

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // Create leads collection
    if (!collectionNames.includes('leads')) {
      await db.createCollection('leads');
      console.log('✅ Created "leads" collection');
    } else {
      console.log('ℹ️  "leads" collection already exists');
    }

    // Create records collection
    if (!collectionNames.includes('records')) {
      await db.createCollection('records');
      console.log('✅ Created "records" collection');
    } else {
      console.log('ℹ️  "records" collection already exists');
    }

    console.log('');

    // Insert sample leads
    console.log('📝 Inserting sample leads...');
    const leadsCollection = db.collection('leads');

    // Clear existing data (optional - comment out if you want to keep existing data)
    const existingLeadsCount = await leadsCollection.countDocuments();
    if (existingLeadsCount > 0) {
      await leadsCollection.deleteMany({});
      console.log(`🗑️  Cleared ${existingLeadsCount} existing leads`);
    }

    const leadsResult = await leadsCollection.insertMany(sampleLeads);
    console.log(`✅ Inserted ${leadsResult.insertedCount} sample leads`);

    // Insert sample records
    console.log('\n📊 Inserting sample service records...');
    const recordsCollection = db.collection('records');

    // Clear existing data (optional - comment out if you want to keep existing data)
    const existingRecordsCount = await recordsCollection.countDocuments();
    if (existingRecordsCount > 0) {
      await recordsCollection.deleteMany({});
      console.log(`🗑️  Cleared ${existingRecordsCount} existing records`);
    }

    const recordsResult = await recordsCollection.insertMany(sampleRecords);
    console.log(`✅ Inserted ${recordsResult.insertedCount} sample service records`);

    // Display statistics
    console.log('\n📈 Database Statistics:');
    console.log('─'.repeat(50));

    const totalRevenue = sampleRecords.reduce((sum, r) => sum + r.revenue, 0);
    const totalCost = sampleRecords.reduce((sum, r) => sum + r.cost, 0);
    const totalProfit = totalRevenue - totalCost;

    console.log(`Total Leads:      ${sampleLeads.length}`);
    console.log(`  - New:          ${sampleLeads.filter(l => l.status === 'new').length}`);
    console.log(`  - Contacted:    ${sampleLeads.filter(l => l.status === 'contacted').length}`);
    console.log(`  - Resolved:     ${sampleLeads.filter(l => l.status === 'resolved').length}`);
    console.log('');
    console.log(`Total Records:    ${sampleRecords.length}`);
    console.log(`Total Revenue:    €${totalRevenue.toLocaleString()}`);
    console.log(`Total Cost:       €${totalCost.toLocaleString()}`);
    console.log(`Total Profit:     €${totalProfit.toLocaleString()}`);
    console.log('─'.repeat(50));

    console.log('\n✅ Migration completed successfully!');
    console.log('\n🎉 You can now:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Visit: http://localhost:3000');
    console.log('   3. Admin: http://localhost:3000/admin');
    console.log(`   4. Password: otrotr\n`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    // Close connection
    if (client) {
      await client.close();
      console.log('👋 Connection closed.');
    }
  }
}

// Run migration
migrate();
