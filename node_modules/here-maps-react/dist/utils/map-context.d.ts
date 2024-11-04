/// <reference types="heremaps" />
import React from 'react';
export interface HEREMapContext {
    map?: H.Map;
    behavior?: H.mapevents.Behavior;
    ui?: H.ui.UI;
}
declare const MapContext: React.Context<HEREMapContext>;
export default MapContext;
//# sourceMappingURL=map-context.d.ts.map