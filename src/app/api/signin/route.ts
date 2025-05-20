// src/app/api/signin/route.ts

import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json(
      { error: "Utilisateur non trouvé" },
      { status: 401 }
    );
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    return NextResponse.json(
      { error: "Mot de passe incorrect" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.NEXTAUTH_SECRET!,
    { expiresIn: "1h" }
  );

  return NextResponse.json({ token }, { status: 200 });
}
