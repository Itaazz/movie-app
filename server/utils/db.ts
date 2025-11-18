import fs from 'fs/promises'
import path from 'path'

/**
 * Lit les données d'un fichier JSON
 */
export async function readJsonFile<T>(filename: string): Promise<T> {
  try {
    const filePath = path.join(process.cwd(), 'server', 'data', filename)
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error(`Erreur lors de la lecture du fichier ${filename}:`, error)
    return [] as T
  }
}

/**
 * Écrit des données dans un fichier JSON
 */
export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), 'server', 'data', filename)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (error) {
    console.error(`Erreur lors de l'écriture du fichier ${filename}:`, error)
    throw error
  }
}

/**
 * Génère un nouvel ID unique pour une collection
 */
export function generateId<T extends { id: number }>(items: T[]): number {
  if (items.length === 0) return 1
  return Math.max(...items.map(item => item.id)) + 1
}
