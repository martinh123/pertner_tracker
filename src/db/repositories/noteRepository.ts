import { db } from '../client';
import { Note } from '../../types/notes';

export async function getNotesByOpportunityId(opportunityId: string): Promise<Note[]> {
  const result = await db.execute({
    sql: 'SELECT * FROM notes WHERE opportunityId = ? ORDER BY createdAt DESC',
    args: [opportunityId]
  });
  return result.rows as Note[];
}

export async function addNote(
  opportunityId: string,
  content: string,
  hasAction: boolean
): Promise<Note> {
  const note: Note = {
    id: crypto.randomUUID(),
    opportunityId,
    content,
    hasAction,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await db.execute({
    sql: 'INSERT INTO notes (id, opportunityId, content, hasAction, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    args: [note.id, note.opportunityId, note.content, note.hasAction, note.createdAt, note.updatedAt]
  });

  return note;
}

export async function updateNote(
  noteId: string,
  content: string,
  hasAction: boolean
): Promise<void> {
  const updatedAt = new Date().toISOString();
  
  await db.execute({
    sql: 'UPDATE notes SET content = ?, hasAction = ?, updatedAt = ? WHERE id = ?',
    args: [content, hasAction, updatedAt, noteId]
  });
}

export async function deleteNote(noteId: string): Promise<void> {
  await db.execute({
    sql: 'DELETE FROM notes WHERE id = ?',
    args: [noteId]
  });
}