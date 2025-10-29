import {
  CoffeeProdcutId,
  CoffeeProduct,
  ProductUnion,
  SubscriptionProduct,
} from "@/data/products"
import {
  decrementQtyAtom,
  incrementQtyAtom,
  itemQtyAtom,
  productsAtom,
  selectedProductIdxAtom,
} from "@/data/runtime"
import { Colors } from "@/utils"
import {
  useAtom,
  useAtomSet,
  useAtomSuspense,
  useAtomValue,
} from "@effect-atom/atom-react"
import { TextAttributes } from "@opentui/core"
import { useKeyboard } from "@opentui/react"
import { Suspense } from "react"
import { Keybind } from "./keybind"
import { SkeletonText } from "./skeleton-text"

const placeholderProduct = CoffeeProduct.make({
  id: CoffeeProdcutId.make("objectobject"),
  name: "[object object]",
  tagline: "light roast | 12oz | whole beans",
  price: 22,
  description:
    "The interpolation of Caturra and Castillo varietals from Las Cochitas creates this refreshing citrusy and complex coffee.",
  color: "#F5BB1E",
})

export function ShopSkeleton() {
  return (
    <box marginTop={1}>
      <box flexGrow={1} height={"100%"} flexDirection="row" gap={2}>
        <box width={20}>
          <text>~ featured ~</text>
          <SkeletonText text={placeholderProduct.name} />
          <text marginTop={1}>~ originals ~</text>
          <SkeletonText text={"[object object]"} />
          <SkeletonText text={"segfault"} />
          <SkeletonText text={"dark mode"} />
          <SkeletonText text={"404404404404"} />
        </box>
        <box gap={1}>
          <box>
            <SkeletonText text={placeholderProduct.name} />
            <SkeletonText text={placeholderProduct.tagline} />
          </box>

          <SkeletonText text={`$${placeholderProduct.price}`} />

          <SkeletonText text={placeholderProduct.description} />
        </box>
      </box>
      <box alignItems="center">
        <text attributes={TextAttributes.DIM}>
          free shipping on US orders over $40
        </text>
      </box>
      <ShopFooter />
    </box>
  )
}

export function ShopTab() {
  const products = useAtomSuspense(productsAtom).value

  const selectedProductIdx = useAtomValue(selectedProductIdxAtom)
  const selectedProduct = products[selectedProductIdx]

  return (
    <box marginTop={1}>
      <box flexGrow={1} height={"100%"} flexDirection="row" gap={2}>
        <ProductSelector products={products} />
        {selectedProduct && (
          <box flexGrow={1} gap={1}>
            <box>
              <text>{selectedProduct.name}</text>
              <text attributes={TextAttributes.DIM}>
                {selectedProduct.tagline}
              </text>
            </box>

            <text
              style={{
                fg: selectedProduct.color,
                attributes: TextAttributes.BOLD,
              }}
            >{`$${selectedProduct.price}`}</text>

            <text attributes={TextAttributes.DIM}>
              {selectedProduct.description}
            </text>

            <ProductAction product={selectedProduct} />
          </box>
        )}
      </box>
      <box alignItems="center">
        <text attributes={TextAttributes.DIM}>
          free shipping on US orders over $40
        </text>
      </box>
      <ShopFooter />
    </box>
  )
}

function ProductSelector({ products }: { products: ProductUnion[] }) {
  const [selectedProductIdx, setSelectedProductIdx] = useAtom(
    selectedProductIdxAtom,
  )

  useKeyboard((key) => {
    switch (key.name) {
      case "up":
      case "k":
        return setSelectedProductIdx((prev) =>
          prev > 0 ? prev - 1 : products.length - 1,
        )
      case "down":
      case "j":
        return setSelectedProductIdx((prev) =>
          prev < products.length - 1 ? prev + 1 : 0,
        )
    }
  })

  return (
    <box width={20}>
      <text>~ featured ~</text>
      {products.slice(0, 1).map((product, index) => (
        <ProductBox product={product} selected={index === selectedProductIdx} />
      ))}

      <text marginTop={1}>~ originals ~</text>
      {products.slice(1).map((product, index) => (
        <ProductBox
          product={product}
          selected={index + 1 === selectedProductIdx}
        />
      ))}
    </box>
  )
}

function ProductAction({ product }: { product: ProductUnion }) {
  switch (product._tag) {
    case "SubscriptionProduct":
      return <SubscriptionAction product={product} />
    case "CoffeeProduct":
      return <CoffeeAction product={product} />
    default: {
      // ensures exhaustiveness — if you add a new case, TypeScript will error here
      const _exhaustiveCheck: never = product
      return _exhaustiveCheck
    }
  }
}

function SubscriptionAction({ product }: { product: SubscriptionProduct }) {
  return (
    <box flexDirection="row" gap={1}>
      <text fg={product.fgColor} bg={product.color}>
        {" subscribe "}
      </text>
      <text>enter</text>
    </box>
  )
}

export function CoffeeAction({
  product,
  gap = 2,
  active = true,
}: {
  product: CoffeeProduct
  gap?: number
  active?: boolean
}) {
  const incrementItem = useAtomSet(incrementQtyAtom)
  const decrementItem = useAtomSet(decrementQtyAtom)
  const itemQty = useAtomSuspense(itemQtyAtom(product.id)).value

  useKeyboard((key) => {
    if (!active) return

    switch (key.name) {
      case "+":
      case "=":
      case "l":
      case "right":
        return incrementItem(product.id)
      case "-":
      case "_":
      case "h":
      case "left":
        return decrementItem(product.id)
    }
  })

  return (
    <box gap={gap} flexDirection="row">
      <text attributes={TextAttributes.DIM}>{active ? "-" : " "}</text>
      <Suspense fallback={<text>0</text>}>
        <text>{itemQty ?? 0}</text>
      </Suspense>
      <text attributes={TextAttributes.DIM}>{active ? "+" : " "}</text>
    </box>
  )
}

function ProductBox({
  product,
  selected,
}: {
  product: ProductUnion
  selected: boolean
}) {
  return (
    <box
      style={{
        backgroundColor: selected ? product.color : undefined,
      }}
    >
      <text
        fg={selected ? product.fgColor : undefined}
        attributes={selected ? TextAttributes.NONE : TextAttributes.DIM}
      >
        {product.name}
      </text>
    </box>
  )
}

function ShopFooter() {
  return (
    <box
      flexDirection="row"
      justifyContent="center"
      border={["top"]}
      borderColor={Colors.border}
      gap={3}
    >
      <Keybind label="r" description="🇺🇸 (US)" />
      <Keybind label="↑/↓" description="products" />
      <Keybind label="+/-" description="qty" />
      <Keybind label="c" description="cart" />
      <Keybind label="q" description="quit" />
    </box>
  )
}
