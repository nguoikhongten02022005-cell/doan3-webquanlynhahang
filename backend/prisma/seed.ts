import { PrismaClient, UserRole, TableAreaId, TableStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const TABLE_AREAS = [
  { id: TableAreaId.SANH_CHINH, name: 'Sảnh chính', total: 12, capacities: [2, 2, 4, 4, 4, 4, 6, 6, 6, 8, 8, 10], prefix: 'SC' },
  { id: TableAreaId.PHONG_VIP, name: 'Phòng VIP', total: 4, capacities: [8, 8, 10, 10], prefix: 'VIP' },
  { id: TableAreaId.BAN_CONG, name: 'Ban công', total: 6, capacities: [2, 2, 4, 4, 4, 6], prefix: 'BC' },
  { id: TableAreaId.QUAY_BAR, name: 'Quầy bar', total: 5, capacities: [1, 1, 2, 2, 2], prefix: 'BAR' },
] as const

const MENU_DISHES = [
  { id: 1, name: 'Bò Bít Tết Úc', description: 'Thịt bò Úc cao cấp nướng chín vừa, kèm khoai tây nghiền', price: 385000, category: 'Món Chính', badge: 'Best Seller', tone: 'tone-red', image: '/images/menu/bo-bit-tet-uc.jpg' },
  { id: 2, name: 'Cá Hồi Nướng Teriyaki', description: 'Phi lê cá hồi tươi nướng sốt Teriyaki đặc biệt', price: 295000, category: 'Món Chính', badge: 'Healthy', tone: 'tone-amber', image: '/images/menu/ca-hoi-teriyaki.jpg' },
  { id: 3, name: 'Gà Nướng Mật Ong', description: 'Đùi gà nướng mật ong thơm ngon, giòn ngoài mềm trong', price: 185000, category: 'Món Chính', badge: 'Popular', tone: 'tone-gold', image: '' },
  { id: 4, name: 'Mì Ý Hải Sản', description: 'Mì Ý sốt kem với tôm, mực, nghêu tươi ngon', price: 165000, category: 'Món Chính', badge: 'New', tone: 'tone-cool', image: '/images/menu/mi-y-hai-san.jpg' },
  { id: 5, name: 'Salad Caesar', description: 'Rau xà lách tươi, gà nướng, phô mai Parmesan, sốt Caesar', price: 95000, category: 'Khai Vị', badge: 'Light', tone: 'tone-green', image: '' },
  { id: 6, name: 'Súp Bí Đỏ', description: 'Súp bí đỏ kem mịn, hạt hạnh nhân rang giòn', price: 75000, category: 'Khai Vị', badge: 'Warm', tone: 'tone-amber', image: '' },
  { id: 7, name: 'Gỏi Cuốn Tôm Thịt', description: 'Gỏi cuốn tươi ngon với tôm, thịt, rau sống và bún', price: 65000, category: 'Khai Vị', badge: 'Fresh', tone: 'tone-mint', image: '' },
  { id: 8, name: 'Khoai Tây Chiên', description: 'Khoai tây chiên giòn rụm, kèm sốt tương ớt', price: 55000, category: 'Khai Vị', badge: 'Classic', tone: 'tone-gold', image: '' },
  { id: 9, name: 'Trà Đào Cam Sả', description: 'Trà đen pha đào tươi, cam và sả thơm mát', price: 55000, category: 'Đồ Uống', badge: 'Signature', tone: 'tone-amber', image: '/images/menu/tra-dao-cam-sa.jpg' },
  { id: 10, name: 'Sinh Tố Bơ', description: 'Sinh tố bơ sánh mịn, béo ngậy tự nhiên', price: 45000, category: 'Đồ Uống', badge: 'Creamy', tone: 'tone-green', image: '' },
  { id: 11, name: 'Cà Phê Sữa Đá', description: 'Cà phê phin truyền thống pha sữa đá mát lạnh', price: 35000, category: 'Đồ Uống', badge: 'Classic', tone: 'tone-brown', image: '' },
  { id: 12, name: 'Nước Ép Dưa Hấu', description: 'Nước ép dưa hấu tươi mát, không đường', price: 40000, category: 'Đồ Uống', badge: 'Fresh', tone: 'tone-red', image: '' },
  { id: 13, name: 'Tiramisu', description: 'Bánh Tiramisu Ý truyền thống với cà phê Espresso', price: 85000, category: 'Tráng Miệng', badge: 'Premium', tone: 'tone-brown', image: '' },
  { id: 14, name: 'Panna Cotta', description: 'Bánh Panna Cotta mềm mịn với sốt dâu tây', price: 75000, category: 'Tráng Miệng', badge: 'Sweet', tone: 'tone-violet', image: '' },
  { id: 15, name: 'Kem Vani', description: 'Kem vani tự làm với hạt vani Madagascar', price: 55000, category: 'Tráng Miệng', badge: 'Homemade', tone: 'tone-gold', image: '' },
  { id: 16, name: 'Combo Gia Đình', description: '2 món chính + 2 khai vị + 4 đồ uống + 1 tráng miệng', price: 899000, category: 'Combo', badge: 'Save 20%', tone: 'tone-amber', image: '' },
  { id: 17, name: 'Combo Couple', description: '2 món chính + 1 khai vị + 2 đồ uống', price: 499000, category: 'Combo', badge: 'Romantic', tone: 'tone-red', image: '' },
  { id: 18, name: 'Combo Solo', description: '1 món chính + 1 khai vị + 1 đồ uống', price: 249000, category: 'Combo', badge: 'Value', tone: 'tone-cool', image: '' },
] as const

async function main() {
  const [adminPassword, staffPassword, customerPassword] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('staff123', 10),
    bcrypt.hash('customer123', 10),
  ])

  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.bookingTable.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.table.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.voucher.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.createMany({
    data: [
      { fullName: 'Quản trị nhà hàng', username: 'admin', email: 'admin@nguyenvi.local', password: adminPassword, role: UserRole.admin },
      { fullName: 'Nhân viên vận hành', username: 'staff', email: 'staff@nguyenvi.local', password: staffPassword, role: UserRole.staff },
      { fullName: 'Nguyễn Văn A', username: 'nguyenvana', email: 'customer@example.com', password: customerPassword, role: UserRole.customer, phone: '0901234567' },
    ],
  })

  await prisma.table.createMany({
    data: TABLE_AREAS.flatMap((area) => Array.from({ length: area.total }, (_, index) => {
      const sequence = String(index + 1).padStart(2, '0')
      return {
        id: `${area.id}_${sequence}`,
        code: `${area.prefix}-${sequence}`,
        name: `${area.name} ${sequence}`,
        areaId: area.id,
        capacity: area.capacities[index] ?? area.capacities[area.capacities.length - 1] ?? 4,
        status: TableStatus.AVAILABLE,
        activeBookingCode: '',
        note: '',
      }
    })),
  })

  for (const dish of MENU_DISHES) {
    await prisma.menuItem.create({ data: dish })
  }

  await prisma.voucher.createMany({
    data: [
      { code: 'GIAM20K', amount: 20000 },
      { code: 'VIP50K', amount: 50000 },
    ],
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
