import { currentPageIdAtom } from "@/data/navigation"
import { cartCountAtom, cartTotalAtom } from "@/data/runtime"
import { Colors } from "@/utils"
import { useAtom, useAtomSuspense } from "@effect-atom/atom-react"
import { TextAttributes } from "@opentui/core"
import { useKeyboard } from "@opentui/react"
import { Suspense } from "react"

export function Header() {
  const [currentPageId, setCurrentPageId] = useAtom(currentPageIdAtom)

  useKeyboard((key) => {
    switch (key.name) {
      case "s":
        return setCurrentPageId("shop")
      case "a":
        return setCurrentPageId("account")
      case "c":
        return setCurrentPageId("cart")
      case "q":
        return process.exit()
      default:
        return
    }
  })

  const cartTotal = useAtomSuspense(cartTotalAtom).value
  const cartItems = useAtomSuspense(cartCountAtom).value

  return (
    <box
      height={3}
      width="100%"
      borderColor={Colors.border}
      flexDirection="row"
    >
      <box
        border={["right"]}
        borderColor={Colors.border}
        flexGrow={1}
        alignItems="center"
      >
        <text attributes={TextAttributes.BOLD}>terminal</text>
      </box>

      <box
        border={["right"]}
        borderColor={Colors.border}
        flexGrow={1}
        flexDirection="row"
        justifyContent="center"
        gap={1}
      >
        <text>s</text>
        <text
          attributes={
            currentPageId === "shop" ? TextAttributes.NONE : TextAttributes.DIM
          }
        >
          shop
        </text>
      </box>

      <box
        border={["right"]}
        borderColor={Colors.border}
        flexGrow={1}
        flexDirection="row"
        justifyContent="center"
        gap={1}
      >
        <text>a</text>
        <text
          attributes={
            currentPageId === "account"
              ? TextAttributes.NONE
              : TextAttributes.DIM
          }
        >
          account
        </text>
      </box>

      <box flexGrow={1} flexDirection="row" justifyContent="center" gap={1}>
        <text>c</text>
        <text
          attributes={
            currentPageId === "cart" ? TextAttributes.NONE : TextAttributes.DIM
          }
        >
          cart
        </text>
        <Suspense fallback={<text>$ undef</text>}>
          <text>$ {cartTotal}</text>
        </Suspense>
        <Suspense fallback={<text attributes={TextAttributes.DIM}>[0]</text>}>
          <text>[{cartItems}]</text>
        </Suspense>
      </box>
    </box>
  )
}
