import { db } from '../client';
import { Initiative } from '../../types/initiative';

export async function getAllInitiatives(): Promise<Initiative[]> {
  const result = await db.execute('SELECT * FROM initiatives ORDER BY createdAt DESC');
  return result.rows as Initiative[];
}

export async function addInitiative(
  initiative: Omit<Initiative, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Initiative> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  await db.execute({
    sql: `
      INSERT INTO initiatives (
        id, partner, project, targetQuarter, hpeOwner,
        partnerOwner, hpeResource, partnerResource, role,
        createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
      id, initiative.partner, initiative.project, initiative.targetQuarter,
      initiative.hpeOwner, initiative.partnerOwner, initiative.hpeResource,
      initiative.partnerResource, initiative.role, now, now
    ]
  });

  return {
    id,
    ...initiative,
    createdAt: now,
    updatedAt: now
  };
}

export async function updateInitiative(
  id: string,
  initiative: Partial<Initiative>
): Promise<void> {
  const updates = [];
  const args = [];
  
  if (initiative.partner) {
    updates.push('partner = ?');
    args.push(initiative.partner);
  }
  if (initiative.project) {
    updates.push('project = ?');
    args.push(initiative.project);
  }
  if (initiative.targetQuarter) {
    updates.push('targetQuarter = ?');
    args.push(initiative.targetQuarter);
  }
  if (initiative.hpeOwner) {
    updates.push('hpeOwner = ?');
    args.push(initiative.hpeOwner);
  }
  if (initiative.partnerOwner) {
    updates.push('partnerOwner = ?');
    args.push(initiative.partnerOwner);
  }
  if (initiative.hpeResource) {
    updates.push('hpeResource = ?');
    args.push(initiative.hpeResource);
  }
  if (initiative.partnerResource) {
    updates.push('partnerResource = ?');
    args.push(initiative.partnerResource);
  }
  if (initiative.role) {
    updates.push('role = ?');
    args.push(initiative.role);
  }

  if (updates.length === 0) return;

  updates.push('updatedAt = ?');
  args.push(new Date().toISOString());
  args.push(id);

  await db.execute({
    sql: `UPDATE initiatives SET ${updates.join(', ')} WHERE id = ?`,
    args
  });
}

export async function deleteInitiative(id: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM initiatives WHERE id = ?',
    args: [id]
  });
}