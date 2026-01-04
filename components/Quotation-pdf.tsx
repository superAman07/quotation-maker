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

// Register Fonts
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

const colors = {
    primaryBlue: '#0056b3',
    accentPurple: '#8e24aa',
    accentRed: '#d32f2f',
    highlightYellow: '#fff9c4',
    textDark: '#1F2937',
    textGray: '#6B7280',
    border: '#E5E7EB',
    white: '#FFFFFF',
    lightBg: '#F9FAFB',
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 90, // Space for fixed header
        paddingBottom: 60, // Space for fixed footer
        paddingHorizontal: 0, // ✅ NO padding here - we'll add it per section
        fontFamily: 'NotoSans',
        fontSize: 10,
        color: colors.textDark,
        backgroundColor: colors.white,
    },

    // Fixed Header (Full Width)
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 100,
        paddingHorizontal: 30,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.white,
    },
    logo: {
        width: 140,
        height: 50,
        objectFit: 'contain',
    },
    googleBadge: {
        width: 240,
        height: 70,
        objectFit: 'contain',
    },

    // Fixed Footer (Full Width)
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 50,
        backgroundColor: colors.lightBg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingHorizontal: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 8,
        color: colors.textGray,
        textAlign: 'center',
        marginBottom: 2,
    },
    footerBrand: {
        fontSize: 9,
        fontWeight: 'bold',
        color: colors.primaryBlue,
    },

    // ✅ Content Container (Creates the inset effect)
    contentContainer: {
        paddingHorizontal: 70, // Space from left and right edges
    },

    // Sections
    section: {
        marginBottom: 20,
    },
    
    // Main Title (Centered)
    mainTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primaryBlue,
        marginBottom: 4,
        textTransform: 'uppercase',
        textAlign: 'left',
    },
    subTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.textDark,
        marginBottom: 15,
        textAlign: 'left',
    },

    // Quick Summary
    summaryHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.accentPurple,
        marginBottom: 8,
    },
    summaryBox: {
        padding: 10,
        backgroundColor: colors.lightBg,
        borderRadius: 4,
        marginBottom: 15,
    },
    summaryRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    summaryLabel: {
        width: 70,
        fontWeight: 'bold',
        fontSize: 9,
        color: colors.textDark,
    },
    summaryValue: {
        flex: 1,
        fontSize: 9,
        color: colors.textDark,
    },

    // Flight Details
    flightHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.accentRed,
        marginBottom: 8,
        marginTop: 10,
    },
    flightCard: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 4,
        padding: 10,
        marginBottom: 10,
        backgroundColor: colors.white,
    },
    flightRoute: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.textDark,
    },
    flightInfo: {
        fontSize: 9,
        color: colors.textGray,
    },
    flightImage: {
        width: '100%',
        height: 150,
        objectFit: 'contain',
        marginVertical: 8,
        borderRadius: 4,
    },
    flightCostHighlight: {
        backgroundColor: colors.highlightYellow,
        padding: 6,
        marginTop: 8,
        alignSelf: 'flex-start',
        fontSize: 10,
        fontWeight: 'bold',
        borderRadius: 3,
    },

    // Itinerary
    dayContainer: {
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    dayTitle: {
        fontWeight: 'bold',
        color: colors.primaryBlue,
        fontSize: 11,
        marginBottom: 4,
    },
    dayDesc: {
        fontSize: 10,
        lineHeight: 1.4,
        color: colors.textDark,
        textAlign: 'justify',
    },

    // Pricing
    pricingBox: {
        marginTop: 20,
        padding: 15,
        backgroundColor: colors.highlightYellow,
        borderWidth: 1,
        borderColor: '#fbc02d',
        borderRadius: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    priceLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: colors.textDark,
    },
    priceValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.primaryBlue,
    },
});

