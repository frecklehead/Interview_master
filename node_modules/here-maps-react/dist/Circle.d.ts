/// <reference types="heremaps" />
import React from 'react';
export interface CircleProps extends H.map.Circle.Options, H.geo.IPoint {
    strokeColor?: string;
    lineWidth?: number;
    fillColor?: string;
    radius: number;
}
export declare const Circle: React.FC<CircleProps>;
export default Circle;
//# sourceMappingURL=Circle.d.ts.map