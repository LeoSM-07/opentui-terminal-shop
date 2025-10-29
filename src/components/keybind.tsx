import { TextAttributes } from "@opentui/core"

export function Keybind({
  label,
  description,
}: {
  label: string
  description?: string
}) {
  return (
    <box flexDirection="row" gap={1}>
      <text attributes={TextAttributes.BOLD}>{label}</text>
      {description && (
        <text attributes={TextAttributes.DIM}>{description}</text>
      )}
    </box>
  )
}
