import { VehicleModel } from "../../../../domain/entities/vehicle/VehicleModel";
import { VehicleModelResponse } from "../../../../data/models/vehicle_model/VehicleModelResponse";
import { VehicleModelSearchItem } from "../../../../data/models/vehicle_model/VehicleModelPaginatedSearchResponse";
import { Motorcycle } from "../ui/orgamism/MotorcycleCard";
import { calculateRentalPrice } from "../../../common/utils/rentalPriceCalculator";

export class VehicleModelMapper {
    static toMotorcycle(
        model: VehicleModel,
        dto: VehicleModelResponse,
        distance: number = 0,
        dateRange?: string  // ✅ NEW: Optional date range for price calculation
    ): Motorcycle {
        const {
            id,
            modelName = "Unnamed Model",
            category = "",
            batteryCapacityKwh = 0,
            maxRangeKm = 0,
        } = model;

        const dailyPrice = model.rentalPricing?.rentalPrice ?? 0;

        // ✅ Calculate rental duration and total price
        let rentalDays = 1;
        let totalPrice = dailyPrice;
        
        if (dateRange && dateRange !== "Chọn Ngày") {
            const priceCalculation = calculateRentalPrice(dateRange, dailyPrice);
            if (priceCalculation) {
                rentalDays = priceCalculation.duration.totalDays;
                totalPrice = priceCalculation.total;
            }
        }

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
            // ✅ NEW: Include rental duration and total
            rentalDays,
            totalPrice,
        };
    }

    static toMotorcycles(
        models: VehicleModel[],
        dtos: VehicleModelResponse[],
        distances: number[] = [],
        dateRange?: string  // ✅ NEW
    ): Motorcycle[] {
        return models.map((m, i) => this.toMotorcycle(m, dtos[i], distances[i] ?? 0, dateRange));
    }

    // ✅ Updated: Direct mapping from paginated search items with price calculation
    static fromSearchItem(
        item: VehicleModelSearchItem,
        distance: number = 0,
        dateRange?: string  // ✅ NEW
    ): Motorcycle {
        const {
            vehicleModelId,
            modelName = "Unnamed Model",
            category = "",
            batteryCapacityKwh = 0,
            maxRangeKm = 0,
            rentalPrice = 0,
            imageUrl,
            availableColors = [],
            countTotal = 0,
            countAvailable = 0,
        } = item;

        // ✅ Calculate rental duration and total price
        let rentalDays = 1;
        let totalPrice = rentalPrice;
        
        if (dateRange && dateRange !== "Chọn Ngày") {
            const priceCalculation = calculateRentalPrice(dateRange, rentalPrice);
            if (priceCalculation) {
                rentalDays = priceCalculation.duration.totalDays;
                totalPrice = priceCalculation.total;
            }
        }

        const imageUrlFinal = imageUrl?.trim() || this.generatePlaceholderImage(modelName, "black");

        const range = maxRangeKm > 0 ? `${maxRangeKm} Km` : "N/A";
        const battery = batteryCapacityKwh > 0 ? `${batteryCapacityKwh} kWh` : "N/A";

        const firstColor = availableColors.length > 0 ? availableColors[0].colorName : "Blue";
        const colorHex = this.getColorHex(firstColor);

        // Only include Support Charging and GPS Tracking
        const features: string[] = [];
        if (batteryCapacityKwh > 0) {
            features.push("Support Charging");
        }
        features.push("GPS Tracking");

        // ✅ Show availability status
        const availabilityStatus = countAvailable > 0 
            ? `${countAvailable} available` 
            : "Not available";

        return {
            id: vehicleModelId,
            name: modelName,
            brand: this.extractBrand(modelName),
            variant: category,
            image: imageUrlFinal,
            price: rentalPrice,
            distance,
            range,
            battery,
            seats: 2,
            features,
            branchName: availabilityStatus,
            color: colorHex,
            countTotal,
            countAvailable,
            isAvailable: countAvailable > 0,
            // ✅ NEW: Include rental duration and total
            rentalDays,
            totalPrice,
        };
    }

    // ✅ Updated: Batch mapping from search items with date range
    static fromSearchItems(
        items: VehicleModelSearchItem[],
        distances: number[] = [],
        dateRange?: string  // ✅ NEW
    ): Motorcycle[] {
        return items.map((item, i) => 
            this.fromSearchItem(item, distances[i] ?? 0, dateRange)
        );
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
            "đen": "#1a1a1a",
            "black": "#1a1a1a",
            "trắng": "#ffffff",
            "white": "#ffffff",
            "đỏ": "#FF4444",
            "red": "#FF4444",
            "xanh dương": "#4169E1",
            "blue": "#4169E1",
            "xanh lá": "#28a745",
            "green": "#28a745",
            "vàng": "#FFD700",
            "yellow": "#FFD700",
            "xám": "#808080",
            "gray": "#808080",
            "grey": "#808080",
            "xám bạc": "#C0C0C0",
            "silver": "#C0C0C0",
            "xanh mint": "#98D8C8",
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