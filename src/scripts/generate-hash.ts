import bcrypt from "bcryptjs";

async function generateHash() {
  const password = "123456";
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(password, salt);

  console.log("Password:", password);
  console.log("Generated hash:", hash);

  // Test the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log("Hash is valid:", isValid);
}

generateHash().catch(console.error);
