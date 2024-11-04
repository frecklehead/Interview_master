/// <reference types="heremaps" />
/**
 * Map for image URL strings against H.map.Icon instances
 */
export declare const Icons: Map<string, H.map.Icon>;
/**
 * Returns the Icon for the input bitmap URL string, ensuring that no more
 * than one Icon is created for each bitmap
 * @param bitmap {string} - The location of the bitmap to be used as an icon
 */
export default function getMarkerIcon(bitmap: string): H.map.Icon | undefined;
//# sourceMappingURL=get-marker-icon.d.ts.map