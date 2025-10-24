import { VehicleModelDetailResponse } from "../../../../data/models/vehicle_model/VehicleModelDetailResponse";

export interface VehicleDetailUI {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    battery: string;
    range: string;
    topSpeed: string;
    description: string;
    pricePerDay: number;  // NUMBER
    colors: string[];
    }

export class VehicleDetailMapper {
    static toUI(dto: VehicleModelDetailResponse): VehicleDetailUI {
    return {
        id: dto.vehicleModelId,
        name: dto.modelName,
        category: dto.category,
        imageUrl: dto.imageUrl?.trim()
        ? dto.imageUrl
        : `https://via.placeholder.com/800x500/1a1a1a/ffffff?text=${encodeURIComponent(dto.modelName)}`,
        battery: dto.batteryCapacityKwh > 0 ? `${dto.batteryCapacityKwh} kWh` : "",
        range: dto.maxRangeKm > 0 ? `${dto.maxRangeKm} Km` : "",
        topSpeed: dto.maxSpeedKmh > 0 ? `${dto.maxSpeedKmh} km/h` : "",
        description: dto.description || "No description.",
        pricePerDay: dto.rentalPrice,  // NUMBER
        colors: dto.availableColors.map(c => this.nameToHex(c.colorName)),
    };
    }

    private static nameToHex(name: string): string {
        const map: Record<string, string> = {
        black: "#1a1a1a", white: "#ffffff", red: "#FF4444", blue: "#4169E1",
        yellow: "#FFD700", green: "#28a745", silver: "#C0C0C0", gray: "#808080"
        };
        return map[name.toLowerCase()] || "#4169E1";
    }
}