import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { StepProgressBar } from "../atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";

type ManualInspectionScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "ManualInspection"
>;

type ManualInspectionScreenRouteProp = RouteProp<
  StaffStackParamList,
  "ManualInspection"
>;

interface InspectionItem {
  id: string;
  label: string;
  checked: boolean;
}

interface InspectionCategory {
  id: string;
  title: string;
  items: InspectionItem[];
  expanded: boolean;
}

export const ManualInspectionScreen: React.FC = () => {
  const navigation = useNavigation<ManualInspectionScreenNavigationProp>();
  const route = useRoute<ManualInspectionScreenRouteProp>();
  const { bookingId, photos } = route.params || {};

  const [endOdometerKm, setEndOdometerKm] = useState("");
  const [endBatteryPercentage, setEndBatteryPercentage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [categories, setCategories] = useState<InspectionCategory[]>([
    {
      id: "body-paint",
      title: "Body & Paint",
      expanded: true,
      items: [
        { id: "1", label: "Đèn hậu hoạt động tốt", checked: false },
        { id: "2", label: "Gương chiếu hậu nguyên vẹn", checked: false },
        { id: "3", label: "Phanh trước/sau hoạt động", checked: false },
        { id: "4", label: "Không có vết xước trên thân xe", checked: false },
        { id: "5", label: "Bề mặt sơn không bị bong tróc", checked: false },
        { id: "6", label: "Cửa xe đóng mở bình thường", checked: false },
        { id: "7", label: "Kính chắn gió không vỡ", checked: false },
        { id: "8", label: "Logo và nhãn hiệu còn nguyên", checked: false },
      ],
    },
    {
      id: "wheels-tires",
      title: "Wheels & Tires",
      expanded: false,
      items: [
        { id: "9", label: "Lốp không bị mòn quá mức", checked: false },
        { id: "10", label: "Vành xe không bị cong", checked: false },
        { id: "11", label: "Áp suất lốp đúng tiêu chuẩn", checked: false },
        { id: "12", label: "Không có vết nứt trên lốp", checked: false },
      ],
    },
    {
      id: "lights-signals",
      title: "Lights & Signals",
      expanded: false,
      items: [
        { id: "13", label: "Đèn pha hoạt động", checked: false },
        { id: "14", label: "Đèn xi-nhan hoạt động", checked: false },
        { id: "15", label: "Đèn phanh hoạt động", checked: false },
        { id: "16", label: "Đèn báo rẽ hoạt động", checked: false },
        { id: "17", label: "Đèn cảnh báo hoạt động", checked: false },
        { id: "18", label: "Đèn nội thất hoạt động", checked: false },
      ],
    },
    {
      id: "interior-features",
      title: "Interior & Features",
      expanded: false,
      items: [
        { id: "19", label: "Ghế ngồi không bị rách", checked: false },
        { id: "20", label: "Tay lái hoạt động tốt", checked: false },
        { id: "21", label: "Công tắc và nút bấm hoạt động", checked: false },
        { id: "22", label: "Màn hình hiển thị hoạt động", checked: false },
        { id: "23", label: "Hệ thống điều hòa hoạt động", checked: false },
        { id: "24", label: "Ổ cắm sạc hoạt động", checked: false },
      ],
    },
    {
      id: "safety-equipment",
      title: "Safety Equipment",
      expanded: false,
      items: [
        { id: "25", label: "Mũ bảo hiểm có sẵn", checked: false },
        { id: "26", label: "Áo phản quang có sẵn", checked: false },
        { id: "27", label: "Bộ cứu thương có sẵn", checked: false },
        { id: "28", label: "Còi xe hoạt động", checked: false },
      ],
    },
  ]);

  const checklistRef = useRef<View>(null);
  const [vehicleExpanded, setVehicleExpanded] = useState(false);

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : cat
      )
    );
  };

  const getTotalItems = () => {
    return categories.reduce((total, cat) => total + cat.items.length, 0);
  };

  const getCheckedItems = () => {
    return categories.reduce(
      (total, cat) => total + cat.items.filter((item) => item.checked).length,
      0
    );
  };

  const getCategoryCheckedCount = (category: InspectionCategory) => {
    return category.items.filter((item) => item.checked).length;
  };

  const handleCompleteInspection = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!endOdometerKm || !endBatteryPercentage) {
        Alert.alert("Lỗi", "Vui lòng nhập số km và % pin cuối");
        setIsSubmitting(false);
        return;
      }

      let checklistUri: string | null = null;
      if (checklistRef.current) {
        checklistUri = await captureRef(checklistRef.current, {
          format: "png",
          quality: 0.8,
          result: "tmpfile", // tạo file thật để upload
        });
      }

      navigation.navigate("AdditionalFees", {
        endOdometerKm: parseInt(endOdometerKm),
        endBatteryPercentage: parseInt(endBatteryPercentage),
        bookingId: bookingId,
        returnImageUrls: photos,
        checkListImage: checklistUri,
      });
    } catch (error) {
      Alert.alert("Lỗi", `Không thể gửi kiểm tra: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItems = getTotalItems();
  const checkedItems = getCheckedItems();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Manual Inspection"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />

        <StepProgressBar currentStep={3} totalSteps={4} />

        {/* Overall Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Progress</Text>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${(checkedItems / totalItems) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {checkedItems}/{totalItems} items checked
          </Text>
        </View>

        {/* Vehicle Information Card */}
        <TouchableOpacity
          style={styles.vehicleCard}
          onPress={() => setVehicleExpanded(!vehicleExpanded)}
          activeOpacity={0.8}
        >
          <View style={styles.vehicleCardContent}>
            <View>
              <Text style={styles.vehicleModel}>VinFast Evo200</Text>
              <Text style={styles.vehiclePlate}>59X1-12345</Text>
            </View>
            <AntDesign
              name={vehicleExpanded ? "up" : "down"}
              size={16}
              color={colors.text.secondary}
            />
          </View>
        </TouchableOpacity>

        {/* Vehicle Status Inputs */}
        <View style={styles.statusInputsCard}>
          <Text style={styles.statusInputsTitle}>Vehicle Status</Text>

          {/* Battery Percentage Input */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Entypo name="battery" size={18} color="#4CAF50" />
              <Text style={styles.inputLabel}>Battery Percentage</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <AntDesign
                  name="edit"
                  size={16}
                  color={colors.text.secondary}
                />
              </View>
              <TextInput
                style={styles.input}
                value={endBatteryPercentage}
                onChangeText={setEndBatteryPercentage}
                keyboardType="numeric"
                placeholder="Enter battery %"
                placeholderTextColor={colors.text.secondary}
              />
              <Text style={styles.inputUnit}>%</Text>
            </View>
            <View style={styles.inputHelper}>
              <AntDesign
                name="clock-circle"
                size={12}
                color={colors.text.secondary}
              />
              <Text style={styles.inputHelperText}>
                Current value: {endBatteryPercentage}%
              </Text>
            </View>
          </View>

          {/* Odometer Input */}
          <View style={styles.inputGroup}>
            <View style={styles.inputHeader}>
              <Entypo name="gauge" size={18} color="#C9B6FF" />
              <Text style={styles.inputLabel}>End Odometer (km)</Text>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <AntDesign
                  name="edit"
                  size={16}
                  color={colors.text.secondary}
                />
              </View>
              <TextInput
                style={styles.input}
                value={endOdometerKm}
                onChangeText={setEndOdometerKm}
                keyboardType="numeric"
                placeholder="Enter odometer reading"
                placeholderTextColor={colors.text.secondary}
              />
              <Text style={styles.inputUnit}>km</Text>
            </View>
            <View style={styles.inputHelper}>
              <AntDesign
                name="info-circle"
                size={12}
                color={colors.text.secondary}
              />
              <Text style={styles.inputHelperText}>
                Final odometer reading at return
              </Text>
            </View>
          </View>
        </View>

        {/* Inspection Categories */}
        {categories.map((category) => (
          <View key={category.id} style={styles.categoryCard}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.categoryTitle}>
                {category.title}{" "}
                <Text style={styles.categoryCount}>
                  ({getCategoryCheckedCount(category)}/{category.items.length}{" "}
                  items)
                </Text>
              </Text>
              <AntDesign
                name={category.expanded ? "up" : "down"}
                size={16}
                color={colors.text.secondary}
              />
            </TouchableOpacity>

            {category.expanded && (
              <View
                ref={checklistRef}
                style={styles.itemsContainer}
                collapsable={false}
              >
                {category.items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemCard}
                    onPress={() => toggleItem(category.id, item.id)}
                    activeOpacity={0.8}
                  >
                    <View
                      style={[
                        styles.checkboxCircle,
                        item.checked && styles.checkboxChecked,
                      ]}
                    >
                      {item.checked && (
                        <AntDesign name="check" size={12} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={styles.itemText}>{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            checkedItems === totalItems && styles.completeButtonActive,
          ]}
          onPress={handleCompleteInspection}
          disabled={checkedItems !== totalItems}
        >
          <Text style={styles.completeButtonText}>Complete Inspection</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  progressSection: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#2A2A2A",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#C9B6FF",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
  },
  vehicleCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
  },
  vehicleCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  statusInputsCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#444444",
  },
  statusInputsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444444",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  inputIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: "500",
  },
  inputUnit: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
    minWidth: 32,
    textAlign: "right",
  },
  inputHelper: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 6,
  },
  inputHelperText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  categoryCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: "normal",
    color: colors.text.secondary,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.text.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  completeButton: {
    backgroundColor: "#2A2A2A",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  completeButtonActive: {
    backgroundColor: "#C9B6FF",
  },
  completeButtonText: {
    color: colors.text.dark,
    fontSize: 18,
    fontWeight: "bold",
  },
});
