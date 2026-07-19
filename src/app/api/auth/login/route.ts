import { NextRequest, NextResponse } from "next/server";
import { loginSchema, registerSchema } from "@/lib/validations";
import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";

// Demo users (in production, these would be in the database)
const users = [
  {
    id: "demo-admin",
    email: "admin@stadiumai.com",
    name: "Alex Morgan",
    role: "ADMIN",
    passwordHash: "$2b$12$LJ3UlGmGFMvFc.Rk8KMz4OJHbFJ0Z9Kxo8zN.W2eSZI8pPx3C1Aq6", // password: Admin123
  },
  {
    id: "demo-operator",
    email: "operator@stadiumai.com",
    name: "Sam Wilson",
    role: "OPERATOR",
    passwordHash: "$2b$12$LJ3UlGmGFMvFc.Rk8KMz4OJHbFJ0Z9Kxo8zN.W2eSZI8pPx3C1Aq6",
  },
  {
    id: "demo-fan",
    email: "fan@stadiumai.com",
    name: "Jordan Lee",
    role: "FAN",
    passwordHash: "$2b$12$LJ3UlGmGFMvFc.Rk8KMz4OJHbFJ0Z9Kxo8zN.W2eSZI8pPx3C1Aq6",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Find user
    const user = users.find((u) => u.email === email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // For demo, accept any password with 6+ chars
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate tokens
    const tokenPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
    });

    // Set refresh token as httpOnly cookie
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
