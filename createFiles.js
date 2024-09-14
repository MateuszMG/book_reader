const fs = require("fs");
const path = require("path");

const numberOfFiles = process.argv[2];

if (!numberOfFiles || isNaN(numberOfFiles)) {
  console.error(
    "Please provide a valid number of files as a command-line argument."
  );
  process.exit(1);
}

for (let i = 1; i <= numberOfFiles; i++) {
  const fileName = `v${i}.txt`;

  //   const fileContent = `{
  //   "text": ""
  // }
  // `;

  fs.writeFile(
    path.join(__dirname, "public", "books", "PsychologiaDlaBystrz", fileName),
    "", // fileContent
    (err) => {
      if (err) {
        console.error(`Error writing file ${fileName}:`, err);
      } else {
        console.log(`File ${fileName} created successfully.`);
      }
    }
  );
}

//usage
//  node createFiles.js 2
