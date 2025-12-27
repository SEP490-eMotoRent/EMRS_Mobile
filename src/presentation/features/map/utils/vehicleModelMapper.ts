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
    // ✅ DEBUG: Log the raw model data
    // console.log('🔍 RAW MODEL DATA:', JSON.stringify(model, null, 2));
    
    // Get first available color, fallback to default
    const firstColor = model.availableColors[0]?.colorName || "Đen";
    const colorHex = getColorHex(firstColor);

    // ✅ FIX: Handle empty/null/undefined modelName with proper fallback
    const vehicleName = model.modelName?.trim() || "Xe Điện";
    
    // ✅ DEBUG: Log the extracted name
    // console.log('🔍 EXTRACTED NAME:', vehicleName, 'FROM:', model.modelName);

    const mapped = {
        id: model.vehicleModelId,
        name: vehicleName,  // ✅ FIXED: Use fallback name
        brand: "",
        type: model.category,
        range: model.maxRangeKm > 0 ? `${model.maxRangeKm} Km` : "N/A",
        battery: `${model.batteryCapacityKwh} kWh`,
        seats: 2,
        color: firstColor,
        colorHex: colorHex,
        price: model.rentalPrice,
        features: [],
        rentalDays: rentalDays,
        imageUrl: model.imageUrl || null,
    };
    
    // ✅ DEBUG: Log the final mapped object
    // console.log('🔍 MAPPED VEHICLE:', JSON.stringify(mapped, null, 2));
    
    return mapped;
};

/**
 * Maps array of vehicle models
 */
export const mapVehicleModelsToElectricVehicles = (
    models: VehicleModelSearchResponse[],
    rentalDays: number = 1
): ElectricVehicle[] => {
    // console.log('🔍 MAPPING', models.length, 'VEHICLES');
    return models.map(model => mapVehicleModelToElectricVehicle(model, rentalDays));
};