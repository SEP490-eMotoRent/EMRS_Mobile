export const COLOR_MAP: Record<string, string> = {
    // Reds
    "Đỏ": "#FF0000",
    "Đỏ đen thể thao": "#8B0000",
    "Trắng phối đỏ": "#FF6B6B",
    
    // Whites
    "Trắng": "#FFFFFF",
    "Trắng ngọc trai": "#F5F5F5",
    "Trắng ngọc triều": "#FAFAFA",
    
    // Blues
    "Xanh dương": "#0066FF",
    
    // Greens
    "Xanh lá": "#00CC66",
    
    // Grays/Silvers
    "Xám bạc": "#C0C0C0",
    "Đen": "#000000",
    "Đen bóng": "#1a1a1a",
    
    // Yellows
    "Vàng": "#FFD700",
};

export const getColorHex = (colorName: string): string => {
    return COLOR_MAP[colorName] || "#808080"; // Default to gray if color not found
};