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
    
    // ✅ NEW: Itinerary Day Colors
    day1: '#FF6B6B',
    day2: '#4ECDC4',
    day3: '#45B7D1',
    day4: '#FFA07A',
    day5: '#98D8C8',
    day6: '#F7DC6F',
};

const styles = StyleSheet.create({
    page: {
        paddingTop: 120,
        paddingBottom: 70,
        paddingHorizontal: 0,
        fontFamily: 'NotoSans',
        fontSize: 10,
        color: colors.textDark,
        backgroundColor: colors.white,
    },

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

    contentContainer: {
        paddingHorizontal: 70,
    },

    section: {
        marginBottom: 20,
    },
    
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

    // ✅ FIXED: Simple text instead of special symbols
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

    // ✅ NEW: Colorful Itinerary Styling
    itineraryHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primaryBlue,
        marginBottom: 12,
        paddingBottom: 6,
        borderBottomWidth: 2,
        borderBottomColor: colors.primaryBlue,
    },
    dayContainer: {
        marginBottom: 12,
        paddingLeft: 12,
        borderLeftWidth: 4,
        paddingBottom: 8,
    },
    dayTitle: {
        fontWeight: 'bold',
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

    // ✅ NEW: Wishing Message
    wishingBox: {
        marginTop: 20,
        padding: 15,
        backgroundColor: colors.primaryBlue,
        borderRadius: 8,
        alignItems: 'center',
    },
    wishingText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
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

    // ✅ Helper: Get color for each day
    const getDayColor = (index: number) => {
        const dayColors = [colors.day1, colors.day2, colors.day3, colors.day4, colors.day5, colors.day6];
        return dayColors[index % dayColors.length];
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                
                <View style={styles.header} fixed>
                    <Image src="/logo.png" style={styles.logo} />
                    <Image src="/google-symbol.png" style={styles.googleBadge} />
                </View>

                <View style={styles.footer} fixed>
                    <Text style={styles.footerBrand}>Travomine Leisure Pvt. Ltd.</Text>
                    <Text style={styles.footerText}>
                        Address: Your Company Address Here | Phone: +91-9956735725 | Email: info@travomine.com
                    </Text>
                    <Text style={styles.footerText}>
                        www.travomine.com | Terms & Conditions Apply
                    </Text>
                </View>

                <View style={styles.contentContainer}>

                    {/* Package Overview */}
                    <View style={styles.section}>
                        <Text style={styles.mainTitle}>
                            {payload.place} {payload.totalNights}N/{payload.totalNights + 1}D PACKAGE
                        </Text>
                        <Text style={styles.subTitle}>
                            {payload.totalNights} Nights | {payload.groupSize} Pax | Query ID: {payload.quotationNo || 'N/A'}
                        </Text>
                    </View>

                    {/* Quick Summary - FIXED ICON */}
                    <View style={styles.section} wrap={false}>
                        <Text style={styles.summaryHeader}>QUICK SUMMARY</Text>
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
                                    {payload.transfers?.map((t: any) => t.type).join(' -> ') || 'Not Selected'}
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

                    {/* Flight Details */}
                    {payload.flightCost > 0 && (
                        <View style={styles.section} wrap={false}>
                            <Text style={styles.flightHeader}>FLIGHT DETAILS</Text>
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

                    {/* Colorful Day-wise Itinerary */}
                    {payload.itinerary && payload.itinerary.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.itineraryHeader}>DAY-WISE ITINERARY</Text>
                            {payload.itinerary.map((item: any, i: number) => (
                                <View 
                                    key={i} 
                                    style={[
                                        styles.dayContainer, 
                                        { borderLeftColor: getDayColor(i) }
                                    ]} 
                                    wrap={false}
                                >
                                    <Text style={[styles.dayTitle, { color: getDayColor(i) }]}>
                                        Day {i + 1}: {item.dayTitle}
                                    </Text>
                                    <Text style={styles.dayDesc}>{item.description}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Pricing Summary */}
                    <View style={styles.section} wrap={false}>
                        <Text style={[styles.summaryHeader, { color: colors.textDark }]}>PRICING SUMMARY</Text>
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

                    {/* Inclusions & Exclusions */}
                    <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }} wrap={false}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 5, color: 'green' }}>Inclusions</Text>
                            {payload.inclusions?.map((inc: any, i: number) => (
                                <Text key={i} style={{ fontSize: 9, marginBottom: 2 }}>• {typeof inc === 'string' ? inc : inc.item}</Text>
                            ))}
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontWeight: 'bold', marginBottom: 5, color: 'red' }}>Exclusions</Text>
                            {payload.exclusions?.map((exc: any, i: number) => (
                                <Text key={i} style={{ fontSize: 9, marginBottom: 2 }}>• {typeof exc === 'string' ? exc : exc.item}</Text>
                            ))}
                        </View>
                    </View>

                    {/* ✅ NEW: Wishing Message */}
                    <View style={styles.wishingBox} wrap={false}>
                        <Text style={styles.wishingText}>WISHING YOU A HAPPY JOURNEY!</Text>
                    </View>

                </View>

            </Page>
        </Document>
    );
}