import { Atom } from "@effect-atom/atom-react"
import { Effect, Layer } from "effect"
import { Cart } from "./cart"
import { CoffeeProdcutId, ProductId, Products } from "./products"

const appLayer = Layer.merge(Cart.Default, Products.Default).pipe(
  Layer.provide(Products.Default),
)

export const appRuntime = Atom.runtime(appLayer)

export const productAtom = Atom.family((id: ProductId) =>
  appRuntime.atom(Products.single(id)),
)

export const productsAtom = appRuntime.atom(Products.all).pipe(Atom.keepAlive)

export const selectedProductIdxAtom = Atom.make(0)

export const incrementQtyAtom = appRuntime.fn(
  Effect.fn(function* (productId: CoffeeProdcutId) {
    const cart = yield* Cart
    return yield* cart.incrementQty(productId)
  }),
  { reactivityKeys: ["cart"] },
)

export const decrementQtyAtom = appRuntime.fn(
  Effect.fn(function* (productId: CoffeeProdcutId) {
    const cart = yield* Cart
    return yield* cart.decrementQty(productId)
  }),
  { reactivityKeys: ["cart"] },
)

export const cartTotalAtom = appRuntime
  .atom(() =>
    Effect.gen(function* () {
      const cart = yield* Cart

      return yield* cart.total
    }),
  )
  .pipe(Atom.withReactivity(["cart"]))

export const cartItemsAtom = appRuntime
  .atom(() =>
    Effect.gen(function* () {
      const cart = yield* Cart

      return yield* cart.list
    }),
  )
  .pipe(Atom.withReactivity(["cart"]))

export const cartCountAtom = appRuntime
  .atom(() =>
    Effect.gen(function* () {
      const cart = yield* Cart

      return (yield* cart.list).reduce((acc, [_, qty]) => acc + qty, 0)
    }),
  )
  .pipe(Atom.withReactivity(["cart"]))

export const itemQtyAtom = Atom.family((productId: CoffeeProdcutId) =>
  appRuntime
    .atom(() =>
      Effect.gen(function* () {
        const cart = yield* Cart

        return (yield* cart.list).find(([id]) => id === productId)?.at(1)
      }),
    )
    .pipe(Atom.withReactivity(["cart"])),
)
