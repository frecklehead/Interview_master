/// <reference types="heremaps" />
/**
 * Map for HTML strings against H.map.DomIcon instances
 */
export declare const DomIcons: Map<string, H.map.DomIcon>;
/**
 * Returns the DOM Icon for the input HTML string, ensuring that no more
 * than one DOM Icon is created for each HTML string
 * @param html {string} - A string containing the markup to be used as a Dom Icon.
 */
export default function getDomMarkerIcon(html: string): H.map.DomIcon | undefined;
//# sourceMappingURL=get-dom-marker-icon.d.ts.map