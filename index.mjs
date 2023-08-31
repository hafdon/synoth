import parser from "xml2json";

import { readdirSync, readFileSync } from "node:fs";

const adjectiveKeys = ["sgNom", "sgGenMasc", "sgGenFem", "plNom", "graded"];
const forms = [];
const vowelRegex = /[aáeéiíoóuú]+/gi;
const counter = new Map();

function parseVerb(json) {
  const { verb } = json;

  // console.log(verb);

  if (verb) {
    if (verb.verbalNoun?.default) {
      forms.push(verb.verbalNoun.default.toLowerCase());
    }
    if (verb.verbalAdjective?.default) {
      forms.push(verb.verbalAdjective.default.toLowerCase());
    }
    if (verb.tenseForm) {
      for (const el of verb.tenseForm) {
        if (el.default) {
          const str = el.default.toLowerCase();
          forms.push(str);
        }
      }
    }
    if (verb.moodForm) {
      for (const el of verb.moodForm) {
        if (el.default) {
          const str = el.default.toLowerCase();
          forms.push(str);
        }
      }
    }
  }
}

function parseAdj(json) {
  const { adjective } = json;

  if (adjective) {
    // forms.push(adjective.default.toLowerCase());
    for (const key of adjectiveKeys) {
      if (key in adjective) {
        const str = adjective[key].default.toLowerCase();
        forms.push(str);
        if (str.includes("úúi")) {
          console.log(adjective);
        }
      }
    }
  }
}

try {
  const files = await readdirSync("./adjective/");
  // const json = parser.toJson(xml);
  let i = 0;
  for (const file of files) {
    // if (i > 3000) {
    //   break;
    // }
    const readData = readFileSync(`./adjective/${file}`, "utf8");
    parseAdj(JSON.parse(parser.toJson(readData)));
    i++;
  }
  console.log(forms.length);
  for (const f of forms) {
    // console.log("global used? " + vowelRegex.global);
    // console.log(vowelRegex.exec(f));
    const matches = f.match(vowelRegex);
    // console.log(f);
    for (const m of matches) {
      if (!counter.has(m)) {
        counter.set(m, 1);
      } else {
        counter.set(m, counter.get(m) + 1);
      }
    }
  }

  const sorted = [...counter.entries()].sort((a, b) => b[1] - a[1]);
  console.log(sorted);
} catch (err) {
  console.error(err);
}

try {
  const DIR_PATH = "./verb/";
  const files = await readdirSync(DIR_PATH);
  // const json = parser.toJson(xml);
  let i = 0;
  for (const file of files) {
    // if (i > 2) {
    //   break;
    // }
    const readData = readFileSync(`${DIR_PATH}${file}`, "utf8");
    parseVerb(JSON.parse(parser.toJson(readData)));
    i++;
  }
  console.log(forms.length);
  for (const f of forms) {
    // console.log("global used? " + vowelRegex.global);
    // console.log(vowelRegex.exec(f));
    const matches = f.match(vowelRegex);
    // console.log(f);
    for (const m of matches) {
      if (!counter.has(m)) {
        counter.set(m, 1);
      } else {
        counter.set(m, counter.get(m) + 1);
      }
    }
  }

  const sorted = [...counter.entries()].sort((a, b) => b[1] - a[1]);
  console.log(sorted);
} catch (err) {
  console.error(err);
}

// const xml = '<foo attr="value">bar</foo>';
// console.log("input -> %s", xml);

// xml to json

// console.log("to json -> %s", json);

// json to xml
// const xml = parser.toXml(json);
// console.log("back to xml -> %s", xml);

// const FILE_PATH = "./adjective/ábalta_adj3.xml";

// let stream = fs.createReadStream("./adjective/ábalta_adj3.xml");

// stream.on("data", function (data) {
//   var chunk = data.toString();
//   console.log(chunk);
// });

// const readData = fs.readFileSync(FILE_PATH, "utf8");
// console.log(readData);
