import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import Slider from '@react-native-community/slider';

export interface FilterState {
    priceRange: [number, number];      // [min, max]
    models: string[];                   // Selected model IDs
    rangeKm: [number, number];         // [min, max] battery range
    features: string[];                 // Selected features
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    currentFilters: FilterState;
}

export const FilterModal: React.FC<FilterModalProps> = ({
    visible,
    onClose,
    onApply,
    currentFilters,
}) => {
    const [filters, setFilters] = useState<FilterState>(currentFilters);

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    const handleReset = () => {
        const resetFilters: FilterState = {
            priceRange: [0, 500000],
            models: [],
            rangeKm: [0, 150],
            features: [],
        };
        setFilters(resetFilters);
    };

    // Update price range (for dual slider, we'll use single slider for max value)
    const updateMaxPrice = (value: number) => {
        setFilters(prev => ({
            ...prev,
            priceRange: [prev.priceRange[0], value],
        }));
    };

    const updateMaxRange = (value: number) => {
        setFilters(prev => ({
            ...prev,
            rangeKm: [prev.rangeKm[0], value],
        }));
    };

    const toggleFeature = (feature: string) => {
        setFilters(prev => ({
            ...prev,
            features: prev.features.includes(feature)
                ? prev.features.filter(f => f !== feature)
                : [...prev.features, feature],
        }));
    };

    // Count active filters
    const activeFilterCount = 
        (filters.priceRange[1] < 500000 ? 1 : 0) +
        (filters.rangeKm[1] < 150 ? 1 : 0) +
        filters.models.length +
        filters.features.length;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity 
                    style={styles.backdrop} 
                    activeOpacity={1} 
                    onPress={onClose}
                />
                
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleReset}>
                            <Text style={styles.resetText}>Đặt Lại</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Bộ Lọc</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Drag indicator */}
                    <View style={styles.dragIndicator} />

                    <ScrollView 
                        style={styles.filtersContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Price Range Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Giá Thuê (₫/ngày)</Text>
                            <View style={styles.priceLabels}>
                                <Text style={styles.priceText}>
                                    0₫
                                </Text>
                                <Text style={styles.priceTextHighlight}>
                                    {filters.priceRange[1].toLocaleString('vi-VN')}₫
                                </Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={500000}
                                step={10000}
                                minimumTrackTintColor="#d4c5f9"
                                maximumTrackTintColor="#333"
                                thumbTintColor="#d4c5f9"
                                value={filters.priceRange[1]}
                                onValueChange={updateMaxPrice}
                            />
                            <View style={styles.rangeLabels}>
                                <Text style={styles.rangeLabelText}>0₫</Text>
                                <Text style={styles.rangeLabelText}>500,000₫</Text>
                            </View>
                        </View>

                        {/* Battery Range Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Quãng Đường Pin (Km)</Text>
                            <View style={styles.priceLabels}>
                                <Text style={styles.priceText}>
                                    0 Km
                                </Text>
                                <Text style={styles.priceTextHighlight}>
                                    {filters.rangeKm[1]} Km
                                </Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={150}
                                step={5}
                                minimumTrackTintColor="#d4c5f9"
                                maximumTrackTintColor="#333"
                                thumbTintColor="#d4c5f9"
                                value={filters.rangeKm[1]}
                                onValueChange={updateMaxRange}
                            />
                            <View style={styles.rangeLabels}>
                                <Text style={styles.rangeLabelText}>0 Km</Text>
                                <Text style={styles.rangeLabelText}>150 Km</Text>
                            </View>
                        </View>

                        {/* Model Selection */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Dòng Xe</Text>
                            <View style={styles.chipContainer}>
                                <FilterChip
                                    label="VinFast"
                                    selected={filters.models.includes('vinfast')}
                                    onPress={() => {
                                        setFilters(prev => ({
                                            ...prev,
                                            models: prev.models.includes('vinfast')
                                                ? prev.models.filter(m => m !== 'vinfast')
                                                : [...prev.models, 'vinfast']
                                        }));
                                    }}
                                />
                                <FilterChip
                                    label="Honda"
                                    selected={filters.models.includes('honda')}
                                    onPress={() => {
                                        setFilters(prev => ({
                                            ...prev,
                                            models: prev.models.includes('honda')
                                                ? prev.models.filter(m => m !== 'honda')
                                                : [...prev.models, 'honda']
                                        }));
                                    }}
                                />
                                <FilterChip
                                    label="Yamaha"
                                    selected={filters.models.includes('yamaha')}
                                    onPress={() => {
                                        setFilters(prev => ({
                                            ...prev,
                                            models: prev.models.includes('yamaha')
                                                ? prev.models.filter(m => m !== 'yamaha')
                                                : [...prev.models, 'yamaha']
                                        }));
                                    }}
                                />
                                <FilterChip
                                    label="Pega"
                                    selected={filters.models.includes('pega')}
                                    onPress={() => {
                                        setFilters(prev => ({
                                            ...prev,
                                            models: prev.models.includes('pega')
                                                ? prev.models.filter(m => m !== 'pega')
                                                : [...prev.models, 'pega']
                                        }));
                                    }}
                                />
                            </View>
                        </View>

                        {/* Features */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Tính Năng</Text>
                            <View style={styles.chipContainer}>
                                <FilterChip
                                    label="🔌 Hỗ Trợ Sạc"
                                    selected={filters.features.includes('charging')}
                                    onPress={() => toggleFeature('charging')}
                                />
                                <FilterChip
                                    label="📍 GPS Tracking"
                                    selected={filters.features.includes('gps')}
                                    onPress={() => toggleFeature('gps')}
                                />
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer with Apply Button */}
                    <View style={styles.footer}>
                        <View style={styles.footerInfo}>
                            {activeFilterCount > 0 && (
                                <Text style={styles.activeFiltersText}>
                                    {activeFilterCount} bộ lọc đang áp dụng
                                </Text>
                            )}
                        </View>
                        <TouchableOpacity 
                            style={styles.applyButton}
                            onPress={handleApply}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.applyButtonText}>
                                Áp Dụng Bộ Lọc
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// FilterChip component
interface FilterChipProps {
    label: string;
    selected: boolean;
    onPress: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress }) => (
    <TouchableOpacity
        style={[styles.chip, selected && styles.chipSelected]}
        onPress={onPress}
        activeOpacity={0.7}
    >
        <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
            {label}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '92%', // Changed from maxHeight to height for consistent size
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    dragIndicator: {
        width: 40,
        height: 4,
        backgroundColor: '#444',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20, // Increased from 16
        borderBottomWidth: 1,
        borderBottomColor: '#2a2a2a',
    },
    title: {
        color: '#fff',
        fontSize: 20, // Increased from 18
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    resetText: {
        color: '#d4c5f9',
        fontSize: 15,
        fontWeight: '600',
    },
    closeButton: {
        padding: 4,
    },
    closeText: {
        color: '#999',
        fontSize: 28,
        fontWeight: '300',
        lineHeight: 28,
    },
    filtersContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24, // Increased from 16
        paddingBottom: 16,
    },
    section: {
        marginBottom: 36, // Increased from 32
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 17, // Increased from 16
        fontWeight: '600',
        marginBottom: 18, // Increased from 16
        letterSpacing: 0.2,
    },
    priceLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    priceText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    priceTextHighlight: {
        color: '#d4c5f9',
        fontSize: 16,
        fontWeight: '700',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    rangeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingHorizontal: 4,
    },
    rangeLabelText: {
        color: '#555',
        fontSize: 12,
        fontWeight: '500',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 18, // Increased from 16
        paddingVertical: 12, // Increased from 10
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#333',
        backgroundColor: 'transparent',
    },
    chipSelected: {
        backgroundColor: '#d4c5f9',
        borderColor: '#d4c5f9',
    },
    chipText: {
        color: '#999',
        fontSize: 15, // Increased from 14
        fontWeight: '600',
    },
    chipTextSelected: {
        color: '#000',
        fontWeight: '700',
    },
    footer: {
        padding: 20,
        paddingBottom: 28, // Increased for better spacing
        borderTopWidth: 1,
        borderTopColor: '#2a2a2a',
        backgroundColor: '#1a1a1a',
    },
    footerInfo: {
        marginBottom: 14, // Increased from 12
        alignItems: 'center',
    },
    activeFiltersText: {
        color: '#d4c5f9',
        fontSize: 14, // Increased from 13
        fontWeight: '500',
    },
    applyButton: {
        backgroundColor: '#d4c5f9',
        paddingVertical: 18, // Increased from 16
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: '#d4c5f9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    applyButtonText: {
        color: '#000',
        fontSize: 17, // Increased from 16
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});