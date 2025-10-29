import { Effect, Layer } from "effect"
import { CoffeeProduct, Products, productsByIdAtom } from "./Products"
import { Atom, Result } from "@effect-atom/atom-react"

export class Cart extends Effect.Service<Cart>()("shop/Cart", {
  accessors: true,
  scoped: Effect.gen(function* () {
    const items = new Map<string, number>()

    const all = Effect.sync(() => items)
    const add = Effect.fn("Card.add")(function* (productId: string) {
      const currentQuantity = items.get(productId) ?? 0
      yield* Effect.sleep(100) // simulate some delay
      items.set(productId, currentQuantity + 1)
    })
    const remove = Effect.fn("Card.remove")(function* (productId: string) {
      const currentQuantity = items.get(productId) ?? 0
      yield* Effect.sleep(100) // simulate some delay
      if (currentQuantity > 1) {
        items.set(productId, currentQuantity - 1)
      } else {
        items.delete(productId)
      }
    })

    return { add, remove, all } as const
  }),
}) {}

const cartRuntime = Atom.runtime(
  Cart.Default.pipe(Layer.merge(Products.Default)),
)

export const cartAtom = cartRuntime
  .atom(Cart.all)
  .pipe(
    Atom.map(Result.getOrElse(() => new Map<string, number>())),
    Atom.optimistic,
    Atom.withReactivity(["cart"]),
    Atom.keepAlive,
  )

export const cartWithProductsAtom = cartRuntime
  .atom(
    Effect.fnUntraced(function* (get) {
      const cart = get(cartAtom)
      const withProducts = new Map<CoffeeProduct, number>()
      const products = yield* get.result(productsByIdAtom)
      for (const [productId, quantity] of cart) {
        const product = products.get(productId)
        if (product) {
          withProducts.set(product, quantity)
        }
      }
      return withProducts
    }),
  )
  .pipe(Atom.map(Result.getOrElse(() => new Map<CoffeeProduct, number>())))

export const cartTotalAtom = Atom.make((get) => {
  const cart = get(cartWithProductsAtom)
  let price = 0
  let quantity = 0
  for (const [product, q] of cart) {
    price += product.price * q
    quantity += q
  }
  return { price, quantity } as const
})

export const addToCartAtom = Atom.optimisticFn(cartAtom, {
  reducer(current, update) {
    const currentQuantity = current.get(update) ?? 0
    const newMap = new Map(current)
    newMap.set(update, currentQuantity + 1)
    return newMap
  },
  fn: cartRuntime.fn<string>()(
    Effect.fnUntraced(function* (id) {
      yield* Cart.add(id)
    }),
    { concurrent: true },
  ),
})

export const removeFromCartAtom = Atom.optimisticFn(cartAtom, {
  reducer(map, update) {
    if (!map.has(update)) {
      return map
    }
    const currentQuantity = map.get(update)!
    const newMap = new Map(map)
    if (currentQuantity > 1) {
      newMap.set(update, currentQuantity - 1)
    } else {
      newMap.delete(update)
    }
    return newMap
  },
  fn: cartRuntime.fn<string>()(
    Effect.fnUntraced(function* (id) {
      yield* Cart.remove(id)
    }),
    { concurrent: true },
  ),
})
