import { VehicleModelDetailResponse } from "../../../../data/models/vehicle_model/VehicleModelDetailResponse";
import { VehicleModelResponse } from "../../../../data/models/vehicle_model/VehicleModelResponse";

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
    // Map DETAIL API response to UI
    static toUI(dto: VehicleModelDetailResponse): VehicleDetailUI {
        const images = dto.images && dto.images.length > 0 
            ? dto.images 
            : [`https://via.placeholder.com/800x500/1a1a1a/ffffff?text=${encodeURIComponent(dto.modelName)}`];

        return {
            id: dto.vehicleModelId,
            name: dto.modelName,
            category: dto.category,
            imageUrl: images[0], // Use first image as primary
            images: images,
            battery: dto.batteryCapacityKwh > 0 ? `${dto.batteryCapacityKwh} kWh` : "",
            range: dto.maxRangeKm > 0 ? `${dto.maxRangeKm} Km` : "",
            topSpeed: dto.maxSpeedKmh > 0 ? `${dto.maxSpeedKmh} km/h` : "",
            description: dto.description || "No description.",
            pricePerDay: dto.rentalPricing?.rentalPrice || 0,
            depositAmount: dto.depositAmount || 0,
            colors: this.getDefaultColors(), // Detail API doesn't have colors
        };
    }

    // Map LIST API response to UI (for enrichment)
    static fromListResponse(dto: VehicleModelResponse): Partial<VehicleDetailUI> {
        return {
            imageUrl: dto.imageUrl,
            pricePerDay: dto.rentalPrice,
            colors: (dto.availableColors || []).map(c => this.nameToHex(c.colorName)),
        };
    }

    // Merge detail and list data
    static mergeWithListData(
        detailData: VehicleDetailUI, 
        listData: VehicleModelResponse | undefined
    ): VehicleDetailUI {
        if (!listData) return detailData;

        return {
            ...detailData,
            // Prefer list API for these fields if available
            imageUrl: listData.imageUrl || detailData.imageUrl,
            images: listData.imageUrl ? [listData.imageUrl, ...detailData.images] : detailData.images,
            pricePerDay: listData.rentalPrice || detailData.pricePerDay,
            colors: listData.availableColors?.length > 0 
                ? listData.availableColors.map(c => this.nameToHex(c.colorName))
                : detailData.colors,
        };
    }

    // Default colors if API doesn't provide them
    static getDefaultColors(): string[] {
        return [
            "#1a1a1a", // Black
            "#ffffff", // White
            "#FF4444", // Red
            "#4169E1", // Blue
            "#FFD700", // Yellow
        ];
    }

    // Color name to hex converter
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
            "xanh mint": "#98FF98",
            mint: "#98FF98",
        };
        return map[name.toLowerCase()] || "#4169E1";
    }
}