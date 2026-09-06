#!/usr/bin/env node
/**
 * Writes .env with the values that used to be hardcoded in this repository.
 *
 * ScaleQuality moved those values out of the source code so they would stop
 * being committed. They are still in this repository's git history, so this
 * script reads them from there and writes them into .env, which is gitignored.
 * Nothing to look up, nothing to paste.
 *
 * Safe to run at any time: it never overwrites a value you already set, and it
 * never fails your install. If it cannot find a value, the application's own
 * startup guard is what tells you which variable is missing.
 *
 * Once you have rotated these credentials you can delete this file and the
 * "postinstall" line in package.json.
 */
'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VARS = [
    {
        "name": "API_SECRET",
        "file": "src/config.ts",
        "identifier": "API_SECRET"
    }
];

function git(args) {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

// The value of `identifier` on the line that assigns it, without regexes:
// find the name, step past the ':' or '=', take what is between the quotes.
function valueOnLine(line, identifier) {
    const at = line.indexOf(identifier);
    if (at < 0) return null;
    const rest = line.slice(at + identifier.length);
    const eq = rest.indexOf('=');
    const colon = rest.indexOf(':');
    let sep = -1;
    if (eq >= 0 && colon >= 0) sep = Math.min(eq, colon);
    else if (eq >= 0) sep = eq;
    else sep = colon;
    if (sep < 0) return null;
    const tail = rest.slice(sep + 1);
    const quotes = ['"', "'", '`'];
    for (let i = 0; i < quotes.length; i++) {
        const q = quotes[i];
        const start = tail.indexOf(q);
        if (start < 0) continue;
        const end = tail.indexOf(q, start + 1);
        if (end > start + 1) return tail.slice(start + 1, end);
    }
    return null;
}

// Newest first: the last commit where the file still carried the literal.
function findInHistory(file, identifier) {
    const out = git(['log', '--format=%H', '--', file]);
    const shas = out.split(String.fromCharCode(10)).filter(Boolean);
    for (let i = 0; i < shas.length; i++) {
        let content;
        try {
            content = git(['show', shas[i] + ':' + file]);
        } catch (e) {
            continue;
        }
        const fileLines = content.split(String.fromCharCode(10));
        for (let j = 0; j < fileLines.length; j++) {
            const found = valueOnLine(fileLines[j], identifier);
            if (found) return found;
        }
    }
    return null;
}

function alreadySet(current, name) {
    const rows = current.split(String.fromCharCode(10));
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i].trim();
        if (row.indexOf(name + '=') === 0) return true;
    }
    return false;
}

try {
    const envPath = path.join(process.cwd(), '.env');
    const current = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const written = [];
    for (let i = 0; i < VARS.length; i++) {
        const v = VARS[i];
        if (alreadySet(current, v.name)) continue;
        const value = findInHistory(v.file, v.identifier);
        if (value) written.push(v.name + '=' + value);
    }
    if (written.length) {
        const nl = String.fromCharCode(10);
        const needsBreak = current.length > 0 && current.charAt(current.length - 1) !== nl;
        const block = written.join(nl) + nl;
        if (current.length > 0) fs.appendFileSync(envPath, (needsBreak ? nl : '') + block);
        else fs.writeFileSync(envPath, block);
        console.log('[scalequality] wrote ' + written.length + ' value(s) into .env, read back from git history');
    }
} catch (e) {
    // Never break an install. The application's own guard names what is missing.
}
