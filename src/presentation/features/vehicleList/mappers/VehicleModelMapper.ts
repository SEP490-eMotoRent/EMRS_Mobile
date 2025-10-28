import { VehicleModel } from "../../../../domain/entities/vehicle/VehicleModel";
import { VehicleModelResponse } from "../../../../data/models/vehicle_model/VehicleModelResponse";
import { Motorcycle } from "../ui/orgamism/MotorcycleCard";

export class VehicleModelMapper {
    static toMotorcycle(
        model: VehicleModel,
        dto: VehicleModelResponse,
        distance: number = 0
    ): Motorcycle {
        const {
            id,
            modelName = "Unnamed Model",
            category = "",
            batteryCapacityKwh = 0,
            maxRangeKm = 0,
        } = model;

        const dailyPrice = model.rentalPricing?.rentalPrice ?? 0;

        const imageUrl = dto.imageUrl?.trim() || this.generatePlaceholderImage(modelName, "black");

        const range = maxRangeKm > 0 ? `${maxRangeKm} Km` : "N/A";
        const battery = batteryCapacityKwh > 0 ? `${batteryCapacityKwh} kWh` : "N/A";

        const availableColors = dto.availableColors || [];
        const firstColor = availableColors.length > 0 ? availableColors[0].colorName : "Blue";
        const colorHex = this.getColorHex(firstColor);

        // Only include Support Charging and GPS Tracking
        const features: string[] = [];
        if (batteryCapacityKwh > 0) {
            features.push("Support Charging");
        }
        features.push("GPS Tracking");

        return {
            id,
            name: modelName,
            brand: this.extractBrand(modelName),
            variant: category,
            image: imageUrl,
            price: dailyPrice,
            distance,
            range,
            battery,
            seats: 2,
            features,
            branchName: "Available at multiple locations",
            color: colorHex,
        };
    }

    static toMotorcycles(
        models: VehicleModel[],
        dtos: VehicleModelResponse[],
        distances: number[] = []
    ): Motorcycle[] {
        return models.map((m, i) => this.toMotorcycle(m, dtos[i], distances[i] ?? 0));
    }

    private static extractBrand(name: string): string {
        const words = name.split(" ");
        return words.length > 1 ? words[0] : name;
    }

    private static generatePlaceholderImage(modelName: string, color: string): string {
        const hex = this.getColorHex(color).replace("#", "");
        const textColor = this.isLightColor(hex) ? "000000" : "ffffff";
        const text = encodeURIComponent(modelName);
        return `https://via.placeholder.com/800x450/${hex}/${textColor}?text=${text}`;
    }

    private static getColorHex(name: string): string {
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
        };
        return map[name.toLowerCase()] ?? "#4169E1";
    }

    private static isLightColor(hex: string): boolean {
        const rgb = parseInt(hex, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma > 128;
    }
}