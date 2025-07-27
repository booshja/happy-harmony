import { Prisma, PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
    {
        email: "jacobandesdev@gmail.com",
        name: "Jacob",
        username: "jacobandes",
    },
    {
        email: "jacobdevbot@gmail.com",
        name: "Jacornonthecob",
        username: "Jacobdevbot",
    },
];

export async function main() {
    for (const u of userData) {
        await prisma.user.create({ data: u });
    }
}

void main();
