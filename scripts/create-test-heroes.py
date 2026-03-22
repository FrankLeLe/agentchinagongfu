#!/usr/bin/env python3
"""
AgentChinaGongFu 测试侠客生成脚本
生成测试侠客数据用于排行榜展示
"""

import sqlite3
import random
from datetime import datetime

DB_PATH = 'prisma/dev.db'

# 测试侠客列表
TEST_HEROES = [
    {'name': '令狐冲', 'mbti': 'INTJ', 'sect': '华山派', 'faction': 'traditional'},
    {'name': '张无忌', 'mbti': 'INFP', 'sect': '明教', 'faction': 'traditional'},
    {'name': '郭靖', 'mbti': 'ISFJ', 'sect': '丐帮', 'faction': 'traditional'},
    {'name': '杨过', 'mbti': 'INTP', 'sect': '古墓派', 'faction': 'traditional'},
    {'name': '乔峰', 'mbti': 'ESTJ', 'sect': '丐帮', 'faction': 'traditional'},
    {'name': '段誉', 'mbti': 'ENFP', 'sect': '逍遥派', 'faction': 'traditional'},
    {'name': '虚竹', 'mbti': 'INFJ', 'sect': '逍遥派', 'faction': 'traditional'},
    {'name': '东方不败', 'mbti': 'INTJ', 'sect': '日月神教', 'faction': 'demon'},
    {'name': '任我行', 'mbti': 'ENTJ', 'sect': '日月神教', 'faction': 'demon'},
    {'name': '左冷禅', 'mbti': 'ESTJ', 'sect': '嵩山派', 'faction': 'traditional'},
]

def create_test_heroes():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # 获取所有门派
    cursor.execute('SELECT id, name FROM Sect')
    sects = {name: id for id, name in cursor.fetchall()}
    
    print(f'📊 找到 {len(sects)} 个门派')
    
    for hero_data in TEST_HEROES:
        sect_id = sects.get(hero_data['sect'])
        if not sect_id:
            print(f'⚠️  未找到门派：{hero_data["sect"]}，使用华山派')
            sect_id = sects.get('华山派')
        
        # 随机生成属性
        power = random.randint(80, 120)
        attack = random.randint(80, 120)
        speed = random.randint(80, 120)
        defense = random.randint(80, 120)
        total_power = power + attack + speed + defense
        points = random.randint(0, 1000)
        
        # 生成唯一 userId
        user_id = f'test_{hero_data["name"]}_{random.randint(1000, 9999)}'
        
        try:
            cursor.execute('''
                INSERT INTO Hero (
                    id, userId, name, mbti, sectId, faction,
                    power, attack, speed, defense, totalPower, points,
                    createdAt, updatedAt
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                user_id, user_id, hero_data['name'], hero_data['mbti'],
                sect_id, hero_data['faction'],
                power, attack, speed, defense, total_power, points,
                datetime.now().isoformat(), datetime.now().isoformat()
            ))
            print(f'✅ 创建侠客：{hero_data["name"]} ({hero_data["sect"]}) - 战力：{total_power}')
        except Exception as e:
            print(f'⚠️  {hero_data["name"]} 创建失败：{e}')
    
    conn.commit()
    conn.close()
    print('\n🎉 测试侠客创建完成！')

if __name__ == '__main__':
    create_test_heroes()
