// @ts-check
import { readFile, realpathSync, writeFile } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { promisify } from 'node:util';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

/**
 * Resolve and validate that `filePath` stays within `baseDir`.
 * Prevents path-traversal attacks when this script is invoked by an AI agent.
 * @param {string} filePath - The untrusted path from CLI arguments.
 * @param {string} baseDir  - The allowed root directory.
 * @returns {string} The canonicalized, safe absolute path.
 */
function safePath(filePath, baseDir) {
  const resolved = realpathSync(filePath);
  const base = realpathSync(baseDir);
  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    throw new Error(`Path '${filePath}' is outside the allowed directory '${base}'`);
  }
  return resolved;
}

// Get the JSON file path from the command line arguments
const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error('Error: Please provide the path to the JSON file as the first argument.');
  process.exit(1);
}

// Validate the input path stays within the current working directory
const safeJsonPath = safePath(jsonPath, process.cwd());

// Read and parse the JSON file
const fileContent = await readFileAsync(safeJsonPath, 'utf8');
const entities = JSON.parse(fileContent);

const schemas = Object.entries(entities).reduce((acc, [name, model]) => {
  console.log(`Processing schema: '${name}'`);

  acc[name] = model.propertiesSchema;

  return acc;
}, {});

const output = JSON.stringify(schemas, null, '\t');

// Get the base name of the input file
const outputFileName = path.basename(safeJsonPath);
// Set the output path to the assets folder with the same file name
const outputPath = path.join(path.dirname(new URL(import.meta.url).pathname), '../assets/schemas', outputFileName);

await writeFileAsync(outputPath, output, 'utf8');
console.log(`Schemas extracted and saved to ${outputPath}`);
