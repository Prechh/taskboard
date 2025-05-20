import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Vérifier si email existe déjà
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json(
      { error: "Cet email est déjà utilisé." },
      { status: 400 }
    );
  }

  // Hasher mot de passe
  const hashedPassword = await hash(password, 10);

  // Créer user
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  return NextResponse.json({
    id: newUser.id,
    email: newUser.email,
  });
}
