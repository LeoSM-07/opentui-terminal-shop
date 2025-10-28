import { Atom, useAtom, useAtomSuspense } from "@effect-atom/atom-react"
import { TextAttributes } from "@opentui/core"
import { render, useKeyboard } from "@opentui/react"
import { Effect, Schema } from "effect"
import { Suspense } from "react"

const borderColor = "#3A3F41"
const backgroundColor = "#0D0D0D"

function App() {
  return (
    <box
      backgroundColor={backgroundColor}
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
    >
      <box gap={1} width="100%" flexGrow={1} maxHeight={30} maxWidth={75}>
        <box backgroundColor={"#FF5C02"}>
          <text>{"   opentui demo of terminal.shop    "}</text>
        </box>
        <Header />
        <Suspense fallback={<text>Loading shop...</text>}>
          <ShopTab />
        </Suspense>
      </box>
    </box>
  )
}

// nothing cool here
function Header() {
  return (
    <box width="100%" borderColor={borderColor} flexDirection="row">
      <box
        border={["right"]}
        borderColor={borderColor}
        flexGrow={1}
        alignItems="center"
      >
        <text attributes={TextAttributes.BOLD}>terminal</text>
      </box>

      <box
        border={["right"]}
        borderColor={borderColor}
        flexGrow={1}
        flexDirection="row"
        justifyContent="center"
        gap={1}
      >
        <text>a</text>
        <text attributes={TextAttributes.DIM}>account</text>
      </box>

      <box
        border={["right"]}
        borderColor={borderColor}
        flexGrow={1}
        flexDirection="row"
        justifyContent="center"
        gap={1}
      >
        <text>s</text>
        <text attributes={TextAttributes.DIM}>shop</text>
      </box>

      <box flexGrow={1} flexDirection="row" justifyContent="center" gap={1}>
        <text>c</text>
        <text attributes={TextAttributes.DIM}>cart</text>
        <text>$ 0</text>
        <text attributes={TextAttributes.DIM}>[0]</text>
      </box>
    </box>
  )
}

class CoffeeProduct extends Schema.Class<CoffeeProduct>(
  "app/schema/CoffeeProduct",
)({
  id: Schema.String,
  name: Schema.String,
  tagline: Schema.String,
  price: Schema.Number,
  description: Schema.String,
  color: Schema.String,
}) {}

class Products extends Effect.Service<Products>()("app/service/Products", {
  accessors: true,
  effect: Effect.gen(function* () {
    const all = Effect.gen(function* () {
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
}) {}

const productsRuntime = Atom.runtime(Products.Default)

const productsAtom = productsRuntime.atom(Products.all)

const selectedProductIdxAtom = Atom.make(0)

// Here we aren't worried so much about displaying a bunch of stuff
// since the main goal is getting all the data behaviors right
function ShopTab() {
  const products = useAtomSuspense(productsAtom).value

  const [selectedProductIdx, setSelectedProductIdx] = useAtom(
    selectedProductIdxAtom,
  )
  const selectedCoffee = products[selectedProductIdx]

  useKeyboard((key) => {
    switch (key.name) {
      case "up":
        return setSelectedProductIdx((prev) =>
          prev > 0 ? prev - 1 : products.length - 1,
        )
      case "down":
        return setSelectedProductIdx((prev) =>
          prev < products.length - 1 ? prev + 1 : 0,
        )
    }
  })

  return (
    <box flexDirection="row" gap={2}>
      <box width={20}>
        <text>~ featured ~</text>
        {products.slice(0, 1).map((product, index) => (
          <ProductBox
            product={product}
            selected={index === selectedProductIdx}
          />
        ))}

        <text marginTop={1}>~ originals ~</text>
        {products.slice(1).map((product, index) => (
          <ProductBox
            product={product}
            selected={index + 1 === selectedProductIdx}
          />
        ))}
      </box>
      {selectedCoffee && (
        <box flexGrow={1} gap={1}>
          <box>
            <text>{selectedCoffee.name}</text>
            <text attributes={TextAttributes.DIM}>
              {selectedCoffee.tagline}
            </text>
          </box>

          <text
            style={{ fg: selectedCoffee.color }}
          >{`$${selectedCoffee.price}`}</text>

          <text attributes={TextAttributes.DIM}>
            {selectedCoffee.description}
          </text>

          <box gap={1} flexDirection="row">
            <text attributes={TextAttributes.DIM}>-</text>
            <text>0</text>
            <text attributes={TextAttributes.DIM}>+</text>
          </box>
        </box>
      )}
    </box>
  )
}

function ProductBox({
  product,
  selected,
}: {
  product: CoffeeProduct
  selected: boolean
}) {
  return (
    <box backgroundColor={selected ? product.color : undefined}>
      <text attributes={selected ? TextAttributes.NONE : TextAttributes.DIM}>
        {product.name}
      </text>
    </box>
  )
}

render(<App />)
