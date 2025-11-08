import { VehicleModelSearchResponse } from "../../../../data/models/vehicle_model/VehicleModelSearchResponse";
import { ElectricVehicle } from "../ui/molecules/VehicleCard";
import { getColorHex } from "./colorMapper";

/**
 * Maps API VehicleModelSearchResponse to UI ElectricVehicle
 * Note: This represents a VEHICLE MODEL, not individual vehicles
 */
export const mapVehicleModelToElectricVehicle = (
    model: VehicleModelSearchResponse,
    rentalDays: number = 1
): ElectricVehicle => {
    // Get first available color, fallback to default
    const firstColor = model.availableColors[0]?.colorName || "Đen";
    const colorHex = getColorHex(firstColor);

    return {
        id: model.vehicleModelId,
        name: model.modelName,
        brand: "", // Removed as per requirements
        type: model.category, // ECONOMY, STANDARD, PREMIUM
        range: model.maxRangeKm > 0 ? `${model.maxRangeKm} Km` : "N/A",
        battery: `${model.batteryCapacityKwh} kWh`,
        seats: 2, // Always 2 for electric motorcycles
        color: firstColor,
        colorHex: colorHex,
        price: model.rentalPrice,
        features: [], // Removed as per requirements
        rentalDays: rentalDays,
        imageUrl: model.imageUrl,
    };
};

/**
 * Maps array of vehicle models
 */
export const mapVehicleModelsToElectricVehicles = (
    models: VehicleModelSearchResponse[],
    rentalDays: number = 1
): ElectricVehicle[] => {
    return models.map(model => mapVehicleModelToElectricVehicle(model, rentalDays));
};