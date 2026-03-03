import { openDatabase } from './db'
import type { UserPreferences, Theme, FontSize } from '#/types/epub'

const PREFERENCES_ID = 'user-preferences'

const defaultPreferences: UserPreferences = {
  id: PREFERENCES_ID,
  theme: 'light',
  fontSize: 'medium',
}

export async function getPreferences(): Promise<UserPreferences> {
  const db = await openDatabase()
  const prefs = await db.get('preferences', PREFERENCES_ID)
  return prefs ?? defaultPreferences
}

export async function savePreferences(prefs: Partial<UserPreferences>): Promise<UserPreferences> {
  const db = await openDatabase()
  const current = await getPreferences()
  const updated: UserPreferences = {
    ...current,
    ...prefs,
    id: PREFERENCES_ID, // Ensure ID is always set
  }
  await db.put('preferences', updated)
  return updated
}

export async function setTheme(theme: Theme): Promise<UserPreferences> {
  return savePreferences({ theme })
}

export async function setFontSize(fontSize: FontSize): Promise<UserPreferences> {
  return savePreferences({ fontSize })
}
