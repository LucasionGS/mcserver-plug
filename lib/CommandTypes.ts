export type TellRawPrimatives = string | number | boolean;
export type TellRawObjectClickEventActions = keyof TellRawObjectClickEventActionsValues;
export interface TellRawObjectClickEventActionsValues {
  run_command: string;
  open_url: string;
  suggest_command: string;
  copy_to_clipboard: string;
}
export interface TellRawObject<TClickEventAction extends TellRawObjectClickEventActions = TellRawObjectClickEventActions> {
  text?: TellRawPrimatives,
  color?: string,
  bold?: boolean,
  italic?: boolean,
  underlined?: boolean,
  strikethrough?: boolean,
  obfuscated?: boolean,
  clickEvent?: {
    action?: TClickEventAction,
    value?: TellRawObjectClickEventActionsValues[TellRawObjectClickEventActions]
  }
}
export type TellRawTextObject = (TellRawObject | TellRawPrimatives)[] | TellRawObject | TellRawPrimatives;