export function QuotationPDF({ payload }: any) {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency', currency: 'INR', maximumFractionDigits: 0
        }).format(amount);
    };

    const flightImageUrl = payload.flightImageUrl?.startsWith('http')
        ? payload.flightImageUrl
        : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${payload.flightImageUrl}`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                
                {/* Fixed Header (Full Width) */}
                <View style={styles.header} fixed>
                    <Image src="/logo.png" style={styles.logo} />
                    <Image src="/google-symbol.png" style={styles.googleBadge} />
                </View>

                {/* Fixed Footer (Full Width) */}
                <View style={styles.footer} fixed>
                    <Text style={styles.footerBrand}>Travomine Leisure Pvt. Ltd.</Text>
                    <Text style={styles.footerText}>
                        Address: Your Company Address Here | Phone: +91-9956735725 | Email: info@travomine.com
                    </Text>
                    <Text style={styles.footerText}>
                        www.travomine.com | Terms & Conditions Apply
                    </Text>
                </View>

                {/* ✅ CONTENT WITH INSET PADDING */}
                <View style={styles.contentContainer}>

                    {/* 1. Package Overview (CENTERED) */}
                    <View style={styles.section}>
                        <Text style={styles.mainTitle}>
                            {payload.place} {payload.totalNights}N/{payload.totalNights + 1}D PACKAGE
                        </Text>
                        <Text style={styles.subTitle}>
                            {payload.totalNights} Nights | {payload.groupSize} Pax | Query ID: {payload.quotationNo || 'N/A'}
                        </Text>
                    </View>

                    {/* 2. Quick Summary */}
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.summaryHeader}>✦ QUICK SUMMARY</Text>
                        <View style={styles.summaryBox}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Hotels:</Text>
                                <Text style={styles.summaryValue}>
                                    {payload.accommodation?.map((acc: any) => acc.hotelName).join(', ') || 'Not Selected'}
                                </Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Transfers:</Text>
                                <Text style={styles.summaryValue}>
                                    {payload.transfers?.map((t: any) => t.type).join(' → ') || 'Not Selected'}
                                </Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Meals:</Text>
                                <Text style={styles.summaryValue}>{payload.mealPlan}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Travel Date:</Text>
                                <Text style={styles.summaryValue}>{formatDate(payload.travelDate)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* 3. Flight Details */}
                    {payload.flightCost > 0 && (
                        <View style={styles.section} wrap={false}>
                            <Text style={styles.flightHeader}>✈ FLIGHT DETAILS</Text>
                            <View style={styles.flightCard}>
                                <Text style={styles.flightRoute}>Flight Included in Package</Text>
                                {payload.flightImageUrl ? (
                                    <Image 
                                        src={flightImageUrl}
                                        style={styles.flightImage}
                                    />
                                ) : (
                                    <Text style={styles.flightInfo}>Flight details as per discussion.</Text>
                                )}
                                <View style={styles.flightCostHighlight}>
                                    <Text>Flight Cost: {formatCurrency(payload.flightCost)} Per Person</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* 4. Day-wise Itinerary */}
                    {payload.itinerary && payload.itinerary.length > 0 && (
                        <View style={styles.section}>
                            <Text style={[styles.summaryHeader, { color: colors.primaryBlue }]}>🗓 DAY-WISE ITINERARY</Text>
                            {payload.itinerary.map((item: any, i: number) => (
                                <View key={i} style={styles.dayContainer} wrap={false}>
                                    <Text style={styles.dayTitle}>Day {i + 1}: {item.dayTitle}</Text>
                                    <Text style={styles.dayDesc}>{item.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* 5. Pricing Summary */}
                    <View style={styles.section} wrap={false}>
                        <Text style={[styles.summaryHeader, { color: colors.textDark }]}>💰 PRICING SUMMARY</Text>
                        <View style={styles.pricingBox}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Total Cost ({payload.groupSize} Pax):</Text>
                                <Text style={styles.priceValue}>{formatCurrency(payload.totalGroupCost)}</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={{ fontSize: 10 }}>Per Person Cost:</Text>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>{formatCurrency(payload.totalPerHead)}</Text>
                            </View>
                            <Text style={{ fontSize: 8, marginTop: 5, color: colors.textGray }}>
                                * Rates are subject to availability at the time of booking.
                            </Text>
                        </View>
                    </View>

                    {/* 6. Inclusions & Exclusions */}
                    <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }} wrap={false}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 5, color: 'green' }}>✓ Inclusions</Text>
                            {payload.inclusions?.map((inc: any, i: number) => (
                                <Text key={i} style={{ fontSize: 9, marginBottom: 2 }}>• {typeof inc === 'string' ? inc : inc.item}</Text>
                            ))}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 5, color: 'red' }}>✗ Exclusions</Text>
                            {payload.exclusions?.map((exc: any, i: number) => (
                                <Text key={i} style={{ fontSize: 9, marginBottom: 2 }}>• {typeof exc === 'string' ? exc : exc.item}</Text>
                            ))}
                        </View>
                    </View>

                </View>
                {/* ✅ END OF CONTENT CONTAINER */}

            </Page>
        </Document>
    );
}

// import React from 'react';
// import {
//     Document,
//     Page,
//     Text,
//     View,
//     Image,
//     StyleSheet,
//     Font,
// } from '@react-pdf/renderer';
// import path from 'path';

// Font.register({
//     family: 'NotoSans',
//     src: '/fonts/NotoSans-Regular.ttf',
//     fontWeight: 'normal',
//     fontStyle: 'normal',
// });
// Font.register({
//     family: 'NotoSans',
//     src: '/fonts/NotoSans-Bold.ttf',
//     fontWeight: 'bold',
//     fontStyle: 'normal',
// });
// Font.register({
//     family: 'NotoSans',
//     src: '/fonts/NotoSans-Italic.ttf',
//     fontWeight: 'normal',
//     fontStyle: 'italic',
// });

// // Clean white color scheme with modern accents
// const colors = {
//     primary: '#1F2937',      // Dark gray for headings
//     secondary: '#6B7280',    // Medium gray for subtext
//     accent: '#10B981',       // Green for success/positive
//     danger: '#EF4444',       // Red for exclusions
//     background: '#FFFFFF',    // Pure white background
//     lightGray: '#F9FAFB',    // Very light gray for sections
//     border: '#E5E7EB',       // Light border color
//     text: '#374151',         // Dark text
//     textLight: '#6B7280',    // Light text
//     success: '#10B981',      // Green for checkmarks
//     warning: '#F59E0B',      // Orange for warnings
// };

// // Modern, clean styles with white background
// const styles = StyleSheet.create({
//     page: {
//         padding: 0,
//         fontSize: 10,
//         fontFamily: 'NotoSans',
//         backgroundColor: colors.background,
//         color: colors.text,
//     },

//     // Header Section
//     headerSection: {
//         backgroundColor: colors.background,
//         paddingTop: 30,
//         paddingLeft: 30,
//         paddingRight: 30,
//         paddingBottom: 20,
//         borderBottomWidth: 2,
//         borderBottomColor: colors.border,
//     },

//     logoContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 20,
//     },

//     logo: {
//         width: 180,
//         height: 50,
//         objectFit: 'contain',
//     },

//     mainTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: colors.primary,
//         textAlign: 'center',
//         marginBottom: 5,
//     },

//     subtitle: {
//         fontSize: 12,
//         color: colors.textLight,
//         textAlign: 'center',
//         marginBottom: 15,
//     },

//     // Travel Details Section
//     travelDetailsContainer: {
//         backgroundColor: colors.lightGray,
//         paddingTop: 20,
//         paddingLeft: 30,
//         paddingRight: 30,
//         paddingBottom: 20,
//         marginLeft: 30,
//         marginRight: 30,
//         marginTop: 20,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: colors.border,
//     },

//     travelDetailsRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//         marginBottom: 12,
//     },

//     travelDetailItem: {
//         flexDirection: 'row',
//         width: '48%',
//         alignItems: 'center',
//     },

//     detailLabel: {
//         fontSize: 11,
//         color: colors.textLight,
//         fontWeight: 'bold',
//         marginRight: 5,
//     },

//     detailValue: {
//         fontSize: 11,
//         color: colors.text,
//         fontWeight: 'normal',
//     },

//     // Content sections
//     contentContainer: {
//         padding: 30,
//     },

//     section: {
//         marginBottom: 25,
//     },

//     // Greeting Section
//     greetingContainer: {
//         backgroundColor: colors.lightGray,
//         padding: 20,
//         marginBottom: 25,
//         borderRadius: 8,
//         borderWidth: 1,
//         borderColor: colors.border,
//     },

//     greetingText: {
//         lineHeight: 1.6,
//         fontSize: 11,
//         color: colors.text,
//         textAlign: 'justify',
//     },

//     greetingHighlight: {
//         fontWeight: 'bold',
//         color: colors.accent,
//     },

//     // Section Headers
//     sectionHeader: {
//         fontSize: 14,
//         fontWeight: 'bold',
//         color: colors.primary,
//         marginBottom: 15,
//         paddingBottom: 8,
//         borderBottomWidth: 2,
//         borderBottomColor: colors.accent,
//     },

//     // Flight Details Section
//     flightDetailsContainer: {
//         backgroundColor: colors.background,
//         borderWidth: 1,
//         borderColor: colors.border,
//         borderRadius: 8,
//         marginBottom: 25,
//         overflow: 'hidden',
//     },

//     flightDetailsHeader: {
//         color: colors.primary,
//         paddingTop: 15,
//         paddingBottom: 15,
//         paddingLeft: 20,
//         fontSize: 13,
//         fontWeight: 'bold',
//         backgroundColor: colors.lightGray,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.border,
//     },

//     flightImageContainer: {
//         padding: 20,
//         alignItems: 'center',
//     },

//     flightImage: {
//         width: "100%",
//         height: 200,
//         objectFit: 'contain',
//         borderRadius: 4,
//     },

//     flightCostText: {
//         fontWeight: 'bold',
//         fontSize: 12,
//         marginTop: 15,
//         color: colors.accent,
//         textAlign: 'center',
//     },

//     // Itinerary Section
//     itineraryContainer: {
//         backgroundColor: colors.background,
//         borderWidth: 1,
//         borderColor: colors.border,
//         borderRadius: 8,
//         marginBottom: 25,
//         overflow: 'hidden',
//     },

//     itineraryHeader: {
//         color: colors.primary,
//         paddingTop: 15,
//         paddingBottom: 15,
//         paddingLeft: 20,
//         fontSize: 13,
//         fontWeight: 'bold',
//         backgroundColor: colors.lightGray,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.border,
//     },

//     itineraryItem: {
//         marginBottom: 15,
//         paddingLeft: 20,
//         paddingRight: 20,
//         paddingTop: 15,
//         backgroundColor: 'transparent',
//     },

//     dayTitle: {
//         fontSize: 12,
//         fontWeight: 'bold',
//         color: colors.accent,
//         marginBottom: 8,
//     },

//     dayDescription: {
//         fontSize: 10,
//         lineHeight: 1.5,
//         color: colors.text,
//         textAlign: 'justify',
//     },

//     // Accommodation Section
//     accommodationContainer: {
//         backgroundColor: colors.background,
//         borderWidth: 1,
//         borderColor: colors.border,
//         borderRadius: 8,
//         marginBottom: 25,
//         overflow: 'hidden',
//     },

//     accommodationHeader: {
//         color: colors.primary,
//         paddingTop: 15,
//         paddingBottom: 15,
//         paddingLeft: 20,
//         fontSize: 13,
//         fontWeight: 'bold',
//         backgroundColor: colors.lightGray,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.border,
//     },

//     accommodationRow: {
//         flexDirection: 'row',
//         paddingLeft: 20,
//         paddingRight: 20,
//         paddingTop: 12,
//         paddingBottom: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.border,
//     },

//     accommodationLocation: {
//         flex: 1,
//         fontSize: 10,
//         color: colors.text,
//         fontWeight: 'bold',
//     },

//     accommodationHotel: {
//         flex: 1,
//         fontSize: 10,
//         color: colors.text,
//     },

//     // Cost Summary
//     costContainer: {
//         backgroundColor: colors.background,
//         borderWidth: 1,
//         borderColor: colors.border,
//         borderRadius: 8,
//         marginBottom: 25,
//         overflow: 'hidden',
//     },

//     costHeader: {
//         backgroundColor: colors.lightGray,
//         color: colors.primary,
//         paddingTop: 15,
//         paddingBottom: 15,
//         paddingLeft: 20,
//         fontSize: 13,
//         fontWeight: 'bold',
//         borderBottomWidth: 1,
//         borderBottomColor: colors.border,
//     },

//     costRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         padding: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.border,
//     },

//     costLabel: {
//         fontSize: 10,
//         color: colors.text,
//     },

//     costValue: {
//         fontSize: 10,
//         color: colors.text,
//         fontWeight: 'bold',
//     },

//     totalCostRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         padding: 15,
//         backgroundColor: colors.accent,
//     },

//     totalCostLabel: {
//         fontSize: 12,
//         color: colors.background,
//         fontWeight: 'bold',
//     },

//     totalCostValue: {
//         fontSize: 12,
//         color: colors.background,
//         fontWeight: 'bold',
//     },

//     // Inclusions/Exclusions
//     inclusionsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 25,
//         gap: 15,
//     },

//     inclusionColumn: {
//         width: '48%',
//         backgroundColor: colors.background,
//         borderWidth: 1,
//         borderColor: colors.border,
//         borderRadius: 8,
//         overflow: 'hidden',
//     },

//     inclusionHeader: {
//         backgroundColor: colors.lightGray,
//         color: colors.primary,
//         paddingTop: 15,
//         paddingBottom: 15,
//         paddingLeft: 20,
//         fontSize: 12,
//         fontWeight: 'bold',
//         borderBottomWidth: 1,
//         borderBottomColor: colors.border,
//     },

//     exclusionHeader: {
//         backgroundColor: colors.lightGray,
//         color: colors.danger,
//         paddingTop: 15,
//         paddingBottom: 15,
//         paddingLeft: 20,
//         fontSize: 12,
//         fontWeight: 'bold',
//         borderBottomWidth: 1,
//         borderBottomColor: colors.border,
//     },

//     inclusionList: {
//         padding: 15,
//     },

//     inclusionItem: {
//         fontSize: 9,
//         marginBottom: 6,
//         lineHeight: 1.4,
//         color: colors.text,
//         flexDirection: 'row',
//         alignItems: 'flex-start',
//     },

//     checkIcon: {
//         color: colors.success,
//         marginRight: 8,
//         fontSize: 10,
//         fontWeight: 'bold',
//     },

//     crossIcon: {
//         color: colors.danger,
//         marginRight: 8,
//         fontSize: 10,
//         fontWeight: 'bold',
//     },

//     // Why Travomine
//     whyContainer: {
//         backgroundColor: colors.primary,
//         padding: 20,
//         borderRadius: 8,
//         marginBottom: 25,
//     },

//     whyHeader: {
//         color: colors.background,
//         fontSize: 13,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 10,
//     },

//     whyText: {
//         fontSize: 11,
//         lineHeight: 1.5,
//         color: colors.background,
//         textAlign: 'center',
//     },

//     // Footer
//     footer: {
//         backgroundColor: colors.primary,
//         padding: 20,
//         marginTop: 25,
//     },

//     footerContent: {
//         alignItems: 'center',
//     },

//     footerTitle: {
//         color: colors.background,
//         fontSize: 12,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 15,
//     },

//     footerContactGrid: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         width: '100%',
//         marginBottom: 15,
//     },

//     footerContactItem: {
//         fontSize: 10,
//         color: colors.background,
//         marginBottom: 5,
//     },

//     footerTagline: {
//         fontSize: 11,
//         color: colors.background,
//         fontStyle: 'italic',
//         marginTop: 10,
//         textAlign: 'center',
//     },

//     companyInfo: {
//         textAlign: 'center',
//         alignItems: 'center',
//         marginTop: 15,
//         paddingTop: 15,
//         borderTopWidth: 1,
//         borderTopColor: colors.border,
//     },

//     companyInfoText: {
//         fontSize: 10,
//         color: colors.background,
//         marginBottom: 3,
//     },
//     activitiesContainer: {
//         backgroundColor: colors.background,
//         borderWidth: 1,
//         borderColor: colors.border,
//         borderRadius: 8,
//         marginBottom: 25,
//         overflow: 'hidden',
//     },
//     activitiesHeader: {
//         color: colors.primary,
//         paddingTop: 15,
//         paddingBottom: 15,
//         paddingLeft: 20,
//         fontSize: 13,
//         fontWeight: 'bold',
//         backgroundColor: colors.lightGray,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.border,
//     },
//     activityRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingLeft: 20,
//         paddingRight: 20,
//         paddingTop: 12,
//         paddingBottom: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: colors.border,
//     },
//     activityName: {
//         flex: 2,
//         fontSize: 10,
//         color: colors.text,
//     },
//     activityPricing: {
//         flex: 1,
//         alignItems: 'flex-end',
//     },
//     activityPrice: {
//         fontSize: 9,
//         color: colors.textLight,
//     },
// });

// export function QuotationPDF({ payload }: any) {
//     const location = payload.accommodation && payload.accommodation.length > 0
//         ? payload.accommodation[0].location
//         : "Ladakh";

//     const vehicleName = payload.transfers && payload.transfers.length > 0 && payload.transfers[0].vehicleName
//         ? payload.transfers[0].vehicleName
//         : "Not Specified";

//     function formatDate(dateStr: string) {
//         if (!dateStr) return "";
//         const date = new Date(dateStr);
//         return date.toLocaleDateString("en-IN", {
//             day: "numeric",
//             month: "short",
//             year: "numeric"
//         });
//     }

//     return (
//         <Document>
//             <Page size="A4" style={styles.page}>
//                 {/* Header Section */}
//                 <View style={styles.headerSection}>
//                     <View style={styles.logoContainer}>
//                         {payload.logoUrl && (
//                             <Image src={payload.logoUrl} style={styles.logo} />
//                         )}
//                     </View>

//                     <Text style={styles.mainTitle}>
//                         Explore the Mystical Land of {payload.place}
//                     </Text>
//                     <Text style={styles.subtitle}>
//                         {payload.totalNights} Nights / {payload.totalNights + 1} Days Package
//                     </Text>
//                 </View>

//                 {/* Travel Details */}
//                 <View style={styles.travelDetailsContainer}>
//                     <View style={styles.travelDetailsRow}>
//                         <View style={styles.travelDetailItem}>
//                             <Text style={styles.detailLabel}>Travel Date:</Text>
//                             <Text style={styles.detailValue}>{formatDate(payload.travelDate)}</Text>
//                         </View>
//                         <View style={styles.travelDetailItem}>
//                             <Text style={styles.detailLabel}>Group Size:</Text>
//                             <Text style={styles.detailValue}>{payload.groupSize} pax</Text>
//                         </View>
//                     </View>
//                     <View style={styles.travelDetailsRow}>
//                         <View style={styles.travelDetailItem}>
//                             <Text style={styles.detailLabel}>Meal Plan:</Text>
//                             <Text style={styles.detailValue}>{payload.mealPlan}</Text>
//                         </View>
//                         <View style={styles.travelDetailItem}>
//                             <Text style={styles.detailLabel}>Vehicle:</Text>
//                             <Text style={styles.detailValue}>{vehicleName}</Text>
//                         </View>
//                     </View>
//                 </View>

//                 <View style={styles.contentContainer}>
//                     {/* Greeting */}
//                     <View style={styles.greetingContainer}>
//                         <Text style={styles.greetingText}>
//                             Greeting From <Text style={styles.greetingHighlight}>Travomine</Text>.
//                             At Travomine Leisure Pvt. Ltd., we don't just plan trips — we craft experiences.
//                             Every detail is curated to ensure your {location} adventure is nothing short of magical.
//                             From soaring mountain passes to tranquil blue lakes, prepare to be mesmerized by the raw
//                             beauty and timeless culture of this Himalayan paradise. Let's begin your unforgettable journey!
//                         </Text>
//                     </View>

//                     {/* Flight Details */}
//                     {payload.flightImageUrl && (
//                         <View style={styles.flightDetailsContainer}>
//                             <Text style={styles.flightDetailsHeader}>Flight Details</Text>
//                             <View style={styles.flightImageContainer}>
//                                 <Image src={payload.flightImageUrl} style={styles.flightImage} />
//                                 <Text style={styles.flightCostText}>
//                                     Flight Cost Per Person: ₹{payload.flightCost}
//                                 </Text>
//                             </View>
//                         </View>
//                     )}

//                     {/* Itinerary */}
//                     {payload.itinerary && Array.isArray(payload.itinerary) && payload.itinerary.length > 0 && (
//                         <View style={styles.itineraryContainer}>
//                             <Text style={styles.itineraryHeader}>Your {payload.place} Odyssey — Day by Day</Text>
//                             {payload.itinerary.map((item: any, i: number) => (
//                                 <View style={styles.itineraryItem} key={i}>
//                                     <Text style={styles.dayTitle}>Day {i + 1}: {item.dayTitle}</Text>
//                                     <Text style={styles.dayDescription}>{item.description}</Text>
//                                 </View>
//                             ))}
//                         </View>
//                     )}

//                     {/* Accommodation */}
//                     <View style={styles.accommodationContainer}>
//                         <Text style={styles.accommodationHeader}>Accommodation Details</Text>
//                         {payload.accommodation && payload.accommodation.map((acc: any, i: number) => (
//                             <View style={styles.accommodationRow} key={i}>
//                                 <Text style={styles.accommodationLocation}>
//                                     {acc.location} ({acc.nights} Nights):
//                                 </Text>
//                                 <Text style={styles.accommodationHotel}>{acc.hotelName}</Text>
//                             </View>
//                         ))}
//                     </View>

//                     {/* Activities Section */}
//                     {payload.activities && payload.activities.length > 0 && (
//                         <View style={styles.activitiesContainer}>
//                             <Text style={styles.activitiesHeader}>Included Activities</Text>
//                             {payload.activities.map((activity: any, i: number) => (
//                                 <View style={styles.activityRow} key={i}>
//                                     <Text style={styles.activityName}>{activity.name}</Text>
//                                     <View style={styles.activityPricing}>
//                                         <Text style={styles.activityPrice}>
//                                             Adult: ₹{activity.adultPrice} × {activity.quantity}
//                                         </Text>
//                                         {activity.childPrice > 0 && (
//                                             <Text style={styles.activityPrice}>
//                                                 Child: ₹{activity.childPrice} × {activity.quantity}
//                                             </Text>
//                                         )}
//                                     </View>
//                                 </View>
//                             ))}
//                         </View>
//                     )}

//                     {/* Cost Summary */}
//                     <View style={styles.costContainer}>
//                         <Text style={styles.costHeader}>Cost Breakdown</Text>
//                         <View style={styles.costRow}>
//                             <Text style={styles.costLabel}>• Flight Cost:</Text>
//                             <Text style={styles.costValue}>₹{payload.flightCost} per person</Text>
//                         </View>
//                         <View style={styles.costRow}>
//                             <Text style={styles.costLabel}>• Accommodation & Transfers:</Text>
//                             <Text style={styles.costValue}>₹{Math.round(payload.accommodationAndTransferCost || 0)} per person</Text> 
//                         </View>
//                         {payload.mealPlanCost > 0 && (
//                             <View style={styles.costRow}>
//                                 <Text style={styles.costLabel}>• Meal Plan:</Text>
//                                 <Text style={styles.costValue}>₹{Math.round(payload.mealPlanCost)} per person</Text>
//                             </View>
//                         )}
//                         {payload.activitiesCost > 0 && (
//                             <View style={styles.costRow}>
//                                 <Text style={styles.costLabel}>• Activities:</Text>
//                                 <Text style={styles.costValue}>₹{payload.activitiesCost} per person</Text>
//                             </View>
//                         )}
//                         <View style={styles.costRow}>
//                             <Text style={styles.costLabel}>• Total per person:</Text>
//                             <Text style={styles.costValue}>₹{payload.totalPerHead || "0"}</Text>
//                         </View>
//                         <View style={styles.totalCostRow}>
//                             <Text style={styles.totalCostLabel}>• Total for {payload.groupSize} people:</Text>
//                             <Text style={styles.totalCostValue}>₹{payload.totalGroupCost}</Text>
//                         </View>
//                     </View>

//                     {/* Inclusions & Exclusions */}
//                     <View style={styles.inclusionsContainer}>
//                         <View style={styles.inclusionColumn}>
//                             <Text style={styles.inclusionHeader}>What's Included?</Text>
//                             <View style={styles.inclusionList}>
//                                 {(payload.inclusions && payload.inclusions.length > 0
//                                     ? payload.inclusions
//                                     : [{ item: 'No inclusions selected' }]
//                                 ).map((inc: any, i: number) => (
//                                     <View style={styles.inclusionItem} key={i}>
//                                         <Text style={styles.checkIcon}>✓</Text>
//                                         <Text>{typeof inc === "string" ? inc : inc.item}</Text>
//                                     </View>
//                                 ))}
//                             </View>
//                         </View>

//                         <View style={styles.inclusionColumn}>
//                             <Text style={styles.exclusionHeader}>What's Not Included?</Text>
//                             <View style={styles.inclusionList}>
//                                 {(payload.exclusions && payload.exclusions.length > 0
//                                     ? payload.exclusions
//                                     : [{ item: 'No exclusions selected' }]
//                                 ).map((exc: any, i: number) => (
//                                     <View style={styles.inclusionItem} key={i}>
//                                         <Text style={styles.crossIcon}>✗</Text>
//                                         <Text>{typeof exc === "string" ? exc : exc.item}</Text>
//                                     </View>
//                                 ))}
//                             </View>
//                         </View>
//                     </View>

//                     {/* Why Travomine */}
//                     <View style={styles.whyContainer}>
//                         <Text style={styles.whyHeader}>Why Choose Travomine?</Text>
//                         <Text style={styles.whyText}>
//                             We don't just offer tours — we deliver experiences that touch your soul.
//                             With expert local knowledge, trusted partnerships, and heartfelt care,
//                             we turn your travel dreams into vivid realities.
//                         </Text>
//                     </View>
//                 </View>

//                 {/* Footer */}
//                 <View style={styles.footer}>
//                     <View style={styles.footerContent}>
//                         <Text style={styles.footerTitle}>Ready to embark on your {location} adventure?</Text>
//                         <View style={styles.footerContactGrid}>
//                             <View>
//                                 <Text style={styles.footerContactItem}>Call us: +91-9956735725, 8957124089</Text>
//                                 <Text style={styles.footerContactItem}>Email: info@travomine.com</Text>
//                             </View>
//                             <View>
//                                 <Text style={styles.footerContactItem}>Visit: www.travomine.com</Text>
//                             </View>
//                         </View>
//                         <View style={styles.companyInfo}>
//                             <Text style={styles.companyInfoText}>Travomine Leisure Pvt. Ltd.</Text>
//                             <Text style={styles.footerTagline}>Crafting Memories That Last Forever.</Text>
//                         </View>
//                     </View>
//                 </View>
//             </Page>
//         </Document>
//     );
// }