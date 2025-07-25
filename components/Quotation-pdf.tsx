import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Font,
} from '@react-pdf/renderer';
import path from 'path';

Font.register({
    family: 'NotoSans',
    src: '/fonts/NotoSans-Regular.ttf',
    fontWeight: 'normal',
    fontStyle: 'normal',
});
Font.register({
    family: 'NotoSans',
    src: '/fonts/NotoSans-Bold.ttf',
    fontWeight: 'bold',
    fontStyle: 'normal',
});
Font.register({
    family: 'NotoSans',
    src: '/fonts/NotoSans-Italic.ttf',
    fontWeight: 'normal',
    fontStyle: 'italic',
});

// Professional color scheme matching the images
const colors = {
    primary: '#4A90E2',
    accent: '#5BA0F2',
    text: '#2C3E50',
    background: '#F8F9FA',
    white: '#FFFFFF',
    lightGray: '#E8F4FD',
    mediumGray: '#D1E7DD',
    darkGray: '#6C757D',
    success: '#28A745',
    danger: '#DC3545',
};

// Enhanced styles matching the travel brochure design
const styles = StyleSheet.create({
    page: {
        padding: 0,
        fontSize: 11,
        fontFamily: 'NotoSans',
        backgroundColor: colors.white,
        color: colors.text,
    },

    // Header Section
    headerSection: {
        backgroundColor: colors.white,
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        marginBottom: 0,
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
    },

    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },

    logo: {
        width: 190,
        height: 60,
        objectFit: 'contain',
    },

    mainTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'left',
        paddingLeft: 15,
        backgroundColor: 'transparent',
    },

    subtitle: {
        fontSize: 14,
        color: colors.text,
        textAlign: 'center',
        marginBottom: 20,
    },

    // Travel Details Section
    travelDetailsContainer: {
        backgroundColor: colors.lightGray,
        paddingTop: 15,
        paddingLeft: 35,
        paddingBottom: 15,
        marginBottom: 0,
        alignItems: 'center',
        borderRadius: 6,
        width: '100%',
        alignSelf: 'center',
    },

    travelDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 8,
    },

    travelDetailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },

    travelDetailItem: {
        flexDirection: 'row',
        width: '48%',
    },

    detailLabel: {
        fontSize: 12,
        color: colors.darkGray,
        fontWeight: 'bold',
    },

    detailValue: {
        fontSize: 12,
        color: colors.text,
        fontWeight: 'normal',
    },

    // Content sections
    contentContainer: {
        padding: 20,
    },

    section: {
        marginBottom: 20,
    },

    // Greeting Section
    greetingContainer: {
        backgroundColor: colors.background,
        padding: 15,
        marginBottom: 20,
    },

    greetingText: {
        lineHeight: 1.5,
        fontSize: 11,
        color: colors.text,
        textAlign: 'justify',
        fontStyle: 'italic',
    },

    greetingHighlight: {
        fontWeight: 'bold',
        color: colors.primary,
    },

    // Flight Details Section
    flightDetailsContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.mediumGray,
        borderRadius: 5,
        marginBottom: 20,
    },

    flightDetailsHeader: {
        color: colors.primary,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
    },

    flightRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },

    airlineLogo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },

    airlineName: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
    },

    flightTime: {
        fontSize: 10,
        color: colors.text,
        textAlign: 'center',
        flex: 1,
    },

    flightDuration: {
        fontSize: 9,
        color: colors.darkGray,
        textAlign: 'center',
        flex: 1,
    },

    flightPrice: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'right',
        flex: 1,
    },

    flightPriceTotal: {
        fontSize: 10,
        color: colors.white,
        backgroundColor: colors.danger,
        padding: 3,
        borderRadius: 3,
        textAlign: 'center',
    },

    // Itinerary Section
    itineraryHeader: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left',
        paddingTop: 10,
        paddingBottom: 5,
        paddingLeft: 12,
        backgroundColor: 'transparent',
    },

    itineraryItem: {
        marginBottom: 15,
        paddingLeft: 12,
        backgroundColor: 'transparent',
    },

    dayTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 8,
    },

    dayDescription: {
        fontSize: 10,
        lineHeight: 1.4,
        color: colors.text,
        textAlign: 'justify',
    },

    // Accommodation Section
    accommodationContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.mediumGray,
        marginBottom: 20,
    },

    accommodationHeader: {
        color: colors.primary,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'left',
        backgroundColor: 'transparent',
    },

    accommodationRow: {
        flexDirection: 'row',
        paddingLeft: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },

    accommodationLocation: {
        flex: 1,
        fontSize: 10,
        color: colors.text,
        fontWeight: 'bold',
    },

    accommodationHotel: {
        flex: 1,
        fontSize: 10,
        color: colors.text,
    },

    // Cost Summary
    costContainer: {
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.mediumGray,
        marginBottom: 20,
    },

    costHeader: {
        backgroundColor: 'transparent',
        color: colors.primary,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'left',
    },

    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGray,
    },

    costLabel: {
        fontSize: 10,
        color: colors.text,
    },

    costValue: {
        fontSize: 10,
        color: colors.text,
        fontWeight: 'bold',
    },

    totalCostRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: colors.lightGray,
    },

    totalCostLabel: {
        fontSize: 12,
        color: colors.text,
        fontWeight: 'bold',
    },

    totalCostValue: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: 'bold',
    },

    // Inclusions/Exclusions
    inclusionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },

    inclusionColumn: {
        width: '48%',
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.mediumGray,
    },

    inclusionHeader: {
        backgroundColor: 'transparent',
        color: colors.primary,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'left',
    },

    exclusionHeader: {
        color: colors.danger,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        fontSize: 11,
        fontWeight: 'bold',
        textAlign: 'left',
    },

    inclusionList: {
        padding: 10,
    },

    inclusionItem: {
        fontSize: 9,
        marginBottom: 4,
        lineHeight: 1.3,
        color: colors.text,
        flexDirection: 'row',
    },

    checkIcon: {
        color: colors.success,
        marginRight: 5,
        fontSize: 10,
    },

    crossIcon: {
        color: colors.danger,
        marginRight: 5,
        fontSize: 10,
    },

    // Why Travomine
    whyContainer: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 5,
        marginBottom: 20,
    },

    whyHeader: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 8,
        paddingLeft: 20,
        backgroundColor: 'transparent',
    },

    whyText: {
        fontSize: 11,
        lineHeight: 1.4,
        color: colors.white,
        textAlign: 'center',
    },

    // Footer
    footer: {
        backgroundColor: colors.primary,
        padding: 15,
        marginTop: 20,
    },

    footerContent: {
        alignItems: 'center',
    },

    footerTitle: {
        color: colors.primary,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 10,
        paddingLeft: 20,
        backgroundColor: 'transparent',
    },

    footerContactGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 10,
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

    companyInfo: {
        textAlign: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    companyInfoText: {
        fontSize: 10,
        color: colors.white,
        marginBottom: 2,
    },
});


