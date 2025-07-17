import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
} from '@react-pdf/renderer';

// Professional color scheme
const colors = {
    primary: '#6C733D',
    accent: '#9DA65D',
    text: '#252426',
    background: '#F9FAFB',
    white: '#FFFFFF',
    lightGray: '#F3F4F6',
    mediumGray: '#E5E7EB',
    darkGray: '#6B7280',
};

// Enhanced styles for professional PDF layout
const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontSize: 11,
        fontFamily: 'Helvetica',
        backgroundColor: colors.white,
        color: colors.text,
    },
    
    // Header Section
    headerSection: {
        backgroundColor: colors.primary,
        padding: 20,
        marginBottom: 0,
    },
    
    companyInfo: {
        alignItems: 'center',
        marginBottom: 15,
    },
    
    logo: {
        width: 100,
        height: 50,
        objectFit: 'contain',
        marginBottom: 10,
    },
    
    mainTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        marginBottom: 8,
    },
    
    subtitle: {
        fontSize: 12,
        color: colors.white,
        textAlign: 'center',
        opacity: 0.9,
    },
    
    // Content sections
    contentContainer: {
        padding: 24,
    },
    
    section: {
        marginBottom: 20,
    },
    
    sectionHeader: {
        backgroundColor: colors.accent,
        color: colors.white,
        padding: 8,
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 12,
        borderRadius: 3,
    },
    
    // Travel Details Grid
    detailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        backgroundColor: colors.lightGray,
        padding: 16,
        borderRadius: 5,
        marginBottom: 15,
    },
    
    detailItem: {
        width: '48%',
        marginBottom: 8,
        flexDirection: 'row',
    },
    
    detailLabel: {
        fontWeight: 'bold',
        color: colors.primary,
        minWidth: 80,
    },
    
    detailValue: {
        color: colors.text,
        flex: 1,
    },
    
    // Greeting Section
    greetingContainer: {
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 5,
        borderLeft: `4px solid ${colors.accent}`,
        marginBottom: 20,
    },
    
    greetingText: {
        lineHeight: 1.5,
        fontSize: 11,
        color: colors.text,
    },
    
    // Table Styles
    tableContainer: {
        borderWidth: 1,
        borderColor: colors.mediumGray,
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 15,
    },
    
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        padding: 10,
    },
    
    tableHeaderText: {
        flex: 1,
        color: colors.white,
        fontWeight: 'bold',
        fontSize: 11,
    },
    
    tableRow: {
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },
    
    tableRowEven: {
        backgroundColor: colors.background,
    },
    
    tableCellText: {
        flex: 1,
        fontSize: 10,
        color: colors.text,
    },
    
    // Itinerary Styles
    itineraryItem: {
        marginBottom: 12,
        padding: 12,
        backgroundColor: colors.lightGray,
        borderRadius: 5,
        borderLeft: `3px solid ${colors.accent}`,
    },
    
    dayTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 6,
    },
    
    dayDescription: {
        fontSize: 10,
        lineHeight: 1.4,
        color: colors.text,
    },
    
    // Cost Summary
    costContainer: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 5,
        marginBottom: 20,
    },
    
    costHeader: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 12,
        textAlign: 'center',
    },
    
    costGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    
    costItem: {
        width: '48%',
        backgroundColor: colors.white,
        padding: 8,
        borderRadius: 3,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    
    costLabel: {
        fontSize: 10,
        color: colors.text,
        fontWeight: 'bold',
    },
    
    costValue: {
        fontSize: 10,
        color: colors.primary,
        fontWeight: 'bold',
    },
    
    totalCostItem: {
        width: '100%',
        backgroundColor: colors.accent,
        padding: 10,
        borderRadius: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    
    totalCostLabel: {
        fontSize: 12,
        color: colors.white,
        fontWeight: 'bold',
    },
    
    totalCostValue: {
        fontSize: 14,
        color: colors.white,
        fontWeight: 'bold',
    },
    
    // Inclusions/Exclusions
    inclusionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    
    inclusionColumn: {
        width: '48%',
    },
    
    inclusionHeader: {
        backgroundColor: colors.accent,
        color: colors.white,
        padding: 8,
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
        borderRadius: 3,
    },
    
    inclusionList: {
        backgroundColor: colors.lightGray,
        padding: 12,
        borderRadius: 3,
        minHeight: 180,
    },
    
    inclusionItem: {
        fontSize: 9,
        marginBottom: 4,
        lineHeight: 1.3,
        color: colors.text,
    },
    
    // Why Travomine
    whyContainer: {
        backgroundColor: colors.background,
        padding: 16,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: colors.accent,
        marginBottom: 20,
    },
    
    whyHeader: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
        textAlign: 'center',
    },
    
    whyText: {
        fontSize: 11,
        lineHeight: 1.4,
        color: colors.text,
        textAlign: 'center',
    },
    
    // Footer
    footer: {
        backgroundColor: colors.primary,
        padding: 16,
        marginTop: 20,
    },
    
    footerContent: {
        alignItems: 'center',
    },
    
    footerTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.white,
        marginBottom: 8,
    },
    
    footerContactGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },
    
    footerContactItem: {
        fontSize: 10,
        color: colors.white,
        marginBottom: 3,
    },
    
    footerTagline: {
        fontSize: 11,
        color: colors.white,
        fontStyle: 'italic',
        marginTop: 8,
        textAlign: 'center',
    },
    
    // Flight Image
    flightImage: {
        width: '100%',
        height: 80,
        objectFit: 'cover',
        borderRadius: 5,
        marginBottom: 15,
    },
});

