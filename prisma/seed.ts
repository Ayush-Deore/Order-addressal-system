import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1. Create Admin User
  // Password: SecurePass123!
  const adminHash = bcrypt.hashSync('SecurePass123!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@door.catalog' },
    update: {
      role: 'ADMIN',
      passwordHash: adminHash
    },
    create: {
      email: 'admin@door.catalog',
      name: 'Super Admin',
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  })

  // 2. Create Client Users
  const clientHash = bcrypt.hashSync('client123!', 10);

  await prisma.user.upsert({
    where: { email: 'client@example.com' },
    update: {
      role: 'CLIENT',
      passwordHash: clientHash
    },
    create: {
      email: 'client@example.com',
      name: 'John Doe (Client)',
      passwordHash: clientHash,
      role: 'CLIENT',
    },
  })

  await prisma.user.upsert({
    where: { email: 'architect@studio.com' },
    update: {
      role: 'CLIENT',
      passwordHash: clientHash
    },
    create: {
      email: 'architect@studio.com',
      name: 'Sarah Architect',
      passwordHash: clientHash,
      role: 'CLIENT',
    },
  })

  // 2. Create Products
  const categories = ['Modern', 'Classic', 'Industrial', 'Minimalist']
  const materials = ['Oak', 'Walnut', 'Teak', 'Steel', 'Glass']
  const finishes = ['Matte', 'Gloss', 'Satin', 'Natural Oil']

  const products = [
    { name: 'Zenith Entry', code: 'D-001', cat: 'Modern' },
    { name: 'Royal Oak', code: 'D-002', cat: 'Classic' },
    { name: 'Steel Frame X', code: 'D-003', cat: 'Industrial' },
    { name: 'Pure White', code: 'D-004', cat: 'Minimalist' },
    { name: 'Glass Horizon', code: 'D-005', cat: 'Modern' },
    { name: 'Victorian Panel', code: 'D-006', cat: 'Classic' },
    { name: 'Loft slider', code: 'D-007', cat: 'Industrial' },
    { name: 'Hidden Door', code: 'D-008', cat: 'Minimalist' },
    { name: 'Pivot Grande', code: 'D-009', cat: 'Modern' },
    { name: 'Carved Teak', code: 'D-010', cat: 'Classic' },
    { name: 'Factory Exit', code: 'D-011', cat: 'Industrial' },
    { name: 'Flush Mat', code: 'D-012', cat: 'Minimalist' },
  ]

  for (const p of products) {
    await prisma.product.upsert({
      where: { designCode: p.code },
      update: {},
      create: {
        name: p.name,
        designCode: p.code,
        category: p.cat,
        material: [materials[Math.floor(Math.random() * materials.length)]],
        finish: [finishes[Math.floor(Math.random() * finishes.length)]],
        images: [`/doors/placeholder-${Math.floor(Math.random() * 4) + 1}.jpg`],
        description: `Premium ${p.cat.toLowerCase()} door with high-quality finish.`,
        isActive: true,
      },
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
