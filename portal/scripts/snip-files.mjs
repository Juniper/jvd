import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";

export function confinedPath(root, file, { allowMissing = false } = {}) {
  const base = fs.realpathSync(root);
  const target = path.resolve(base, file);
  const relative = path.relative(base, target);
  assert.ok(
    relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative),
    "Path escapes the selected root",
  );
  const parts = relative ? relative.split(path.sep) : [];
  let current = base;
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part);
    let stat;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      if (error.code === "ENOENT" && allowMissing && index === parts.length - 1) return target;
      throw error;
    }
    assert.ok(!stat.isSymbolicLink(), `Symbolic links are not allowed: ${current}`);
    assert.ok(
      index === parts.length - 1 ? stat.isFile() || stat.isDirectory() : stat.isDirectory(),
      `Unsupported file type: ${current}`,
    );
  }
  return target;
}

export function readConfinedFile(root, file, encoding) {
  const target = confinedPath(root, file);
  const descriptor = fs.openSync(target, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW);
  try {
    assert.ok(fs.fstatSync(descriptor).isFile(), `Expected a regular file: ${target}`);
    return fs.readFileSync(descriptor, encoding);
  } finally {
    fs.closeSync(descriptor);
  }
}

export function writeConfinedFile(root, file, text, { expectedText } = {}) {
  const base = fs.realpathSync(root);
  const target = confinedPath(base, file, { allowMissing: true });
  const parent = path.dirname(target);
  const temporary = path.join(parent, `.snip-${crypto.randomUUID()}.tmp`);
  let descriptor;
  let created = false;
  try {
    let original;
    try {
      original = fs.lstatSync(target);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    assert.ok(!original || original.isFile(), `Expected a regular output file: ${target}`);
    if (expectedText !== undefined)
      assert.equal(
        readConfinedFile(base, target, "utf8"),
        expectedText,
        `File changed during generation: ${target}`,
      );
    descriptor = fs.openSync(
      temporary,
      fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_EXCL | fs.constants.O_NOFOLLOW,
      original ? original.mode & 0o777 : 0o644,
    );
    created = true;
    fs.writeFileSync(descriptor, text);
    fs.fsyncSync(descriptor);
    fs.closeSync(descriptor);
    descriptor = undefined;
    confinedPath(base, temporary);
    confinedPath(base, target, { allowMissing: true });
    if (expectedText !== undefined)
      assert.equal(
        readConfinedFile(base, target, "utf8"),
        expectedText,
        `File changed during generation: ${target}`,
      );
    fs.renameSync(temporary, target);
    created = false;
  } finally {
    if (descriptor !== undefined) fs.closeSync(descriptor);
    if (created) fs.unlinkSync(confinedPath(base, temporary));
  }
}
