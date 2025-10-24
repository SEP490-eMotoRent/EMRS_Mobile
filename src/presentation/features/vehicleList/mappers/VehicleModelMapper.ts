// src/presentation/features/vehicleList/mappers/VehicleModelMapper.ts
import { VehicleModel } from "../../../../domain/entities/vehicle/VehicleModel";
import { Motorcycle } from "../ui/orgamism/MotorcycleCard";

export class VehicleModelMapper {
    static toMotorcycle(model: VehicleModel, distance: number = 0): Motorcycle {
        const {
            id,
            modelName = "Unnamed Model",
            category = "",
            batteryCapacityKwh = 0,
            maxRangeKm = 0,
            rentalPricing,
        } = model;

        const dailyPrice = rentalPricing?.rentalPrice ?? 0;

        const imageUrl = this.generatePlaceholderImage(modelName, "black");

        // Hide 0 values
        const range = maxRangeKm > 0 ? `${maxRangeKm} Km` : "";
        const battery = batteryCapacityKwh > 0 ? `${batteryCapacityKwh} kWh` : "";

        const features = ["GPS Tracking", "Smart Lock", "USB Charging"];

        return {
            id: id,
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
            deliveryAvailable: true,
            branchName: "Available at multiple locations",
            color: "#4169E1", // default blue
        };
    }

    static toMotorcycles(models: VehicleModel[], distances: number[] = []): Motorcycle[] {
        return models.map((m, i) => this.toMotorcycle(m, distances[i] ?? 0));
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
        return map[name.toLowerCase()] ?? "#1a1a1a";
    }

    private static isLightColor(hex: string): boolean {
        const rgb = parseInt(hex, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = rgb & 0xff;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma > 128;
    }

    private static uuidToNumber(uuid: string): number {
        return parseInt(uuid.substring(0, 8), 16);
    }
}