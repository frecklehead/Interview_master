/// <reference types="heremaps" />
import React from 'react';
import { HEvents } from './utils/map-events';
export interface MarkerProps extends H.map.Marker.Options, H.geo.IPoint, HEvents {
    bitmap?: string;
    draggable?: boolean;
}
export declare const Marker: React.FC<MarkerProps>;
export default Marker;
//# sourceMappingURL=Marker.d.ts.map