export function QuotationPDF({ payload }: any) {
    const location =
  payload.accommodation && payload.accommodation.length > 0
    ? payload.accommodation[0].location
    : "";
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.companyInfo}>
                        {payload.logoUrl && (
                            <Image src={payload.logoUrl} style={styles.logo} />
                        )}
                        <Text style={styles.mainTitle}>
                            ✨ Explore the Mystical Land of {location} ✨
                        </Text>
                        <Text style={styles.subtitle}>
                            5 Nights / 6 Days • Premium Adventure Package
                        </Text>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* Travel Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>📋 Travel Details</Text>
                        <View style={styles.detailsGrid}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Travel Date:</Text>
                                <Text style={styles.detailValue}>{payload.travelDate}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Group Size:</Text>
                                <Text style={styles.detailValue}>{payload.groupSize} pax</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Meal Plan:</Text>
                                <Text style={styles.detailValue}>{payload.mealPlan}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Vehicle:</Text>
                                <Text style={styles.detailValue}>{payload.vehicleUsed}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Greeting */}
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingText}>
                            <Text style={{ fontWeight: 'bold', color: colors.primary }}>Greeting From Travomine.</Text> At Travomine Leisure Pvt. Ltd., we don't just plan trips — we craft experiences. Every detail is curated to ensure your Ladakh adventure is nothing short of magical. From soaring mountain passes to tranquil blue lakes, prepare to be mesmerized by the raw beauty and timeless culture of this Himalayan paradise. Let's begin your unforgettable journey!
                        </Text>
                    </View>

                    {/* Flight Image */}
                    {payload.flightImageUrl && (
                        <Image src={payload.flightImageUrl} style={styles.flightImage} />
                    )}

                    {/* Accommodation */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>🏨 Accommodation Details</Text>
                        <View style={styles.tableContainer}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>Location</Text>
                                <Text style={styles.tableHeaderText}>Hotel Name</Text>
                                <Text style={styles.tableHeaderText}>Nights</Text>
                            </View>
                            {payload.accommodation.map((acc: any, i: number) => (
                                <View style={[styles.tableRow, ...(i % 2 === 1 ? [styles.tableRowEven] : [])]} key={i}>
                                    <Text style={styles.tableCellText}>{acc.location}</Text>
                                    <Text style={styles.tableCellText}>{acc.hotelName}</Text>
                                    <Text style={styles.tableCellText}>{acc.numberOfNights} nights</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Itinerary */}
                    <View style={styles.section}>
                        <Text style={styles.sectionHeader}>🗺️ Your {location} Odyssey — Day by Day</Text>
                        {payload.itinerary.map((item: any, i: number) => (
                            <View style={styles.itineraryItem} key={i}>
                                <Text style={styles.dayTitle}>{item.dayTitle}</Text>
                                <Text style={styles.dayDescription}>{item.description}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Cost Summary */}
                    <View style={styles.section}>
                        <View style={styles.costContainer}>
                            <Text style={styles.costHeader}>💰 Investment Summary</Text>
                            <View style={styles.costGrid}>
                                <View style={styles.costItem}>
                                    <Text style={styles.costLabel}>Land Package (per person)</Text>
                                    <Text style={styles.costValue}>₹{payload.landCostPerHead}</Text>
                                </View>
                                <View style={styles.costItem}>
                                    <Text style={styles.costLabel}>Flight (per person)</Text>
                                    <Text style={styles.costValue}>₹{payload.flightCostPerPerson}</Text>
                                </View>
                                <View style={styles.costItem}>
                                    <Text style={styles.costLabel}>Total (per person)</Text>
                                    <Text style={styles.costValue}>₹{payload.totalCostPerPerson}</Text>
                                </View>
                                <View style={styles.totalCostItem}>
                                    <Text style={styles.totalCostLabel}>Total Group Investment</Text>
                                    <Text style={styles.totalCostValue}>₹{payload.totalGroupCost}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Inclusions & Exclusions */}
                    <View style={styles.section}>
                        <View style={styles.inclusionsContainer}>
                            <View style={styles.inclusionColumn}>
                                <Text style={styles.inclusionHeader}>✅ What's Included?</Text>
                                <View style={styles.inclusionList}>
                                    {[
                                        'Warm airport greetings & assistance',
                                        'Comfortable twin-sharing accommodations',
                                        '5 hearty breakfasts & 5 dinners (MAP basis)',
                                        'Travel in a Non-AC Innova Crysta throughout',
                                        'Protected Area & Inner Line permits handled',
                                        'All sightseeing & entry permits as per itinerary',
                                        'Fuel, driver allowances, tolls & parking',
                                        'Oxygen cylinder support in Leh',
                                        'Applicable taxes & GST',
                                    ].map((inc, i) => (
                                        <Text style={styles.inclusionItem} key={i}>• {inc}</Text>
                                    ))}
                                </View>
                            </View>
                            
                            <View style={styles.inclusionColumn}>
                                <Text style={styles.inclusionHeader}>❌ What's Not Included?</Text>
                                <View style={styles.inclusionList}>
                                    {[
                                        'Personal expenses & tips',
                                        'Adventure activities like rafting, paragliding, camel rides',
                                        'Additional sightseeing or extra vehicle use',
                                        'Monument/monastery entry & guide fees',
                                        'Camera fees & travel insurance',
                                        'Charges from unforeseen events (landslides, strikes, route closures)',
                                        'Airline/fuel tax hikes before departure',
                                        'Anything not clearly mentioned in the inclusions',
                                    ].map((exc, i) => (
                                        <Text style={styles.inclusionItem} key={i}>• {exc}</Text>
                                    ))}
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Why Travomine */}
                    <View style={styles.whyContainer}>
                        <Text style={styles.whyHeader}>🌟 Why Choose Travomine?</Text>
                        <Text style={styles.whyText}>
                            We don't just offer tours — we deliver experiences that touch your soul. With expert local knowledge, trusted partnerships, and heartfelt care, we turn your travel dreams into vivid realities.
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerContent}>
                        <Text style={styles.footerTitle}>Ready to embark on your Ladakh adventure?</Text>
                        <View style={styles.footerContactGrid}>
                            <View>
                                <Text style={styles.footerContactItem}>📞 +91-9956735725, 8957124089</Text>
                                <Text style={styles.footerContactItem}>✉️ info@travomine.com</Text>
                            </View>
                            <View>
                                <Text style={styles.footerContactItem}>🌐 www.travomine.com</Text>
                                <Text style={styles.footerContactItem}>🏢 Travomine Leisure Pvt. Ltd.</Text>
                            </View>
                        </View>
                        <Text style={styles.footerTagline}>Crafting Memories That Last Forever ✨</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
}