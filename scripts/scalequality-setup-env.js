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
 * never fails your install. If it cannot find a value, the application still
 * starts and its log names the variable that is missing.
 *
 * Once you have rotated these credentials you can delete this file and the
 * "postinstall" line in package.json.
 */
'use strict';

const { execFileSync } = require('child_process');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const VARS = [
    {
        "name": "API_SECRET",
        "file": "src/config.ts",
        "identifier": "API_SECRET",
        "digest": "2388863ddbcd"
    }
];

function git(args) {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

function isIdentChar(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c === '_' || c === '$';
}

function isBlank(c) {
    return c === ' ' || c === String.fromCharCode(9);
}

// Every literal assigned to `identifier` on the line, without regexes: the
// name as a whole word, then ':', '=', ':=' or '=>', then a quote right after.
// Anything else after the separator (a call, process.env.X) is not a literal.
function literalsOnLine(line, identifier) {
    const found = [];
    for (let at = line.indexOf(identifier); at >= 0; at = line.indexOf(identifier, at + 1)) {
        if (at > 0 && isIdentChar(line.charAt(at - 1))) continue;
        let i = at + identifier.length;
        if (i < line.length && isIdentChar(line.charAt(i))) continue;
        while (i < line.length && (line.charAt(i) === '"' || line.charAt(i) === "'" || line.charAt(i) === ']')) i++;
        while (i < line.length && isBlank(line.charAt(i))) i++;
        const two = line.slice(i, i + 2);
        if (two === ':=' || two === '=>') i += 2;
        else if ((line.charAt(i) === ':' || line.charAt(i) === '=') && line.charAt(i + 1) !== '=') i += 1;
        else continue;
        while (i < line.length && isBlank(line.charAt(i))) i++;
        const q = line.charAt(i);
        if (q !== '"' && q !== "'" && q !== '`') continue;
        const end = line.indexOf(q, i + 1);
        if (end > i + 1) found.push(line.slice(i + 1, end));
    }
    return found;
}

function digestOf(value) {
    return crypto.createHash('sha256').update(value).digest('hex').slice(0, 12);
}

// Newest first: the last commit where the file still carried the literal. Only
// a literal with the recorded digest is taken, never another one of that name.
function findInHistory(file, identifier, digest) {
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
            const candidates = literalsOnLine(fileLines[j], identifier);
            for (let k = 0; k < candidates.length; k++) {
                if (digestOf(candidates[k]) === digest) return candidates[k];
            }
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
        const value = findInHistory(v.file, v.identifier, v.digest);
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
    // Never break an install. The application's log names what is missing.
}
