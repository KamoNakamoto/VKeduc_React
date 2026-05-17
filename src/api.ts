import type { App } from './types'

const API_BASE_URL = 'http://localhost:4000/api'

export async function fetchApps(): Promise<App[]> {
  const response = await fetch(`${API_BASE_URL}/apps`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data: App[] = await response.json()
  return data
}