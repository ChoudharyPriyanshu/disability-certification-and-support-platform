const mongoose = require('mongoose');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const Scheme = require('../models/Scheme');
const Product = require('../models/Product');
const Admin = require('../models/Admin');

const seedSchemes = [
    {
        name: 'Assistance to Disabled Persons for Purchase/Fitting of Aids and Appliances (ADIP)',
        description: 'Provides assistive devices to persons with disabilities to improve their independent functioning. The scheme covers hearing aids, wheelchairs, artificial limbs, and other aids.',
        eligibilityCriteria: 'Indian citizen with 40% or more disability, monthly income not exceeding ₹20,000',
        benefits: 'Free distribution of durable, sophisticated, and scientifically manufactured aids and appliances to promote physical, social, and psychological rehabilitation.',
        applicationUrl: 'https://www.nhfdc.nic.in',
        ministry: 'Ministry of Social Justice and Empowerment',
        disabilityTypes: ['Locomotor', 'Visual', 'Hearing', 'All'],
        minimumPercentage: 40,
        isActive: true,
    },
    {
        name: 'National Handicapped Finance and Development Corporation (NHFDC)',
        description: 'Provides financial assistance through loans at concessional rates for self-employment and education of persons with disabilities.',
        eligibilityCriteria: 'Persons with 40%+ disability, age 18+, annual family income up to ₹3 lakh',
        benefits: 'Loans up to ₹25 lakh for self-employment ventures, educational loans for professional courses, and micro-financing.',
        applicationUrl: 'https://www.nhfdc.nic.in',
        ministry: 'Ministry of Social Justice and Empowerment',
        disabilityTypes: ['All'],
        minimumPercentage: 40,
        isActive: true,
    },
    {
        name: 'Indira Gandhi National Disability Pension Scheme (IGNDPS)',
        description: 'Monthly pension for persons with severe disabilities living below the poverty line.',
        eligibilityCriteria: 'Age 18-79, BPL household, 80% or more disability',
        benefits: '₹300/month from Central Government + State Government contribution. States may add additional amount.',
        applicationUrl: 'https://nsap.nic.in',
        ministry: 'Ministry of Rural Development',
        disabilityTypes: ['All'],
        minimumPercentage: 80,
        isActive: true,
    },
    {
        name: 'Sugamya Bharat Abhiyan (Accessible India Campaign)',
        description: 'Making public infrastructure, transportation, and information & communication technology accessible to persons with disabilities.',
        eligibilityCriteria: 'All persons with disabilities',
        benefits: 'Accessible buildings, accessible transportation, accessible websites and services, sign language interpreters.',
        applicationUrl: 'https://accessibleindia.gov.in',
        ministry: 'Department of Empowerment of Persons with Disabilities',
        disabilityTypes: ['All'],
        minimumPercentage: 0,
        isActive: true,
    },
    {
        name: 'Deendayal Disabled Rehabilitation Scheme (DDRS)',
        description: 'Provides grant-in-aid to NGOs for running rehabilitation programs for persons with disabilities.',
        eligibilityCriteria: 'Persons with disabilities registered with NGO partners implementing the scheme',
        benefits: 'Vocational training, special education, community-based rehabilitation, early intervention.',
        applicationUrl: 'https://disabilityaffairs.gov.in',
        ministry: 'Department of Empowerment of Persons with Disabilities',
        disabilityTypes: ['All'],
        minimumPercentage: 40,
        isActive: true,
    },
    {
        name: 'Scholarship for Students with Disabilities',
        description: 'Pre and post matric scholarships for students with disabilities to pursue education.',
        eligibilityCriteria: 'Students with 40%+ disability, family income under ₹2.5 lakh/year',
        benefits: 'Tuition fee waiver, monthly maintenance allowance, book allowance, transport allowance.',
        applicationUrl: 'https://scholarships.gov.in',
        ministry: 'Ministry of Social Justice and Empowerment',
        disabilityTypes: ['All'],
        minimumPercentage: 40,
        isActive: true,
    },
];

