import { Atom } from "@effect-atom/atom-react"

export type PageId = "shop" | "account" | "cart"

export const currentPageIdAtom = Atom.make<PageId>("shop")
