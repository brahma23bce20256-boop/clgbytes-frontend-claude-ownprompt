import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UniversityId } from '../data/universities'
import type { CategoryId } from '../data/categories'
import type { MenuItem } from '../data/hotels'

export type VegFilter = 'all' | 'veg' | 'nonveg'
export type SortBy = 'relevance' | 'rating' | 'distance' | 'price-low' | 'price-high'

export interface User {
  name: string
  phone: string
  university: UniversityId
}

export interface CartLine {
  item: MenuItem
  hotelId: string
  hotelName: string
  qty: number
}

export type OrderStatus = 'placed' | 'accepted' | 'kitchen' | 'out-for-delivery' | 'delivered'

export interface Order {
  id: string
  createdAt: number
  hotelId: string
  hotelName: string
  lines: CartLine[]
  subtotal: number
  delivery: number
  discount: number
  total: number
  status: OrderStatus
  university: UniversityId
  address: string
  user: User
}

interface Store {
  user: User | null
  setUser: (u: User | null) => void

  selectedUniversity: UniversityId
  setUniversity: (u: UniversityId) => void

  vegFilter: VegFilter
  setVegFilter: (v: VegFilter) => void

  category: CategoryId | null
  setCategory: (c: CategoryId | null) => void

  sortBy: SortBy
  setSortBy: (s: SortBy) => void

  query: string
  setQuery: (q: string) => void

  cart: CartLine[]
  addToCart: (item: MenuItem, hotelId: string, hotelName: string) => void
  removeFromCart: (itemId: string) => void
  decrement: (itemId: string) => void
  clearCart: () => void

  orders: Order[]
  placeOrder: () => Order | null
  advanceOrder: (orderId: string, status: OrderStatus) => void
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (u) => set({ user: u }),

      selectedUniversity: 'vit-ap',
      setUniversity: (u) => set({ selectedUniversity: u }),

      vegFilter: 'all',
      setVegFilter: (v) => set({ vegFilter: v }),

      category: null,
      setCategory: (c) => set({ category: c }),

      sortBy: 'relevance',
      setSortBy: (s) => set({ sortBy: s }),

      query: '',
      setQuery: (q) => set({ query: q }),

      cart: [],
      addToCart: (item, hotelId, hotelName) => {
        const cart = get().cart
        // if cart has lines from another hotel, replace
        if (cart.length && cart[0].hotelId !== hotelId) {
          set({ cart: [{ item, hotelId, hotelName, qty: 1 }] })
          return
        }
        const existing = cart.find((l) => l.item.id === item.id)
        if (existing) {
          set({ cart: cart.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l)) })
        } else {
          set({ cart: [...cart, { item, hotelId, hotelName, qty: 1 }] })
        }
      },
      decrement: (itemId) => {
        const cart = get().cart
        const line = cart.find((l) => l.item.id === itemId)
        if (!line) return
        if (line.qty <= 1) set({ cart: cart.filter((l) => l.item.id !== itemId) })
        else set({ cart: cart.map((l) => (l.item.id === itemId ? { ...l, qty: l.qty - 1 } : l)) })
      },
      removeFromCart: (itemId) => set({ cart: get().cart.filter((l) => l.item.id !== itemId) }),
      clearCart: () => set({ cart: [] }),

      orders: [],
      placeOrder: () => {
        const { cart, user, selectedUniversity } = get()
        if (!cart.length || !user) return null
        const subtotal = cart.reduce((s, l) => s + l.item.price * l.qty, 0)
        const delivery = subtotal >= 299 ? 15 : 25
        const discount = subtotal >= 499 ? 40 : 0
        const total = subtotal + delivery - discount
        const order: Order = {
          id: 'CB-' + Math.floor(100000 + Math.random() * 900000),
          createdAt: Date.now(),
          hotelId: cart[0].hotelId,
          hotelName: cart[0].hotelName,
          lines: cart,
          subtotal,
          delivery,
          discount,
          total,
          status: 'placed',
          university: selectedUniversity,
          address: 'Main Gate · ' + selectedUniversity.toUpperCase(),
          user,
        }
        set({ orders: [order, ...get().orders], cart: [] })
        // simulate acceptance after a bit
        setTimeout(() => get().advanceOrder(order.id, 'accepted'), 4000)
        setTimeout(() => get().advanceOrder(order.id, 'kitchen'), 10000)
        setTimeout(() => get().advanceOrder(order.id, 'out-for-delivery'), 18000)
        return order
      },
      advanceOrder: (orderId, status) =>
        set({
          orders: get().orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }),
    }),
    {
      name: 'clgbytes-store',
      partialize: (s) => ({
        user: s.user,
        selectedUniversity: s.selectedUniversity,
        cart: s.cart,
        orders: s.orders,
      }),
    }
  )
)
