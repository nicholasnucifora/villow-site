// Generate a password for a password manager. Never accept human-chosen input:
// a fast digest is appropriate only for this independently random 256-bit key.
import { randomBytes, createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { isAbsolute, relative, sep } from 'node:path';
const destination = process.argv[2];
if (!destination || !isAbsolute(destination)) throw new Error('Choose an explicit private output file outside this repository. No credential was generated.');
const withinRepo = relative(fileURLToPath(new URL('../../', import.meta.url)), destination);
if (!withinRepo.startsWith('..' + sep) && !isAbsolute(withinRepo)) throw new Error('Keep credentials outside the source repository. No credential was generated.');
const password = randomBytes(32).toString('base64url');
const hash = createHash('sha256').update(password).digest('hex');
await writeFile(destination, `# Private generated credential. Store the password in your password manager.\n# Set only the hash as the Worker's MODERATION_PASSWORD_HASH secret.\nPASSWORD=${password}\nMODERATION_PASSWORD_HASH=${hash}\n`, { flag: 'wx', mode: 0o600 });
console.log(`Generated credentials in ${destination}. Save the password in your password manager, then remove the temporary file. No credentials were printed or uploaded.`);
