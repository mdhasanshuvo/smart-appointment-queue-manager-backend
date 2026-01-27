/**
 * Database seeder for development and testing
 * Populates database with sample data
 */
const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');
const Staff = require('../models/Staff');
const Service = require('../models/Service');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Staff.deleteMany({});
    await Service.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    await User.create({
      email: 'demo@example.com',
      password: hashedPassword,
    });

    console.log('👤 Created demo user');

    // Create staff members
    const staff = await Staff.insertMany([
      {
        name: 'Dr. Sarah Johnson',
        serviceType: 'Doctor',
        dailyCapacity: 8,
        availabilityStatus: 'Available',
      },
      {
        name: 'Dr. Michael Chen',
        serviceType: 'Doctor',
        dailyCapacity: 6,
        availabilityStatus: 'Available',
      },
      {
        name: 'Emily Roberts',
        serviceType: 'Consultant',
        dailyCapacity: 10,
        availabilityStatus: 'Available',
      },
      {
        name: 'James Wilson',
        serviceType: 'Consultant',
        dailyCapacity: 8,
        availabilityStatus: 'On Leave',
      },
      {
        name: 'Lisa Anderson',
        serviceType: 'Support Agent',
        dailyCapacity: 12,
        availabilityStatus: 'Available',
      },
    ]);

    console.log(`👥 Created ${staff.length} staff members`);

    // Create services
    const services = await Service.insertMany([
      {
        serviceName: 'General Consultation',
        duration: 30,
        requiredStaffType: 'Doctor',
        description: 'Standard medical consultation',
      },
      {
        serviceName: 'Specialist Appointment',
        duration: 45,
        requiredStaffType: 'Doctor',
        description: 'Appointment with medical specialist',
      },
      {
        serviceName: 'Business Consultation',
        duration: 60,
        requiredStaffType: 'Consultant',
        description: 'Professional business advisory session',
      },
      {
        serviceName: 'Technical Support',
        duration: 20,
        requiredStaffType: 'Support Agent',
        description: 'Technical assistance and troubleshooting',
      },
      {
        serviceName: 'Follow-up Visit',
        duration: 15,
        requiredStaffType: 'Doctor',
        description: 'Quick follow-up consultation',
      },
    ]);

    console.log(`📋 Created ${services.length} services`);

    console.log('✅ Database seeding completed successfully!');
    console.log('\n📌 Demo Credentials:');
    console.log('   Email: demo@example.com');
    console.log('   Password: demo123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
