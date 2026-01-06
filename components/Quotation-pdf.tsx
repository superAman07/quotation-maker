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
    
    refBlue: '#2563EB',           // Hotel Title
    refGreen: '#16A34A',          // Transfer Title
    refOrange: '#EA580C',         // Tours Title
    refPurple: '#9333EA',         // Pricing Title
    refYellow: '#FA-CC15',        // Highlight Background
    refText: '#1F2937',

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
        color: colors.accentRed,
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
        marginVertical: 4,
        borderRadius: 4,
    },
    flightLegHeader: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.textDark,
        marginTop: 8,
        marginBottom: 2,
    },
    flightTotalCostBox: {
        backgroundColor: colors.highlightYellow, // MATCHED REFERENCE YELLOW
        padding: 6,
        marginTop: 10,
        alignSelf: 'flex-start',
        borderRadius: 2,
    },
    flightTotalCostText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.textDark,
    },
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

    richSectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 6,
        marginTop: 15,
        textTransform: 'uppercase',
    },
    richListItem: {
        fontSize: 10,
        marginBottom: 3,
        paddingLeft: 10,
        color: colors.textDark,
    },
    richDisclaimer: {
        fontSize: 9,
        fontStyle: 'italic',
        color: colors.textGray,
        marginTop: 4,
        marginBottom: 10,
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

    pricingHighlightRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFF00', // Bright Yellow like reference
        padding: 4,
        marginBottom: 6,
        alignSelf: 'flex-start',
    },
    pricingTotalRow: {
        flexDirection: 'row',
        backgroundColor: '#FFFF00',
        padding: 4,
        marginTop: 2,
        alignSelf: 'flex-start',
    },
    
    // Contact Section
    contactHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.refBlue,
        marginTop: 20,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    contactText: {
        fontSize: 9,
        marginBottom: 2,
        color: colors.textDark,
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
                        Address: LGF 17, Ajanta Tower, Near Phoenix United Mall, Kanpur Road, Lucknow, UP – 201301
                    </Text>
                    <Text style={styles.footerText}>
                        Phone: 8957124089, 9956735725 | Email: info@travomine.com | www.travomine.com
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
                    
                    {((payload.flights && payload.flights.length > 0) || payload.flightCost > 0) && (
                        <View style={styles.section} wrap={false}>
                            <Text style={styles.flightHeader}>FLIGHT DETAILS</Text>

                            {payload.flights && payload.flights.length > 0 ? (
                                payload.flights.map((leg: any, i: number) => {
                                    const legImgUrl = leg.imageUrl 
                                        ? (leg.imageUrl.startsWith('http') 
                                            ? leg.imageUrl 
                                            : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${leg.imageUrl}`)
                                        : null;

                                    return (
                                        <View key={i} wrap={false} style={{ marginBottom: 5 }}>
                                            <Text style={styles.flightLegHeader}>
                                                <Text style={{ color: '#F59E0B' }}>★ </Text>
                                                {leg.type} – {leg.route} ({formatDate(leg.date)})
                                            </Text>
                                            {legImgUrl && (
                                                <Image src={legImgUrl} style={styles.flightImage} />
                                            )}
                                        </View>
                                    );
                                })
                            ) : payload.flightImageUrl ? (
                                <View style={styles.flightCard}>
                                    <Text style={styles.flightRoute}>Flight Included in Package</Text>
                                    <Image 
                                        src={payload.flightImageUrl.startsWith('http') ? payload.flightImageUrl : `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${payload.flightImageUrl}`}
                                        style={styles.flightImage}
                                    />
                                </View>
                            ) : null}
                            {payload.flightCost > 0 && (
                                <View style={styles.flightTotalCostBox}>
                                    <Text style={styles.flightTotalCostText}>
                                        Flight Cost : {formatCurrency(payload.flightCost)} Per Person
                                        {payload.groupSize > 1 ? `   ${formatCurrency(payload.flightCost * payload.groupSize)} For ${payload.groupSize} Persons` : ''}
                                    </Text>
                                </View>
                            )}
                        </View>
                    )}

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

                    

                    <View break={payload.itinerary?.length > 3}> {/* Forced break if itinerary is long */}
                        
                        {/* 🏢 HOTEL DETAILS (BLUE) */}
                        {payload.accommodation && payload.accommodation.length > 0 && (
                            <View style={styles.section} wrap={false}>
                                <Text style={[styles.richSectionHeader, { color: colors.refBlue }]}>HOTEL DETAILS</Text>
                                {payload.accommodation.map((acc: any, i: number) => (
                                    <Text key={i} style={styles.richListItem}>
                                        • {acc.hotelName} – {acc.roomType} ({acc.nights} Nights)
                                    </Text>
                                ))}
                                <Text style={styles.richDisclaimer}>
                                    Hotels are subject to availability. In case of unavailability, equivalent accommodation will be provided.
                                </Text>
                            </View>
                        )}

                        {/* 🚌 TRANSFERS INCLUDED (GREEN) */}
                        {payload.transfers && payload.transfers.length > 0 && (
                            <View style={styles.section} wrap={false}>
                                <Text style={[styles.richSectionHeader, { color: colors.refGreen }]}>TRANSFERS INCLUDED</Text>
                                {payload.transfers.map((t: any, i: number) => (
                                    <Text key={i} style={styles.richListItem}>
                                        • {t.type} {t.vehicleName ? `(${t.vehicleName})` : ''}
                                    </Text>
                                ))}
                            </View>
                        )}

                        {/* 🌴 TOURS INCLUDED (ORANGE) */}
                        {payload.activities && payload.activities.length > 0 && (
                            <View style={styles.section} wrap={false}>
                                <Text style={[styles.richSectionHeader, { color: colors.refOrange }]}>TOURS INCLUDED (ALL FEES INCLUDED)</Text>
                                {payload.activities.map((act: any, i: number) => (
                                    <Text key={i} style={styles.richListItem}>
                                        • {act.name}
                                    </Text>
                                ))}
                            </View>
                        )}

                        {/* 💰 PRICING SECTION (PURPLE) */}
                        <View style={styles.section} wrap={false}>
                            <Text style={[styles.richSectionHeader, { color: colors.refPurple }]}>PRICING SECTION</Text>
                            
                            {/* Land Package Cost */}
                            <View style={styles.pricingHighlightRow}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                                    Package Cost (Land Only): {formatCurrency(payload.landCostPerHead)} Per Person
                                    {payload.groupSize > 1 ? `  ${formatCurrency(payload.landCostPerHead * payload.groupSize)} Total` : ''}
                                </Text>
                            </View>
                            
                            {/* Total Cost with Flight */}
                            <View style={styles.pricingTotalRow}>
                                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>
                                    Total Cost ({payload.flightCost > 0 ? 'with Flight' : 'Land Only'}): {formatCurrency(payload.totalGroupCost)}
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

                        {/* 📞 CONTACT DETAIL */}
                        <View style={styles.section} wrap={false}>
                            <Text style={styles.contactHeader}>CONTACT DETAILS – TRAVOMINE</Text>
                            <Text style={[styles.contactText, { fontWeight: 'bold' }]}>Travomine Leisure Pvt. Ltd.</Text>
                            <Text style={styles.contactText}>Regd Office: B-128, First Floor, Sector-2, Noida, Uttar Pradesh – 201301</Text>
                            <Text style={styles.contactText}>Branch Office: LGF 17, Ajanta Tower, Near Phoenix United Mall, Kanpur Road, Lucknow</Text>
                            <Text style={[styles.contactText, { textDecoration: 'underline', color: 'blue' }]}>Email: info@travomine.com</Text>
                            <Text style={styles.contactText}>Phone: 8957124089, 9956735725</Text>
                            <Text style={[styles.contactText, { textDecoration: 'underline', color: 'blue' }]}>Website: www.travomine.com</Text>
                        </View>

                        {/* ✅ NEW: Wishing Message */}
                        <View style={styles.wishingBox} wrap={false}>
                            <Text style={styles.wishingText}>WISHING YOU A HAPPY JOURNEY!</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}