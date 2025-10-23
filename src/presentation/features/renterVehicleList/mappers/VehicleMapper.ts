import { Vehicle } from "../../../../domain/entities/vehicle/Vehicle";
import { Motorcycle } from "../ui/orgamism/MotorcycleCard";

/**
 * Maps domain Vehicle entity to UI Motorcycle model
 */
export class VehicleMapper {
    /**
     * Convert Vehicle entity to Motorcycle UI model
     */
    static toMotorcycle(vehicle: Vehicle, distance: number = 0): Motorcycle {
        // Get vehicle model info
        const modelName = vehicle.vehicleModel.modelName;
        const category = vehicle.vehicleModel.category;
        const batteryCapacity = vehicle.vehicleModel.batteryCapacityKwh;
        const maxRange = vehicle.vehicleModel.maxRangeKm;
        
        // Get pricing info
        const dailyPrice = vehicle.vehicleModel.rentalPricing.rentalPrice;

        // Generate placeholder image based on color
        const imageUrl = this.generatePlaceholderImage(
            modelName, 
            vehicle.color
        );

        // Extract features from vehicle
        const features = this.extractFeatures(vehicle);

        // Map status to availability
        const deliveryAvailable = vehicle.status === 'Available';

        return {
            id: parseInt(vehicle.id.substring(0, 8), 16), // Convert UUID to number
            name: modelName,
            brand: this.extractBrand(modelName),
            variant: category,
            image: imageUrl,
            price: dailyPrice,
            distance: distance,
            range: `${maxRange} Km`,
            battery: `${batteryCapacity} kWh`,
            seats: 2, // Default to 2 seats for motorcycles
            features: features,
            deliveryAvailable: deliveryAvailable,
            branchName: vehicle.branch.branchName,
            color: this.getColorHex(vehicle.color)
        };
    }

    /**
     * Convert array of Vehicles to Motorcycles
     */
    static toMotorcycles(vehicles: Vehicle[]): Motorcycle[] {
        return vehicles.map(vehicle => this.toMotorcycle(vehicle));
    }

    /**
     * Extract brand name from model name
     * Example: "VinFast Evo200" -> "VinFast"
     */
    private static extractBrand(modelName: string): string {
        const words = modelName.split(' ');
        return words.length > 1 ? words[0] : modelName;
    }

    /**
     * Extract features from vehicle data
     */
    private static extractFeatures(vehicle: Vehicle): string[] {
        const features: string[] = [];

        // Battery health feature
        if (vehicle.batteryHealthPercentage >= 90) {
            features.push('Excellent Battery');
        } else if (vehicle.batteryHealthPercentage >= 75) {
            features.push('Good Battery');
        }

        // Maintenance status
        if (vehicle.isMaintenanceDue()) {
            features.push('Maintenance Due');
        } else {
            features.push('Well Maintained');
        }

        // Recent vehicle
        if (vehicle.purchaseDate) {
            const yearDiff = new Date().getFullYear() - vehicle.purchaseDate.getFullYear();
            if (yearDiff <= 1) {
                features.push('New Vehicle');
            }
        }

        // Add default features if we don't have enough
        const defaultFeatures = ['GPS Tracking', 'Smart Lock', 'USB Charging'];
        while (features.length < 3 && defaultFeatures.length > 0) {
            const feature = defaultFeatures.shift();
            if (feature) features.push(feature);
        }

        return features;
    }

    /**
     * Get hex color from color name
     */
    private static getColorHex(colorName: string): string {
        const colorMap: Record<string, string> = {
            'black': '#1a1a1a',
            'white': '#ffffff',
            'red': '#FF4444',
            'blue': '#4169E1',
            'yellow': '#FFD700',
            'green': '#28a745',
            'silver': '#C0C0C0',
            'gray': '#808080',
            'grey': '#808080',
        };

        const lowerColor = colorName.toLowerCase();
        return colorMap[lowerColor] || '#1a1a1a'; // Default to black
    }

    /**
     * Generate placeholder image URL
     */
    private static generatePlaceholderImage(
        modelName: string, 
        color: string
    ): string {
        const hexColor = this.getColorHex(color).replace('#', '');
        const textColor = this.isLightColor(hexColor) ? '000000' : 'ffffff';
        const encodedText = encodeURIComponent(modelName);
        
        return `https://via.placeholder.com/800x450/${hexColor}/${textColor}?text=${encodedText}`;
    }

    /**
     * Check if color is light (for text contrast)
     */
    private static isLightColor(hex: string): boolean {
        const rgb = parseInt(hex, 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        return luma > 128;
    }
}