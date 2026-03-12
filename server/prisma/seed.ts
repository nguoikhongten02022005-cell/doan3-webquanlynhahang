import { PrismaClient, UserRole, UserStatus, TableStatus, VoucherDiscountType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const TABLE_AREAS = [
  { id: 'SANH_CHINH', name: 'Sảnh chính', description: 'Khu vực trung tâm nhà hàng', total: 12, capacities: [2, 2, 4, 4, 4, 4, 6, 6, 6, 8, 8, 10], prefix: 'SC' },
  { id: 'PHONG_VIP', name: 'Phòng VIP', description: 'Không gian riêng tư cho khách VIP', total: 4, capacities: [8, 8, 10, 10], prefix: 'VIP' },
  { id: 'BAN_CONG', name: 'Ban công', description: 'Khu vực ngoài trời thoáng mát', total: 6, capacities: [2, 2, 4, 4, 4, 6], prefix: 'BC' },
  { id: 'QUAY_BAR', name: 'Quầy bar', description: 'Khu vực quầy bar và bàn cao', total: 5, capacities: [1, 1, 2, 2, 2], prefix: 'BAR' },
] as const

const taoSlug = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/đ/g, 'd')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

const MENU_DISHES = [
  { name: 'Bò Bít Tết Úc', description: 'Thịt bò Úc cao cấp nướng chín vừa, kèm khoai tây nghiền', price: 385000, category: 'Món Chính', badge: 'Best Seller', tone: 'tone-red', image: '/images/menu/bo-bit-tet-uc.jpg' },
  { name: 'Cá Hồi Nướng Teriyaki', description: 'Phi lê cá hồi tươi nướng sốt Teriyaki đặc biệt', price: 295000, category: 'Món Chính', badge: 'Healthy', tone: 'tone-amber', image: '/images/menu/ca-hoi-teriyaki.jpg' },
  { name: 'Gà Nướng Mật Ong', description: 'Đùi gà nướng mật ong thơm ngon, giòn ngoài mềm trong', price: 185000, category: 'Món Chính', badge: 'Popular', tone: 'tone-gold', image: '' },
  { name: 'Mì Ý Hải Sản', description: 'Mì Ý sốt kem với tôm, mực, nghêu tươi ngon', price: 165000, category: 'Món Chính', badge: 'New', tone: 'tone-cool', image: '/images/menu/mi-y-hai-san.jpg' },
  { name: 'Salad Caesar', description: 'Rau xà lách tươi, gà nướng, phô mai Parmesan, sốt Caesar', price: 95000, category: 'Khai Vị', badge: 'Light', tone: 'tone-green', image: '' },
  { name: 'Súp Bí Đỏ', description: 'Súp bí đỏ kem mịn, hạt hạnh nhân rang giòn', price: 75000, category: 'Khai Vị', badge: 'Warm', tone: 'tone-amber', image: '' },
  { name: 'Gỏi Cuốn Tôm Thịt', description: 'Gỏi cuốn tươi ngon với tôm, thịt, rau sống và bún', price: 65000, category: 'Khai Vị', badge: 'Fresh', tone: 'tone-mint', image: '' },
  { name: 'Khoai Tây Chiên', description: 'Khoai tây chiên giòn rụm, kèm sốt tương ớt', price: 55000, category: 'Khai Vị', badge: 'Classic', tone: 'tone-gold', image: '' },
  { name: 'Trà Đào Cam Sả', description: 'Trà đen pha đào tươi, cam và sả thơm mát', price: 55000, category: 'Đồ Uống', badge: 'Signature', tone: 'tone-amber', image: '/images/menu/tra-dao-cam-sa.jpg' },
  { name: 'Sinh Tố Bơ', description: 'Sinh tố bơ sánh mịn, béo ngậy tự nhiên', price: 45000, category: 'Đồ Uống', badge: 'Creamy', tone: 'tone-green', image: '' },
  { name: 'Cà Phê Sữa Đá', description: 'Cà phê phin truyền thống pha sữa đá mát lạnh', price: 35000, category: 'Đồ Uống', badge: 'Classic', tone: 'tone-brown', image: '' },
  { name: 'Nước Ép Dưa Hấu', description: 'Nước ép dưa hấu tươi mát, không đường', price: 40000, category: 'Đồ Uống', badge: 'Fresh', tone: 'tone-red', image: '' },
  { name: 'Tiramisu', description: 'Bánh Tiramisu Ý truyền thống với cà phê Espresso', price: 85000, category: 'Tráng Miệng', badge: 'Premium', tone: 'tone-brown', image: '' },
  { name: 'Panna Cotta', description: 'Bánh Panna Cotta mềm mịn với sốt dâu tây', price: 75000, category: 'Tráng Miệng', badge: 'Sweet', tone: 'tone-violet', image: '' },
  { name: 'Kem Vani', description: 'Kem vani tự làm với hạt vani Madagascar', price: 55000, category: 'Tráng Miệng', badge: 'Homemade', tone: 'tone-gold', image: '' },
  { name: 'Combo Gia Đình', description: '2 món chính + 2 khai vị + 4 đồ uống + 1 tráng miệng', price: 899000, category: 'Combo', badge: 'Save 20%', tone: 'tone-amber', image: '' },
  { name: 'Combo Couple', description: '2 món chính + 1 khai vị + 2 đồ uống', price: 499000, category: 'Combo', badge: 'Romantic', tone: 'tone-red', image: '' },
  { name: 'Combo Solo', description: '1 món chính + 1 khai vị + 1 đồ uống', price: 249000, category: 'Combo', badge: 'Value', tone: 'tone-cool', image: '' },
] as const

async function main() {
  const [adminPassword, staffPassword, customerPassword] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('staff123', 10),
    bcrypt.hash('customer123', 10),
  ])

  await prisma.refreshToken.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.bookingTable.deleteMany()
  await prisma.booking.deleteMany()
  await prisma.table.deleteMany()
  await prisma.tableArea.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.voucher.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.createMany({
    data: [
      { fullName: 'Quản trị nhà hàng', username: 'admin', email: 'admin@nguyenvi.local', password: adminPassword, role: UserRole.admin, status: UserStatus.ACTIVE },
      { fullName: 'Nhân viên vận hành', username: 'staff', email: 'staff@nguyenvi.local', password: staffPassword, role: UserRole.staff, status: UserStatus.ACTIVE },
      { fullName: 'Nguyễn Văn A', username: 'nguyenvana', email: 'customer@example.com', password: customerPassword, role: UserRole.customer, status: UserStatus.ACTIVE, phone: '0901234567' },
    ],
  })

  await prisma.tableArea.createMany({
    data: TABLE_AREAS.map((area) => ({
      id: area.id,
      name: area.name,
      description: area.description,
    })),
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
    await prisma.menuItem.create({ data: { ...dish, slug: taoSlug(dish.name) } })
  }

  await prisma.voucher.createMany({
    data: [
      {
        code: 'GIAM20K',
        name: 'Giảm 20K',
        description: 'Giảm trực tiếp 20.000đ cho mọi đơn đủ điều kiện.',
        discountType: VoucherDiscountType.FIXED,
        discountValue: 20000,
        minOrderAmount: 0,
        isActive: true,
      },
      {
        code: 'VIP50K',
        name: 'VIP 50K',
        description: 'Giảm 50.000đ cho đơn từ 300.000đ.',
        discountType: VoucherDiscountType.FIXED,
        discountValue: 50000,
        minOrderAmount: 300000,
        usageLimit: 100,
        isActive: true,
      },
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
