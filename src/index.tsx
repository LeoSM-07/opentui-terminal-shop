import {
  useAtom,
  useAtomSet,
  useAtomSuspense,
  useAtomValue,
} from "@effect-atom/atom-react"
import { TextAttributes } from "@opentui/core"
import { render, useKeyboard } from "@opentui/react"
import { Suspense } from "react"
import { CoffeeProduct, productsAtom, selectedProductIdxAtom } from "./Products"
import {
  addToCartAtom,
  cartAtom,
  cartTotalAtom,
  removeFromCartAtom,
} from "./Cart"

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

      <CartSummary />
    </box>
  )
}

function CartSummary() {
  const { price, quantity } = useAtomValue(cartTotalAtom)
  return (
    <box flexGrow={1} flexDirection="row" justifyContent="center" gap={1}>
      <text>c</text>
      <text attributes={TextAttributes.DIM}>cart</text>
      <text>$ {price}</text>
      <text attributes={TextAttributes.DIM}>[{quantity}]</text>
    </box>
  )
}

function ShopTab() {
  const products = useAtomSuspense(productsAtom).value

  const [selectedProductIdx, setSelectedProductIdx] = useAtom(
    selectedProductIdxAtom,
  )
  const selectedCoffee = products[selectedProductIdx]!

  const cart = useAtomValue(cartAtom)
  const selectedQuantity = cart.get(selectedCoffee.id) ?? 0
  const addToCart = useAtomSet(addToCartAtom)
  const removeFromCart = useAtomSet(removeFromCartAtom)

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
      case "right":
        return addToCart(selectedCoffee.id)
      case "left":
        return removeFromCart(selectedCoffee.id)
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
            <text>{selectedQuantity}</text>
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
