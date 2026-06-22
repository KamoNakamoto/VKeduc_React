export interface App {
  id: number
  title: string
  category: string
  description: string
  rating: number
  downloads: string
  price: number
  free: boolean
  image: string
  screenshots?: string[]
}