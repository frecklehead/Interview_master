/// <reference types="heremaps" />
export interface HEvents {
    onPointerDown?: HEvent;
    onPointerUp?: HEvent;
    onPointerMove?: HEvent;
    onPointerEnter?: HEvent;
    onPointerLeave?: HEvent;
    onPointerCancel?: HEvent;
    onDragStart?: HEvent;
    onDrag?: HEvent;
    onDragEnd?: HEvent;
    onTap?: HEvent;
    onDoubleTap?: HEvent;
    onLongPress?: HEvent;
}
export declare type HEvent = (e: H.util.Event) => void;
export interface Events {
    onPointerDown: string;
    onPointerUp: string;
    onPointerMove: string;
    onPointerEnter: string;
    onPointerLeave: string;
    onPointerCancel: string;
    onDragStart: string;
    onDrag: string;
    onDragEnd: string;
    onTap: string;
    onDoubleTap: string;
    onLongPress: string;
}
export declare const events: Events;
//# sourceMappingURL=map-events.d.ts.map