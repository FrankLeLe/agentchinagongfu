#!/usr/bin/env node
/**
 * 修复 SQLite 数据库中 DateTime 字段格式问题
 * 
 * 问题：Prisma 生成的数据使用 ISO 8601 带微秒格式 (2026-03-22T16:47:11.819659)
 * 但 SQLite 的 DATETIME 类型期望标准格式 (2026-03-22 16:47:11)
 * 
 * 这导致 Prisma Client 查询时报错：
 * "Inconsistent column data: Conversion failed: input contains invalid characters"
 */

const { execSync } = require('child_process');
const path = require('path');

const dbPath = path.join(__dirname, '../prisma/dev.db');

console.log('Fixing DateTime format in database:', dbPath);

const tables = [
  'Hero',
  'Battle',
  'PointTransaction',
  'ChatMessage',
  'GiftTransaction',
  'Relationship',
  'PlayerSkill',
];

tables.forEach(table => {
  try {
    // 修复 createdAt 字段
    execSync(`sqlite3 "${dbPath}" "UPDATE ${table} SET createdAt = datetime(createdAt) WHERE createdAt IS NOT NULL;"`);
    console.log(`✓ Fixed ${table}.createdAt`);
  } catch (e) {
    console.log(`- ${table} has no createdAt field`);
  }
  
  try {
    // 修复 updatedAt 字段
    execSync(`sqlite3 "${dbPath}" "UPDATE ${table} SET updatedAt = datetime(updatedAt) WHERE updatedAt IS NOT NULL;"`);
    console.log(`✓ Fixed ${table}.updatedAt`);
  } catch (e) {
    console.log(`- ${table} has no updatedAt field`);
  }
  
  try {
    // 修复 purchasedAt 字段
    execSync(`sqlite3 "${dbPath}" "UPDATE ${table} SET purchasedAt = datetime(purchasedAt) WHERE purchasedAt IS NOT NULL;"`);
    console.log(`✓ Fixed ${table}.purchasedAt`);
  } catch (e) {
    console.log(`- ${table} has no purchasedAt field`);
  }
});

console.log('\n✓ DateTime format fix completed!');
