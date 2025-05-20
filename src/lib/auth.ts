import jwt from "jsonwebtoken";

export function verifyToken(authorization?: string) {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error("Missing or malformed token");
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as {
      id: string;
      email: string;
    };
    return decoded;
  } catch {
    throw new Error("Invalid token");
  }
}
