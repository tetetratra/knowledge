import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { noteUpdateTimes } from './note-dates.mjs';

test('ファイル取得時刻に依存せず、空白と日本語を含む記事の最終変更をGitから取得する',()=>{
  const cwd=mkdtempSync(path.join(tmpdir(),'knowledge-dates-'));
  const git=(...args)=>execFileSync('git',args,{cwd,stdio:'pipe'});
  const commit=(date)=>execFileSync('git',['-c','user.name=テスト','-c','user.email=test@example.com','commit','-m','検証'],{cwd,stdio:'pipe',env:{...process.env,GIT_AUTHOR_DATE:date,GIT_COMMITTER_DATE:date}});
  try {
    git('init');mkdirSync(path.join(cwd,'notes'));
    writeFileSync(path.join(cwd,'notes','日本語 note.md'),'初版');
    writeFileSync(path.join(cwd,'notes','old.md'),'初版');
    git('add','.');commit('2000-01-01T00:00:00Z');
    writeFileSync(path.join(cwd,'notes','日本語 note.md'),'更新');
    git('add','.');commit('2001-01-01T00:00:00Z');
    const dates=noteUpdateTimes(cwd);
    assert.equal(dates.get('notes/日本語 note.md'),978307200);
    assert.equal(dates.get('notes/old.md'),946684800);
  } finally {rmSync(cwd,{recursive:true,force:true});}
});
