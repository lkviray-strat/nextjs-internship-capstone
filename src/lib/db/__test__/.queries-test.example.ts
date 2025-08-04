import "dotenv/config";

// Copy this file to `queries-test.ts` to run manual tests
// cp src/lib/db/__test__/.queries-test.example.ts src/lib/db/__test__/queries-test.ts

async function main() {
  console.log("Running sample queries...");
  // Enter your queries below ===========================

  // Uncomment the queries you want to run
  // const users = await queries.users.getAllUsers();
  // console.log("All users:", users);

  // const liam = await queries.users.getUsersByEmail("liam@example.com");
  // console.log("User with email:", liam);

  // ====================================================
  console.log("Sample queries completed successfully!");
}

main().catch((err) => {
  console.error("❌ Error running query:", err);
});
