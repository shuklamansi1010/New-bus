// src/assets/routesData.js

import kalpaDelhi from '../assets/1.jpeg';
import kinnaurDelhi from '../assets/1.webp';
import mcleodDelhi from '../assets/3.jpeg';
import spitiDelhi from '../assets/4.jpeg';
import kinnaurChd from '../assets/5.jpeg';
import kalpaChd from '../assets/6.jpeg';
import manaliDelhi from '../assets/7.webp';

export const himachalRoutes = [
  {
    frequency: 'Daily',
    origin: 'Kalpa',
    destination: 'Delhi',
    duration: '16 hours',
    distance: '620 km',
    majorStops: 'Rampur, Shimla, Chandigarh, Ambala, Panipat',
    price: 1180,
    image: kalpaDelhi,
    schedules: [
      { departure: '18:00', arrival: '10:00', busType: 'AC Seater (2+2)', operator: 'UrbanBus Express' },
      { departure: '20:00', arrival: '12:00', busType: 'AC Seater (2+2)', operator: 'UrbanBus Premium' },
    ],
  },
  {
    frequency: '3x per week',
    origin: 'Spiti Valley',
    destination: 'Delhi',
    duration: '20 hours',
    distance: '750 km',
    majorStops: 'Kaza, Manali, Kullu, Mandi, Chandigarh',
    price: 1280,
    image: spitiDelhi,
    schedules: [
      { departure: '16:00', arrival: '12:00', busType: 'AC Seater (2+2)', operator: 'UrbanBus Premium' },
    ],
  },
  {
    frequency: 'Daily',
    origin: 'McLeod Ganj',
    destination: 'Delhi',
    duration: '12 hours',
    distance: '475 km',
    majorStops: 'Dharamshala, Pathankot, Jalandhar, Ludhiana, Ambala',
    price: 1450,
    image: mcleodDelhi,
    schedules: [
      { departure: '20:00', arrival: '08:00', busType: 'AC Seater (2+2)', operator: 'UrbanBus Express' },
      { departure: '22:00', arrival: '10:00', busType: 'AC Seater (2+2)', operator: 'UrbanBus Standard' },
    ],
  },
  {
    frequency: 'Daily',
    origin: 'Manali',
    destination: 'Delhi',
    duration: '14 hours',
    distance: '540 km',
    majorStops: 'Kullu, Mandi, Chandigarh, Ambala',
    price: 1620,
    image: manaliDelhi,
    schedules: [
      { departure: '19:00', arrival: '09:00', busType: 'AC Seater (2+2)', operator: 'UrbanBus Express' },
    ],
  },
  {
    frequency: 'Daily',
    origin: 'Kinnaur',
    destination: 'Delhi',
    duration: '15 hours',
    distance: '600 km',
    majorStops: 'Rampur, Shimla, Chandigarh, Ambala',
    price: 1850,
    image: kinnaurDelhi,
    schedules: [
      { departure: '19:00', arrival: '10:00', busType: 'AC Seater (2+2)', operator: 'UrbanBus Express' },
    ],
  },
  {
    frequency: 'Daily',
    origin: 'Shimla',
    destination: 'Delhi',
    duration: '9 hours',
    distance: '350 km',
    majorStops: 'Solan, Chandigarh, Ambala, Panipat',
    price: 2050,
    image: manaliDelhi,
    schedules: [
      { departure: '22:00', arrival: '07:00', busType: 'AC Seater (2+2)', operator: 'UrbanBus Express' },
    ],
  },
  {
    frequency: 'Daily',
    origin: 'Kalpa',
    destination: 'Chandigarh',
    duration: '12 hours',
    distance: '370 km',
    majorStops: 'Rampur, Shimla, Solan, Panchkula',
    price: 2280,
    image: kalpaChd,
    schedules: [
      { departure: '07:00', arrival: '19:00', busType: 'AC Seater (2+2)', operator: 'UrbanBus Premium' },
    ],
  },
  {
    frequency: 'Daily',
    origin: 'Kinnaur',
    destination: 'Chandigarh',
    duration: '11 hours',
    distance: '350 km',
    majorStops: 'Rampur, Shimla, Solan',
    price: 2500,
    image: kinnaurChd,
    schedules: [
      { departure: '06:00', arrival: '17:00', busType: 'AC Seater (2+2)', operator: 'UrbanBus Express' },
    ],
  },
];

// === OFFERS DATA ADDED HERE ===
export const offers = [
  {
    title: 'First Ride Special',
    subtitle: 'Get 20% off on your first booking with UrbanBus',
    discount: '20% OFF',
    code: 'FIRST20',
    validUntil: '31/12/2025',
    minAmount: 500,
    maxSave: 300,
    terms: [
      'Valid only for first-time users',
      'Maximum discount of ₹300',
      'Valid on all routes',
      'Cannot be combined with other offers',
    ],
    category: 'New Users',
  },
  {
    title: 'Weekend Warrior',
    subtitle: 'Save ₹200 on weekend bookings',
    discount: '₹200 OFF',
    code: 'WEEKEND200',
    validUntil: '30/11/2025',
    minAmount: 800,
    maxSave: 200,
    terms: [
      'Valid on Saturday and Sunday travel only',
      'Minimum booking amount ₹800',
      'Valid on all routes',
      'Limited time offer',
    ],
    category: 'Weekend',
  },
  {
    title: 'Student Discount',
    subtitle: '15% off for students with valid ID',
    discount: '15% OFF',
    code: 'STUDENT15',
    validUntil: '31/12/2025',
    minAmount: 400,
    maxSave: 250,
    terms: [
      'Valid student ID required at boarding',
      'Maximum discount of ₹250',
      'Valid on all routes',
      'Age limit: Under 25 years',
    ],
    category: 'Students',
  },
  {
    title: 'Himachal Special',
    subtitle: 'Flat ₹300 off on all Himachal routes',
    discount: '₹300 OFF',
    code: 'HIMACHAL300',
    validUntil: '31/10/2025',
    minAmount: 1000,
    maxSave: 300,
    terms: [
      'Valid on Himachal Pradesh routes only',
      'Minimum booking amount ₹1000',
      'Cannot be combined with other offers',
      'Limited seats available',
    ],
    category: 'Seasonal',
  },
  {
    title: 'Super Saver',
    subtitle: '10% off on bookings above ₹1500',
    discount: '10% OFF',
    code: 'SUPERSAVE10',
    validUntil: '31/12/2025',
    minAmount: 1500,
    maxSave: 400,
    terms: [
      'Minimum booking amount ₹1500',
      'Maximum discount of ₹400',
      'Valid on all routes',
      'Valid for multiple bookings',
    ],
    category: 'All Offers',
  },
  {
    title: 'Early Bird Offer',
    subtitle: '₹150 off when you book 7 days in advance',
    discount: '₹150 OFF',
    code: 'EARLY150',
    validUntil: '31/12/2025',
    minAmount: 600,
    maxSave: 150,
    terms: [
      'Book at least 7 days before travel',
      'Minimum booking amount ₹600',
      'Valid on all routes',
      'Subject to seat availability',
    ],
    category: 'All Offers',
  },
];

export default himachalRoutes;