import { writeFile, readFile } from "fs/promises";

try {
  const money = JSON.parse((await readFile("../../docs/_data/money.json")).toString());
  const content = JSON.stringify({
    updated: new Date(),
    lastEntry: new Date(),
    money,
  });
  console.log(content);
  await writeFile("../../docs/_data/money_compiled.json", content);
} catch (error) {
  console.error(error);
} finally {
}
