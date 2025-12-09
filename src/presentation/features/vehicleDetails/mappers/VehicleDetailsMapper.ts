import { VehicleModelDetailResponse } from "../../../../data/models/vehicle_model/VehicleModelDetailResponse";

export interface VehicleDetailUI {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    images: string[];
    battery: string;
    range: string;
    topSpeed: string;
    description: string;
    pricePerDay: number;
    depositAmount: number;
    colors: string[];
}

export class VehicleDetailMapper {
    static toUI(dto: VehicleModelDetailResponse): VehicleDetailUI {
        // Use provided images or fallback to placeholder
        const images = dto.images && dto.images.length > 0
            ? dto.images
            : [`https://via.placeholder.com/800x500/1a1a1a/ffffff?text=${encodeURIComponent(dto.modelName)}`];

        const primaryImage = images[0];

        return {
            id: dto.id,                                    // ← changed from vehicleModelId → id
            name: dto.modelName,
            category: dto.category || "ECONOMY",
            imageUrl: primaryImage,
            images,
            battery: dto.batteryCapacityKwh > 0 
                ? `${dto.batteryCapacityKwh} kWh` 
                : "",
            range: dto.maxRangeKm > 0 
                ? `${dto.maxRangeKm} Km` 
                : "",
            topSpeed: dto.maxSpeedKmh > 0 
                ? `${dto.maxSpeedKmh} km/h` 
                : "",
            description: dto.description || "No description.",
            pricePerDay: dto.rentalPricing?.rentalPrice || 0,   // ← nested now
            depositAmount: dto.depositAmount || 0,
            colors: this.getDefaultColors(), // Still no colors in detail API
        };
    }

    // Optional: Keep merge logic if you ever enrich with list data
    static mergeWithListData(
        detailData: VehicleDetailUI,
        listData: { imageUrl?: string; rentalPrice?: number; availableColors?: { colorName: string }[] }
    ): VehicleDetailUI {
        if (!listData) return detailData;

        const listColors = listData.availableColors?.length > 0
            ? listData.availableColors.map(c => this.nameToHex(c.colorName))
            : detailData.colors;

        return {
            ...detailData,
            imageUrl: listData.imageUrl || detailData.imageUrl,
            images: listData.imageUrl 
                ? [listData.imageUrl, ...detailData.images.filter(img => img !== listData.imageUrl)]
                : detailData.images,
            pricePerDay: listData.rentalPrice || detailData.pricePerDay,
            colors: listColors,
        };
    }

    static getDefaultColors(): string[] {
        return ["#1a1a1a", "#ffffff", "#FF4444", "#4169E1", "#FFD700", "#28a745"];
    }

    static nameToHex(name: string): string {
        const map: Record<string, string> = {
            black: "#1a1a1a",
            white: "#ffffff",
            red: "#FF4444",
            blue: "#4169E1",
            yellow: "#FFD700",
            green: "#28a745",
            silver: "#C0C0C0",
            gray: "#808080",
            grey: "#808080",
            mint: "#98FF98",
            "xanh mint": "#98FF98",
        };
        return map[name.toLowerCase()] || "#4169E1";
    }
}