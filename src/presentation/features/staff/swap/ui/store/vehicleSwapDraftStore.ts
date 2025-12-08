export type SwapPhotoMap = Partial<Record<"front" | "back" | "left" | "right", string>>;

export interface SwapVehicleInfo {
  odometer?: string;
  battery?: string;
  conditionNote?: string;
  photos: SwapPhotoMap;
  licensePlate?: string;
  modelName?: string;
  vehicleId?: string;
  checklistUri?: string | null;
}

export interface SwapDraft {
  bookingId?: string;
  returnReceiptId?: string;
  currentVehicleId?: string;
  oldVehicle: SwapVehicleInfo;
  newVehicle: SwapVehicleInfo;
}

const initialDraft: SwapDraft = {
  bookingId: undefined,
  returnReceiptId: undefined,
  currentVehicleId: undefined,
  oldVehicle: { photos: {} },
  newVehicle: { photos: {} },
};

let draft: SwapDraft = { ...initialDraft };

export const vehicleSwapDraftStore = {
  init(params: { bookingId: string; returnReceiptId?: string; currentVehicleId?: string;  licensePlate?: string; modelName?: string }) {
    draft = {
      ...initialDraft,
      bookingId: params.bookingId,
      returnReceiptId: params.returnReceiptId,
      currentVehicleId: params.currentVehicleId,
      oldVehicle: {
        photos: {},
        licensePlate: params.licensePlate,
        modelName: params.modelName,
        vehicleId: params.currentVehicleId,
      },
      newVehicle: { photos: {} },
    };
  },
  setSelectedNewVehicle(meta: { vehicleId: string; licensePlate?: string; modelName?: string }) {
    draft.newVehicle.vehicleId = meta.vehicleId;
    draft.newVehicle.licensePlate = meta.licensePlate;
    draft.newVehicle.modelName = meta.modelName;
  },
  setOldVehicleInfo(info: Omit<SwapVehicleInfo, "photos"> & { photos?: SwapPhotoMap }) {
    draft.oldVehicle = {
      ...draft.oldVehicle,
      ...info,
      photos: info.photos ?? draft.oldVehicle.photos,
    };
  },
  setNewVehicleInfo(info: Omit<SwapVehicleInfo, "photos"> & { photos?: SwapPhotoMap }) {
    draft.newVehicle = {
      ...draft.newVehicle,
      ...info,
      photos: info.photos ?? draft.newVehicle.photos,
    };
  },
  getDraft(): SwapDraft {
    return draft;
  },
  clear() {
    draft = { ...initialDraft };
  },
};

