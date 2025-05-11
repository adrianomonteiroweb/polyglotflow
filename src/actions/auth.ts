"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export async function signUp(data: SignUpData) {
  try {
    const { name, email, password } = data;

    // Validate input
    if (!name || !email || !password) {
      throw new Error("Missing required fields");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password with a higher number of rounds for better security
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const result = await db
      .insert(users)
      .values({
        name,
        email,
        password_hash: passwordHash,
      })
      .returning();

    if (!result || result.length === 0) {
      throw new Error("Failed to create user");
    }

    console.log("User created successfully:", {
      email: result[0].email,
      hasPassword: !!result[0].password_hash,
    });
    return result[0];
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (user) {
      console.log("User found:", {
        email: user.email,
        hasPassword: !!user.password_hash,
      });
    }

    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}
