import { CoffeeProdcutId, CoffeeProduct } from "@/data/products"
import { cartItemsAtom, productAtom } from "@/data/runtime"
import { Colors } from "@/utils"
import { Atom, useAtom, useAtomSuspense } from "@effect-atom/atom-react"
import { TextAttributes } from "@opentui/core"
import { useKeyboard } from "@opentui/react"
import { Option } from "effect"
import { Suspense, type ReactNode } from "react"
import { Keybind } from "./keybind"
import { CoffeeAction } from "./shop"

export function CartEmptyView() {
  return (
    <CartShell>
      <box
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
      >
        <text attributes={TextAttributes.DIM}>Your cart is empty.</text>
      </box>
    </CartShell>
  )
}

export function CartShell({ children }: { children: ReactNode }) {
  return (
    <box>
      <box flexDirection="row" gap={1}>
        <text>cart</text>
        <text attributes={TextAttributes.DIM}>/</text>
        <text attributes={TextAttributes.DIM}>shipping</text>
        <text attributes={TextAttributes.DIM}>/</text>
        <text attributes={TextAttributes.DIM}>payment</text>
        <text attributes={TextAttributes.DIM}>/</text>
        <text attributes={TextAttributes.DIM}>confirmation</text>
      </box>
      {children}
      <box alignItems="center">
        <text attributes={TextAttributes.DIM}>
          free shipping on US orders over $40
        </text>
      </box>
      <CartFooter />
    </box>
  )
}

const selectedCartItemIdxAtom = Atom.make(0)

export function CartContents() {
  const cartItems = useAtomSuspense(cartItemsAtom).value
  const [selectedCartItemIdx, setSelectedCartItemIdx] = useAtom(
    selectedCartItemIdxAtom,
  )

  useKeyboard((key) => {
    if (cartItems.length <= 1) return

    switch (key.name) {
      case "up":
      case "k":
        return setSelectedCartItemIdx((prev) =>
          prev > 0 ? prev - 1 : cartItems.length - 1,
        )
      case "down":
      case "j":
        return setSelectedCartItemIdx((prev) =>
          prev < cartItems.length - 1 ? prev + 1 : 0,
        )
    }
  })

  if (cartItems.length === 0) return <CartEmptyView />

  return (
    <CartShell>
      <box height="100%" marginTop={1}>
        {cartItems.map(([productId, qty], idx) => (
          <Suspense
            fallback={
              <box border height={2}>
                {productId}
              </box>
            }
          >
            <CartListItem
              selected={idx === selectedCartItemIdx}
              productId={productId}
              qty={qty}
            />
          </Suspense>
        ))}
      </box>
    </CartShell>
  )
}

function CartListItem({
  productId,
  qty,
  selected,
}: {
  productId: CoffeeProdcutId
  qty: number
  selected: boolean
}) {
  const product = Option.getOrUndefined(
    useAtomSuspense(productAtom(productId)).value,
  )

  if (!product) {
    return (
      <box border borderColor="#ff0000">
        <text fg="#ff0000">Error: Unable to find prodcut, id: {productId}</text>
      </box>
    )
  }

  return (
    <box
      flexDirection="row"
      justifyContent="space-between"
      paddingLeft={1}
      paddingRight={1}
      border
      borderColor={selected ? "#FFFFFF" : Colors.border}
    >
      <box>
        <text>{product.name}</text>
        <text attributes={TextAttributes.DIM}>{product.tagline}</text>
      </box>

      <box flexDirection="row" gap={2}>
        <CoffeeAction
          active={selected}
          product={product as CoffeeProduct}
          gap={1}
        />
        <text attributes={TextAttributes.DIM}>${qty * product.price}</text>
      </box>
    </box>
  )
}

function CartFooter() {
  return (
    <box
      flexDirection="row"
      justifyContent="center"
      border={["top"]}
      borderColor={Colors.border}
      gap={3}
    >
      <Keybind label="esc" description="back" />
      <Keybind label="↑/↓" description="items" />
      <Keybind label="+/-" description="qty" />
      <Keybind label="c" description="checkout" />
    </box>
  )
}
