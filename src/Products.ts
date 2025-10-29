import { Atom } from "@effect-atom/atom-react"
import { Effect, Schema } from "effect"

export class CoffeeProduct extends Schema.Class<CoffeeProduct>(
  "app/schema/CoffeeProduct",
)({
  id: Schema.String,
  name: Schema.String,
  tagline: Schema.String,
  price: Schema.Number,
  description: Schema.String,
  color: Schema.String,
}) {}

export class Products extends Effect.Service<Products>()(
  "app/service/Products",
  {
    accessors: true,
    effect: Effect.gen(function* () {
      const all = yield* Effect.gen(function* () {
        // Sleep a bit to simulate fetching all the data from the store
        // the magic string below is actually type safe :)
        yield* Effect.sleep("1 second")
        return [
          CoffeeProduct.make({
            id: "cron",
            name: "cron",
            tagline: "12oz",
            price: 30,
            description:
              "Subscribe to Cron, the official Terminal membership and. Each month you'll receive a scheduled delivery with special flavor-of-the-month blend. You'll also get receive additional gifts, exclusive offers, and invites to Terminal events.",
            color: "#03FFF0",
          }),
          CoffeeProduct.make({
            id: "objectobject",
            name: "[object object]",
            tagline: "light roast | 12oz | whole beans",
            price: 22,
            description:
              "The interpolation of Caturra and Castillo varietals from Las Cochitas creates this refreshing citrusy and complex coffee.",
            color: "#F5BB1E",
          }),
          CoffeeProduct.make({
            id: "segfault",
            name: "segfault",
            tagline: "medium roast | 12oz | whole beans",
            price: 22,
            description:
              "A savory yet sweet blend created from a natural fault in the coffee cherry that causes it to develop one bean instead of two.",
            color: "#169FC1",
          }),
          CoffeeProduct.make({
            id: "darkmode",
            name: "dark mode",
            tagline: "dark roast 12oz whole beans",
            price: 22,
            description:
              "A dark roast from the Cerrado region of Brazil, an expansive lush and tropical savanna that creates a dark chocolate blend with hints of almond.",
            color: "#0F8B38",
          }),
          CoffeeProduct.make({
            id: "404",
            name: "404",
            tagline: "decaf | 12oz | whole beans",
            price: 22,
            description:
              "A flavorful decaf coffee processed in the mountain waters of Brazil to create a dark chocolatey blend.",
            color: "#D53D81",
          }),
        ]
      })

      return { all } as const
    }),
  },
) {}

const productsRuntime = Atom.runtime(Products.Default)

export const productsAtom = productsRuntime
  .atom(Products.all)
  .pipe(Atom.keepAlive)

export const productsByIdAtom = Atom.mapResult(
  productsAtom,
  (products) => new Map(products.map((product) => [product.id, product])),
)

export const selectedProductIdxAtom = Atom.make(0).pipe(Atom.keepAlive)