export function QuotationPDF({ payload }: any) {
    const location = payload.accommodation && payload.accommodation.length > 0
        ? payload.accommodation[0].location
        : "Ladakh";

    function formatDate(dateStr: string) {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <View style={styles.logoContainer}>
                        {payload.logoUrl && (
                            <Image src={payload.logoUrl} style={styles.logo} />
                        )}
                    </View>

                    <Text style={styles.mainTitle}>
                        Explore the Mystical Land of {payload.place} | {payload.totalNights} Nights / {payload.totalNights + 1} Days
                    </Text>
                </View>

                {/* Travel Details */}
                <View style={styles.travelDetailsContainer}>
                    <View style={styles.travelDetailsRow}>
                        <View style={styles.travelDetailItem}>
                            <Text style={styles.detailLabel}>Date of Travel:&nbsp;</Text>
                            <Text style={styles.detailValue}>{formatDate(payload.travelDate)}</Text>
                        </View>
                        <View style={styles.travelDetailItem}>
                            <Text style={styles.detailLabel}>Group:&nbsp;</Text>
                            <Text style={styles.detailValue}>{payload.groupSize} pax</Text>
                        </View>
                    </View>
                    <View style={styles.travelDetailsRow}>
                        <View style={styles.travelDetailItem}>
                            <Text style={styles.detailLabel}>Meal Plan:&nbsp;</Text>
                            <Text style={styles.detailValue}>{payload.mealPlan}</Text>
                        </View>
                        <View style={styles.travelDetailItem}>
                            <Text style={styles.detailLabel}>Vehicle Used:&nbsp;</Text>
                            <Text style={styles.detailValue}>{payload.localVehicleUsed}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.contentContainer}>
                    {/* Greeting */}
                    <View style={styles.greetingContainer}>
                        <Text style={styles.greetingText}>Greeting From
                            <Text style={styles.greetingHighlight}> Travomine</Text>.
                            At Travomine Leisure Pvt. Ltd., we don't just plan trips — we craft experiences. Every detail is curated to ensure your {location} adventure is nothing short of magical. From soaring mountain passes to tranquil blue lakes, prepare to be mesmerized by the raw beauty and timeless culture of this Himalayan paradise. Let's begin your unforgettable journey!
                        </Text>
                    </View>

                    {/* Flight Details */}
                    {payload.flightImageUrl && (
                        <View style={{ alignItems: 'flex-start', marginBottom: 40 }}>
                            <Text style={styles.flightDetailsHeader}>Flight Details</Text>
                            <Image src={payload.flightImageUrl} style={{ width: "100%", height: 250, objectFit: 'contain', borderRadius: 1 }} />
                            <Text style={{ fontWeight: 'bold', fontSize: 12, marginTop: 12, paddingLeft: 10, }}>
                                Flight Per Person : &#8377; {payload.flightCost}
                            </Text>
                        </View>
                    )}

                    {/* Itinerary */}
                    {payload.itinerary && Array.isArray(payload.itinerary) && payload.itinerary.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.itineraryHeader}>
                                Your {payload.place} Odyssey — Day by Day
                            </Text>
                            {payload.itinerary.map((item: any, i: number) => (
                                <View style={styles.itineraryItem} key={i}>
                                    <Text style={styles.dayTitle}>{item.dayTitle}</Text>
                                    <Text style={styles.dayDescription}>{item.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Accommodation */}
                    <View style={styles.accommodationContainer}>
                        <Text style={styles.accommodationHeader}>Accommodation Details</Text>
                        {payload.accommodation.map((acc: any, i: number) => (
                            <View style={styles.accommodationRow} key={i}>
                                <Text style={styles.accommodationLocation}>{acc.location} ({acc.nights} Nights):</Text>
                                <Text style={styles.accommodationHotel}>{acc.hotelName}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Cost Summary */}
                    <View style={styles.costContainer}>
                        <Text style={styles.costHeader}>Costing:</Text>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>• Land Package:</Text>
                            <Text style={styles.costValue}>₹{payload.landCostPerHead} per person</Text>
                        </View>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>• Flight (Delhi-Leh RT approx.):</Text>
                            <Text style={styles.costValue}>₹{payload.flightCost} per person</Text>
                        </View>
                        <View style={styles.costRow}>
                            <Text style={styles.costLabel}>• Total per person:</Text>
                            <Text style={styles.costValue}>₹{payload.totalPerHead || "0"}</Text>
                        </View>
                        <View style={styles.totalCostRow}>
                            <Text style={styles.totalCostLabel}>• Total for {payload.groupSize}:</Text>
                            <Text style={styles.totalCostValue}>₹{payload.totalGroupCost}</Text>
                        </View>
                    </View>

                    {/* Inclusions & Exclusions */}
                    <View style={styles.inclusionsContainer}>
                        <View style={styles.inclusionColumn}>
                            <Text style={styles.inclusionHeader}>What's Included?</Text>
                            <View style={styles.inclusionList}>
                                {(payload.inclusions && payload.inclusions.length > 0
                                    ? payload.inclusions
                                    : ['No inclusions selected']).map((inc: string, i: number) => (
                                        <View style={styles.inclusionItem} key={i}>
                                            <Text style={styles.checkIcon}>✓</Text>
                                            <Text>{inc}</Text>
                                        </View>
                                    ))}
                            </View>
                        </View>

                        <View style={styles.inclusionColumn}>
                            <Text style={styles.exclusionHeader}>What's Not Included?</Text>
                            <View style={styles.inclusionList}>
                                {(payload.exclusions && payload.exclusions.length > 0
                                    ? payload.exclusions
                                    : ['No exclusions selected']).map((exc: string, i: number) => (
                                        <View style={styles.inclusionItem} key={i}>
                                            <Text style={styles.crossIcon}>✗</Text>
                                            <Text>{exc}</Text>
                                        </View>
                                    ))}
                            </View>
                        </View>
                    </View>

                    {/* Why Travomine */}
                    <View style={styles.whyContainer}>
                        <Text style={styles.whyHeader}>Why Travomine?</Text>
                        <Text style={styles.whyText}>
                            We don't just offer tours — we deliver experiences that touch your soul. With expert local knowledge, trusted partnerships, and heartfelt care, we turn your travel dreams into vivid realities.
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <View style={styles.footerContent}>
                        <Text style={styles.footerTitle}>Ready to embark on your {location} adventure?</Text>
                        <View style={styles.footerContactGrid}>
                            <View>
                                <Text style={styles.footerContactItem}>Call us: +91-9956735725,8957124089</Text>
                                <Text style={styles.footerContactItem}>Email: info@travomine.com</Text>
                            </View>
                            <View>
                                <Text style={styles.footerContactItem}>Visit: www.travomine.com</Text>
                            </View>
                        </View>
                        <View style={styles.companyInfo}>
                            <Text style={styles.companyInfoText}>Travomine Leisure Pvt. Ltd.</Text>
                            <Text style={styles.footerTagline}>Crafting Memories That Last Forever.</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}