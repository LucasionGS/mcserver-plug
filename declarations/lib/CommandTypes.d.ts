export declare type TellRawPrimatives = string | number | boolean;
export declare type TellRawObjectClickEventActions = keyof TellRawObjectClickEventActionsValues;
export interface TellRawObjectClickEventActionsValues {
    run_command: string;
    open_url: string;
    suggest_command: string;
    copy_to_clipboard: string;
}
export declare type TellRawObjectHoverEventActions = keyof TellRawObjectHoverEventActionsValues;
export interface TellRawObjectHoverEventActionsValues {
    show_item: unknown;
    show_entity: unknown;
    show_text: TellRawObject;
}
export interface TellRawObject {
    text?: TellRawPrimatives;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    underlined?: boolean;
    strikethrough?: boolean;
    obfuscated?: boolean;
}
export interface TellRawObjectWithEvents<TClickEventAction extends TellRawObjectClickEventActions = TellRawObjectClickEventActions> extends TellRawObject {
    clickEvent?: {
        action?: TClickEventAction;
        value?: TellRawObjectClickEventActionsValues[TellRawObjectClickEventActions];
    };
    hoverEvent?: {
        action?: TellRawObjectHoverEventActions;
        contents?: TellRawTextObject;
    };
}
export declare type TellRawTextObject = (TellRawObject | TellRawPrimatives)[] | TellRawObject | TellRawPrimatives;
export declare type TellRawTextObjectWithEvents = (TellRawObjectWithEvents | TellRawPrimatives)[] | TellRawObjectWithEvents | TellRawPrimatives;
