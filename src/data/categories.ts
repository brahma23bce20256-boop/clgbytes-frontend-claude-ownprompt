export type CategoryId = 'biryani' | 'mandi' | 'shawarma' | 'nonveg-starters' | 'veg-starters'

export interface Category {
  id: CategoryId
  name: string
  emoji: string
  blurb: string
}

export const CATEGORIES: Category[] = [
  { id: 'biryani', name: 'Biryani', emoji: '🍛', blurb: 'Dum, hyderabadi, Bombay' },
  { id: 'mandi', name: 'Mandis', emoji: '🥘', blurb: 'Chicken · Mutton' },
  { id: 'shawarma', name: 'Shawarmas', emoji: '🌯', blurb: 'Rolls, plates' },
  { id: 'nonveg-starters', name: 'Non-veg starters', emoji: '🍗', blurb: 'Fry, 65, pepper' },
  { id: 'veg-starters', name: 'Veg starters', emoji: '🥗', blurb: 'Paneer, mushroom' },
]
