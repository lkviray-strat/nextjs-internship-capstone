import { queries } from "./queries";

async function main() {
  const users = await queries.users.getAllUsers();
  console.log("All users:", users);

  const liam = await queries.users.getUsersByEmail("liam@example.com");
  console.log("User with email:", liam);
}

main().catch((err) => {
  console.error("❌ Error running query:", err);
});
