/// <reference types="heremaps" />
import React from 'react';
import { HEvents } from './utils/map-events';
export interface HEREMapProps extends H.Map.Options, HEvents {
    apikey: string;
    mapContainerId?: string;
    animateCenter?: boolean;
    animateZoom?: boolean;
    hidpi?: boolean;
    interactive?: boolean;
    secure?: boolean;
    rasterType?: keyof H.service.DefaultLayers['raster'];
    vectorType?: keyof H.service.DefaultLayers['vector']['normal'];
}
export declare const HEREMap: React.FC<HEREMapProps>;
export default HEREMap;
//# sourceMappingURL=HEREMap.d.ts.map