import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";

async function main() {
  const email = "admin@platform.com";
  const passwordHash = await bcrypt.hash("Admin123!", 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: "Super Admin",
      email,
      phone: "00000000",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });
  console.log("Super admin ready:", email);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());