const seedProducts = [
    {
        name: 'Foldable Wheelchair — Standard',
        description: 'Lightweight, foldable manual wheelchair with chrome-plated steel frame. Suitable for indoor and outdoor use.',
        category: 'Mobility Aids',
        price: 8500,
        discountedPrice: 6800,
        image: '/uploads/products/wheelchair-standard.png',
        stock: 25,
        specifications: 'Weight: 14kg, Seat width: 18", Load capacity: 120kg, Foldable frame',
        isAvailable: true,
    },
    {
        name: 'Digital Hearing Aid — Behind-the-Ear',
        description: 'Digital programmable BTE hearing aid with noise reduction and feedback cancellation. Suitable for mild to moderate hearing loss.',
        category: 'Hearing Aids',
        price: 12000,
        discountedPrice: 9500,
        image: '/uploads/products/hearing-aid-bte.png',
        stock: 40,
        specifications: '4-channel digital processing, directional microphone, volume control, low battery indicator',
        isAvailable: true,
    },
    {
        name: 'Smart White Cane',
        description: 'Ultrasonic sensor-equipped white cane for visually impaired persons. Detects obstacles and provides vibration alerts.',
        category: 'Visual Aids',
        price: 3500,
        discountedPrice: 2800,
        image: '/uploads/products/smart-white-cane.png',
        stock: 30,
        specifications: 'Ultrasonic sensor range: 2m, rechargeable battery, vibration + audio alerts, foldable',
        isAvailable: true,
    },
    {
        name: 'Adjustable Walking Stick — Aluminum',
        description: 'Height-adjustable aluminum walking stick with rubber grip and anti-slip base. Lightweight and durable.',
        category: 'Mobility Aids',
        price: 850,
        discountedPrice: 650,
        image: '/uploads/products/walking-stick.png',
        stock: 60,
        specifications: 'Height: 28"–37" adjustable, weight: 350g, anti-slip rubber tip, T-handle grip',
        isAvailable: true,
    },
    {
        name: 'Braille Display — 20 Cell',
        description: 'Refreshable braille display with 20 cells for reading digital text. USB and Bluetooth connectivity.',
        category: 'Visual Aids',
        price: 45000,
        discountedPrice: 38000,
        image: '/uploads/products/braille-display.png',
        stock: 10,
        specifications: '20-cell refreshable braille, USB-C, Bluetooth 5.0, 20-hour battery life',
        isAvailable: true,
    },
    {
        name: 'Knee Ankle Foot Orthosis (KAFO)',
        description: 'Custom-fit KAFO for lower limb support. Medical-grade polypropylene construction.',
        category: 'Orthotics & Prosthetics',
        price: 15000,
        discountedPrice: 12000,
        image: '/uploads/products/kafo.png',
        stock: 15,
        specifications: 'Medical-grade polypropylene, adjustable knee lock, padded calf band, lightweight',
        isAvailable: true,
    },
    {
        name: 'AAC Communication Board',
        description: 'Augmentative and Alternative Communication board for persons with speech and language disabilities.',
        category: 'Communication Devices',
        price: 6500,
        discountedPrice: 5200,
        image: '/uploads/products/aac-board.png',
        stock: 20,
        specifications: '12-inch touch screen, 500+ symbols, text-to-speech, durable case, 10-hour battery',
        isAvailable: true,
    },
    {
        name: 'Ergonomic Reacher Grabber',
        description: 'Extended reach grabber tool for persons with limited mobility. Helps pick up objects without bending.',
        category: 'Daily Living Aids',
        price: 750,
        discountedPrice: 600,
        image: '/uploads/products/reacher-grabber.png',
        stock: 50,
        specifications: 'Length: 32", jaw opening: 4", rotating head, magnetic tip, lightweight aluminum',
        isAvailable: true,
    },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✓ Connected to MongoDB');

        // Seed default admin
        const existingAdmin = await Admin.findOne({ email: 'admin@disability-cert.gov.in' });
        if (!existingAdmin) {
            await Admin.create({
                name: 'Chief Medical Officer',
                email: 'admin@disability-cert.gov.in',
                password: 'admin123456',
                institution: 'District Medical Board',
                designation: 'Chief Medical Officer',
            });
            console.log('✓ Default admin created (admin@disability-cert.gov.in / admin123456)');
        } else {
            console.log('• Admin already exists, skipping');
        }

        // Seed schemes
        const existingSchemes = await Scheme.countDocuments();
        if (existingSchemes === 0) {
            await Scheme.insertMany(seedSchemes);
            console.log(`✓ ${seedSchemes.length} schemes seeded`);
        } else {
            console.log(`• ${existingSchemes} schemes already exist, skipping`);
        }

        // Seed products
        const existingProducts = await Product.countDocuments();
        if (existingProducts === 0) {
            await Product.insertMany(seedProducts);
            console.log(`✓ ${seedProducts.length} products seeded`);
        } else {
            console.log(`• ${existingProducts} products already exist, skipping`);
        }

        console.log('\n✓ Seed complete');
        process.exit(0);
    } catch (error) {
        console.error('✗ Seed failed:', error.message);
        process.exit(1);
    }
};

seedData();
