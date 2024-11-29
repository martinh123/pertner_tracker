// Using localStorage instead of SQLite for data persistence
export const db = {
  async execute(query: string, params?: any[]) {
    console.log('Query executed:', query, params);
    return { rows: [] };
  }
};

export async function initializeDatabase() {
  // No initialization needed for localStorage
  return Promise.resolve();
}