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

        // ✅ Use actual image from API if available, otherwise placeholder
        const imageUrl = (model as any).imageUrl?.trim() 
            ? (model as any).imageUrl 
            : this.generatePlaceholderImage(modelName, "black");

        // ✅ Show values even if 0
        const range = `${maxRangeKm} Km`;
        const battery = `${batteryCapacityKwh} kWh`;

        // ✅ Get color from availableColors array
        const availableColors = (model as any).availableColors || [];
        const firstColor = availableColors.length > 0 
            ? availableColors[0].colorName 
            : "Blue";
        const colorHex = this.getColorHex(firstColor);

        const features = ["GPS Tracking", "Smart Lock", "USB Charging"];

        return {
            id: id,
            name: modelName,
            brand: this.extractBrand(modelName),
            variant: category,
            image: imageUrl, // ✅ Real image URL
            price: dailyPrice,
            distance,
            range, // ✅ Always shows, even if 0
            battery, // ✅ Always shows, even if 0
            seats: 2,
            features,
            deliveryAvailable: true,
            branchName: "Available at multiple locations",
            color: colorHex, // ✅ Actual color from API
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
        return map[name.toLowerCase()] ?? "#4169E1"; // Default to blue
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