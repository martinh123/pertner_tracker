import { db } from '../client';
import { Partner } from '../../types';

export async function getAllPartners(): Promise<Partner[]> {
  const result = await db.execute('SELECT * FROM partners');
  return result.rows as Partner[];
}

export async function addPartner(partner: Omit<Partner, 'id' | 'dateAdded'>): Promise<Partner> {
  const id = crypto.randomUUID();
  const dateAdded = new Date().toISOString();
  
  await db.execute({
    sql: 'INSERT INTO partners (id, name, category, status, dateAdded) VALUES (?, ?, ?, ?, ?)',
    args: [id, partner.name, partner.category, partner.status, dateAdded]
  });

  return {
    id,
    dateAdded,
    ...partner
  };
}

export async function updatePartner(id: string, partner: Partial<Partner>): Promise<void> {
  const updates = [];
  const args = [];
  
  if (partner.name) {
    updates.push('name = ?');
    args.push(partner.name);
  }
  if (partner.category) {
    updates.push('category = ?');
    args.push(partner.category);
  }
  if (partner.status) {
    updates.push('status = ?');
    args.push(partner.status);
  }

  if (updates.length === 0) return;

  args.push(id);
  await db.execute({
    sql: `UPDATE partners SET ${updates.join(', ')} WHERE id = ?`,
    args
  });
}

export async function deletePartner(id: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM partners WHERE id = ?',
    args: [id]
  });
}