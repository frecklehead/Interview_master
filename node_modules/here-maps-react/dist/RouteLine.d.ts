/// <reference types="heremaps" />
import React from 'react';
declare type Shape = string[];
export interface RouteLineProps extends H.map.Polyline.Options {
    strokeColor?: string;
    lineWidth?: number;
    shape: Shape;
}
export declare const RouteLine: React.FC<RouteLineProps>;
export default RouteLine;
//# sourceMappingURL=RouteLine.d.ts.map