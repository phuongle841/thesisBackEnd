const { PrismaClient } = require("@prisma/client");
const { randomIntFromInterval } = require("../utils/randomInterval");
const prisma = new PrismaClient();
async function seedProducts() {
  const input = [
    { id: 1, history: [] },
    { id: 2001, history: [] },
    { id: 3001, history: [] },
    { id: 3001, history: [] },
    { id: 4001, history: [] },
    { id: 5001, history: [] },
    { id: 6001, history: [] },
    { id: 7001, history: [] },
    { id: 8001, history: [] },
    { id: 9001, history: [] },
  ];

  input.map((record) => {
    let base = { upper: 20, lower: 10 };
    for (let i = 0; i < 10; i++) {
      let data = randomIntFromInterval(base.lower, base.upper);
      record.history.push(data);
      let trend = randomIntFromInterval(0, 1);
      for (const bound in base) {
        if (Object.prototype.hasOwnProperty.call(base, bound)) {
          base[bound] += 10;
        }
      }
    }
  });
}

async function main() {
  await seedProducts();
}
main();
