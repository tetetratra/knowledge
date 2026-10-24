import { execFileSync } from 'node:child_process';

export function noteUpdateTimes(cwd = process.cwd()) {
  const log = execFileSync('git', ['log', '--format=commit:%ct', '--name-only', '-z', '--no-renames', '--', 'notes'], {
    cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
  });
  const updated = new Map();
  let timestamp;
  for (const entry of log.split('\0')) {
    const value = entry.replace(/^\n+|\n+$/g, '');
    if (/^commit:\d+$/.test(value)) timestamp = Number(value.slice(7));
    else if (value.startsWith('notes/') && !updated.has(value.normalize('NFC'))) updated.set(value.normalize('NFC'), timestamp);
  }
  return updated;
}
