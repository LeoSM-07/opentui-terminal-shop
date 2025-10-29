import { render } from "@opentui/react"
import { Suspense } from "react"

import { Header } from "@/components/header"
import { ShopSkeleton, ShopTab } from "@/components/shop"
import { currentPageIdAtom, type PageId } from "@/data/navigation"
import { Colors } from "@/utils"
import { useAtomValue } from "@effect-atom/atom-react"
import { CartContents, CartEmptyView } from "./components/cart"

function App() {
  const currentPageId = useAtomValue(currentPageIdAtom)

  const pageMap: Record<PageId, React.ReactNode> = {
    shop: (
      <Suspense fallback={<ShopSkeleton />}>
        <ShopTab />
      </Suspense>
    ),
    account: (
      <box>
        <text>Not Implemented</text>
      </box>
    ),
    cart: (
      <Suspense fallback={<CartEmptyView />}>
        <CartContents />
      </Suspense>
    ),
  }

  return (
    <box
      backgroundColor={Colors.background}
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
    >
      <box width={80} backgroundColor={"#FF5C02"} alignItems="center">
        <text>{"opentui demo of terminal.shop"}</text>
      </box>
      <box width="100%" flexGrow={1} maxHeight={32} maxWidth={80}>
        <Header />
        {pageMap[currentPageId]}
      </box>
    </box>
  )
}

render(<App />)
