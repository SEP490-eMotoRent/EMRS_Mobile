/**
 * Vietnamese Color Translator
 * Maps Vietnamese color names to hex codes
 */

export interface ColorInfo {
    name: string;      // Vietnamese name
    hex: string;       // Hex color code
    nameEn?: string;   // English name (optional)
}

/**
 * Vietnamese color name to hex mapping
 */
export const VIETNAMESE_COLORS: Record<string, string> = {
    // Whites & Creams
    'trắng': '#FFFFFF',
    'trắng ngọc trai': '#F8F6F0',
    'trắng ngọc triều': '#FFF8E7',
    'trắng phối đỏ': '#FFFFFF', // Base white (red accent elsewhere)
    
    // Blacks
    'đen': '#000000',
    'đen nhám': '#1a1a1a',
    'đen bóng': '#0a0a0a',
    'đen đen thể thao': '#000000',
    
    // Grays
    'xám': '#808080',
    'xám bạc': '#C0C0C0',
    'xám titan': '#878681',
    
    // Blues
    'xanh dương': '#0066CC',
    'xanh da trời': '#87CEEB',
    'xanh biển': '#006994',
    'xanh navy': '#000080',
    
    // Greens
    'xanh lá': '#00AA00',
    'xanh lá cây': '#228B22',
    'xanh mint': '#98FF98',
    'xanh rêu': '#8A9A5B',
    
    // Reds
    'đỏ': '#CC0000',
    'đỏ đen thể thao': '#8B0000',
    'đỏ tươi': '#FF0000',
    
    // Purples & Lavenders
    'tím': '#800080',
    'lavender': '#E6E6FA',
    'lavender sữa': '#F0E6FF',
    'tím than': '#4B0082',
    
    // Yellows & Golds
    'vàng': '#FFD700',
    'vàng gold': '#FFD700',
    'vàng chanh': '#FFF44F',
    
    // Browns & Oranges
    'nâu': '#8B4513',
    'cam': '#FFA500',
    'đồng': '#B87333',
    
    // Special colors
    'bạc': '#C0C0C0',
    'vàng đồng': '#CD7F32',
    'hồng': '#FFC0CB',
};

/**
 * Parse color string from API response
 * Handles formats like: "Trắng Ngọc Trai, Đen Nhám, Lavender Sữa, Vàng"
 * 
 * @param colorString - Comma-separated color names in Vietnamese
 * @returns Array of ColorInfo objects
 * 
 * @example
 * parseColorString("Trắng Ngọc Trai, Đen Nhám, Lavender Sữa, Vàng")
 * // Returns:
 * // [
 * //   { name: "Trắng Ngọc Trai", hex: "#F8F6F0" },
 * //   { name: "Đen Nhám", hex: "#1a1a1a" },
 * //   { name: "Lavender Sữa", hex: "#F0E6FF" },
 * //   { name: "Vàng", hex: "#FFD700" }
 * // ]
 */
export function parseColorString(colorString: string): ColorInfo[] {
    console.log('🔍 [parseColorString] Input:', colorString);
    
    if (!colorString || colorString.trim() === '') {
        console.log('⚠️ [parseColorString] Empty string, returning default black');
        return [{ name: 'Đen', hex: '#000000' }]; // Default to black
    }

    // Split by comma and clean up
    const colorNames = colorString
        .split(',')
        .map(c => c.trim())
        .filter(c => c.length > 0);

    console.log('🔍 [parseColorString] Split color names:', colorNames);

    return colorNames.map(name => {
        const normalizedName = name.toLowerCase();
        const hex = VIETNAMESE_COLORS[normalizedName] || '#808080'; // Default to gray if not found
        
        console.log(`🔍 [parseColorString] "${name}" → normalized: "${normalizedName}" → hex: ${hex}`);

        return {
            name: name,
            hex: hex,
        };
    });
}

/**
 * Get the primary (first) color from a color string
 * 
 * @example
 * getPrimaryColor("Trắng Ngọc Trai, Đen Nhám")
 * // Returns: { name: "Trắng Ngọc Trai", hex: "#F8F6F0" }
 */
export function getPrimaryColor(colorString: string): ColorInfo {
    const colors = parseColorString(colorString);
    return colors[0] || { name: 'Đen', hex: '#000000' };
}

/**
 * Get all colors as hex array (for color picker/wheel)
 * 
 * @example
 * getColorHexArray("Trắng, Đen, Vàng")
 * // Returns: ["#FFFFFF", "#000000", "#FFD700"]
 */
export function getColorHexArray(colorString: string): string[] {
    return parseColorString(colorString).map(c => c.hex);
}

/**
 * Check if a color is "light" (for text contrast)
 */
export function isLightColor(hex: string): boolean {
    // Remove # if present
    const color = hex.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16);
    const g = parseInt(color.substring(2, 4), 16);
    const b = parseInt(color.substring(4, 6), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5;
}

/**
 * Format colors for display
 * Shows up to 3 colors, with "+X more" if there are more
 * 
 * @example
 * formatColorsForDisplay("Trắng, Đen, Xanh, Đỏ")
 * // Returns: "Trắng, Đen, Xanh +1"
 */
export function formatColorsForDisplay(colorString: string, maxShow: number = 3): string {
    const colors = parseColorString(colorString);
    
    if (colors.length <= maxShow) {
        return colors.map(c => c.name).join(', ');
    }
    
    const shown = colors.slice(0, maxShow).map(c => c.name).join(', ');
    const remaining = colors.length - maxShow;
    
    return `${shown} +${remaining}`;
}