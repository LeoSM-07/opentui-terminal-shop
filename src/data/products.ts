import { Effect, pipe, Schema } from "effect"

export const SubscriptionProductId = Schema.String.pipe(
  Schema.brand("SubscriptionProductId"),
)
export type SubscriptionProductId = typeof SubscriptionProductId.Type

export const CoffeeProdcutId = Schema.String.pipe(
  Schema.brand("CoffeeProdcutId"),
)
export type CoffeeProdcutId = typeof CoffeeProdcutId.Type

export const ProductId = Schema.Union(SubscriptionProductId, CoffeeProdcutId)
export type ProductId = typeof ProductId.Type

export class CoffeeProduct extends Schema.TaggedClass<CoffeeProduct>(
  "app/schema/CoffeeProduct",
)("CoffeeProduct", {
  id: CoffeeProdcutId,
  name: Schema.String,
  tagline: Schema.String,
  price: Schema.Number,
  description: Schema.String,
  color: Schema.String,
  fgColor: Schema.optional(Schema.String),
}) {}

export class SubscriptionProduct extends Schema.TaggedClass<SubscriptionProduct>(
  "app/schema/SubscriptionProduct",
)("SubscriptionProduct", {
  id: SubscriptionProductId,
  name: Schema.String,
  tagline: Schema.String,
  price: Schema.Number,
  description: Schema.String,
  color: Schema.String,
  fgColor: Schema.optional(Schema.String),
}) {}

export const ProductUnion = Schema.Union(CoffeeProduct, SubscriptionProduct)
export type ProductUnion = typeof ProductUnion.Type

export class Products extends Effect.Service<Products>()(
  "app/service/Products",
  {
    accessors: true,
    effect: Effect.gen(function* () {
      const products = [
        SubscriptionProduct.make({
          id: SubscriptionProductId.make("cron"),
          name: "cron",
          tagline: "12oz",
          price: 30,
          description:
            "Subscribe to Cron, the official Terminal membership and. Each month you'll receive a scheduled delivery with special flavor-of-the-month blend. You'll also get receive additional gifts, exclusive offers, and invites to Terminal events.",
          color: "#03FFF0",
          fgColor: "#0D0D0D",
        }),
        CoffeeProduct.make({
          id: CoffeeProdcutId.make("objectobject"),
          name: "[object object]",
          tagline: "light roast | 12oz | whole beans",
          price: 22,
          description:
            "The interpolation of Caturra and Castillo varietals from Las Cochitas creates this refreshing citrusy and complex coffee.",
          color: "#F5BB1E",
        }),
        CoffeeProduct.make({
          id: CoffeeProdcutId.make("segfault"),
          name: "segfault",
          tagline: "medium roast | 12oz | whole beans",
          price: 22,
          description:
            "A savory yet sweet blend created from a natural fault in the coffee cherry that causes it to develop one bean instead of two.",
          color: "#169FC1",
        }),
        CoffeeProduct.make({
          id: CoffeeProdcutId.make("darkmode"),
          name: "dark mode",
          tagline: "dark roast 12oz whole beans",
          price: 22,
          description:
            "A dark roast from the Cerrado region of Brazil, an expansive lush and tropical savanna that creates a dark chocolate blend with hints of almond.",
          color: "#0F8B38",
        }),
        CoffeeProduct.make({
          id: CoffeeProdcutId.make("404"),
          name: "404",
          tagline: "decaf | 12oz | whole beans",
          price: 22,
          description:
            "A flavorful decaf coffee processed in the mountain waters of Brazil to create a dark chocolatey blend.",
          color: "#D53D81",
        }),
      ]

      const all = Effect.gen(function* () {
        // Sleep a bit to simulate fetching all the data from the store
        // the magic string below is actually type safe :)
        yield* Effect.sleep("3 seconds")
        return products
      })

      const single = Effect.fnUntraced(function* (id: ProductId) {
        return yield* pipe(
          products,
          Effect.findFirst((item) => Effect.succeed(item.id === id)),
        )
      })

      return { all, single } as const
    }),
  },
) {}
