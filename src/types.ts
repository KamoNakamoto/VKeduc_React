/// <reference types="vite/client" />
export interface App {
  id: number
  title: string
  price: number
  free: boolean
  category: string
  image: string
  description: string
  rating: number
  downloads: string
}
export type Category = string