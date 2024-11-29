import { db } from '../client';
import { PipelineData } from '../../types/pipeline';

export async function getAllPipelineData(): Promise<PipelineData[]> {
  const result = await db.execute('SELECT * FROM pipeline_data ORDER BY uploadDate DESC');
  return result.rows as PipelineData[];
}

export async function uploadPipelineData(data: PipelineData[]): Promise<void> {
  // Begin transaction
  await db.execute('BEGIN TRANSACTION');

  try {
    // Store existing opportunity names and IDs
    const existingOpps = await db.execute(
      'SELECT id, opportunityName FROM pipeline_data'
    );
    const existingOppsMap = new Map(
      existingOpps.rows.map((row: any) => [
        row.opportunityName.toLowerCase(),
        row.id
      ])
    );

    // Clear existing data while preserving IDs for matching opportunities
    await db.execute('DELETE FROM pipeline_data');

    // Insert new data
    for (const item of data) {
      const existingId = existingOppsMap.get(item.opportunityName.toLowerCase());
      const id = existingId || crypto.randomUUID();

      await db.execute({
        sql: `
          INSERT INTO pipeline_data (
            id, opportunityName, amount, closeDate, opportunityOwner,
            coSellingWith, rsmRegion, stage, parentRegion, aggregatedRegion,
            accountName, registeredPartner, endPartner, publicCloudTarget,
            platformTarget, currentStatus, fiscalPeriod, uploadDate
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          id, item.opportunityName, item.amount, item.closeDate,
          item.opportunityOwner, item.coSellingWith, item.rsmRegion,
          item.stage, item.parentRegion, item.aggregatedRegion,
          item.accountName, item.registeredPartner, item.endPartner,
          item.publicCloudTarget, item.platformTarget, item.currentStatus,
          item.fiscalPeriod, item.uploadDate
        ]
      });
    }

    // Commit transaction
    await db.execute('COMMIT');
  } catch (error) {
    // Rollback on error
    await db.execute('ROLLBACK');
    throw error;
  }
}