// Create an Atom that reads and writes to localStorage.

import { KeyValueStore } from "@effect/platform"
import { Effect, Option } from "effect"
import { Products, type CoffeeProdcutId } from "./products"

export class Cart extends Effect.Service<Cart>()("app/service/cart", {
  dependencies: [KeyValueStore.layerMemory],
  accessors: true,
  // dependencies: [BunKeyValueStore.layerFileSystem("./directory")],
  scoped: Effect.gen(function* () {
    let cart: Map<CoffeeProdcutId, number> = new Map()

    const setQty = Effect.fnUntraced(function* (
      productId: CoffeeProdcutId,
      qty: number,
    ) {
      return cart.set(productId, qty)
    })

    const incrementQty = Effect.fnUntraced(function* (
      productId: CoffeeProdcutId,
    ) {
      const currentQty = cart.get(productId) ?? 0
      const newQty = currentQty + 1
      cart.set(productId, newQty)
    })

    const decrementQty = Effect.fnUntraced(function* (
      productId: CoffeeProdcutId,
    ) {
      const currentQty = cart.get(productId) ?? 0
      const newQty = currentQty - 1
      if (newQty > 0) {
        cart.set(productId, newQty)
      } else {
        cart.delete(productId)
      }
    })

    const total = Effect.gen(function* () {
      const products = yield* Products
      const cartEntires = yield* list

      return cartEntires.reduce((total, [itemId, qty]) => {
        const item = Option.getOrUndefined(
          Effect.runSync(products.single(itemId)),
        )
        return total + (item?.price ?? 0) * qty
      }, 0)
    })

    const list = Effect.gen(function* () {
      return Array.from(cart.entries())
    })

    return {
      setQty,
      incrementQty,
      decrementQty,
      total,
      list,
    } as const
  }),
}) {}
