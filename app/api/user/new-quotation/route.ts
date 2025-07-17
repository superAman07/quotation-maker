import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "cookie";
import { jwtVerify } from "jose";
import { QuotationStatus } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    try {
        // Auth check (same as before)
        const cookie = req.headers.get("cookie");
        if (!cookie) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        const { auth_token } = parse(cookie);
        if (!auth_token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        let payload;
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const verified = await jwtVerify(auth_token, secret);
            payload = verified.payload;
        } catch {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }
        if (payload.role !== "Employee") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Get new quotation data from request body
        const {
            quotationNo,
            clientInfo,
            travelSummary,
            accommodations,
            itinerary,
            inclusions,
            exclusions,
            costing,
            notes,
            status
        } = await req.json();

        // Validate status
        const validStatuses = ["DRAFT", "SENT", "APPROVED", "REJECTED", "CANCELLED"];
        const finalStatus = validStatuses.includes((status || "").toUpperCase())
            ? (status.toUpperCase() as QuotationStatus)
            : QuotationStatus.DRAFT;

        // Create quotation in DB
        const quotation = await prisma.quotation.create({
            data: {
                quotationNo: quotationNo,
                clientName: clientInfo.name,
                clientEmail: clientInfo.email,
                clientPhone: clientInfo.phone,
                clientAddress: clientInfo.address,
                travelDate: travelSummary.dateOfTravel,
                groupSize: travelSummary.groupSize,
                mealPlan: travelSummary.mealPlan,
                vehicleUsed: travelSummary.vehicleUsed,
                flightCost: travelSummary.flightCostPerPerson,
                flightImageUrl: travelSummary.flightImageUrl,
                landCostPerHead: costing.landCostPerPerson,
                totalPerHead: costing.totalCostPerPerson,
                totalGroupCost: costing.totalGroupCost,
                notes: notes,
                status: finalStatus,
                createdBy: { connect: { id: Number((payload as { userId: string }).userId) } },
                accommodation: {
                    create: (accommodations || []).map((acc: any) => ({
                        location: acc.location,
                        hotelName: acc.hotelName,
                        nights: acc.numberOfNights,
                    })),
                },
                itinerary: {
                    create: (itinerary || []).map((item: any) => ({
                        dayTitle: item.dayTitle,
                        description: item.description,
                    })),
                },
                inclusions,
                exclusions,
            },
        });

        return NextResponse.json({ message: "Quotation created", quotation }, { status: 201 });
    } catch (error) {
        console.error("QUOTATION CREATE ERROR:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { parse } from "cookie";
// import { jwtVerify } from "jose";
// import { ServiceType, QuotationStatus } from "@prisma/client";

// const JWT_SECRET = process.env.JWT_SECRET!;

// export async function POST(req: NextRequest) {
//     try {
//         // Parse cookies and get token
//         const cookie = req.headers.get("cookie");
//         if (!cookie) {
//             return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//         }
//         const { auth_token } = parse(cookie);
//         if (!auth_token) {
//             return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//         }

//         // Verify JWT
//         let payload;
//         try {
//             const secret = new TextEncoder().encode(JWT_SECRET);
//             const verified = await jwtVerify(auth_token, secret);
//             payload = verified.payload;
//         } catch {
//             return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//         }

//         // Only allow Employee
//         if (payload.role !== "Employee") {
//             return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//         }

//         const validTypes = ["HOTEL", "FLIGHT", "TOUR", "INSURANCE", "OTHER"];
//         const validStatuses = ["DRAFT", "SENT", "APPROVED", "REJECTED", "CANCELLED"];

//         // Get quotation data from request body
//         const {
//             quotationNo,
//             clientName,
//             clientEmail,
//             clientAddress,
//             departureCity,
//             destinationCity,
//             departureDate,
//             returnDate,
//             travelersCount,
//             subtotal,
//             tax,
//             discount,
//             total,
//             itinerary,
//             services,
//             status,  
//         } = await req.json();

//         // Validate status
//         const finalStatus = validStatuses.includes((status || "").toUpperCase())
//             ? (status.toUpperCase() as QuotationStatus)
//             : QuotationStatus.DRAFT;
 
//         const quotation = await prisma.quotation.create({
//             data: {
//                 quotationNo,
//                 clientName,
//                 clientEmail,
//                 clientAddress,
//                 departureCity,
//                 destinationCity,
//                 departureDate: new Date(departureDate),
//                 returnDate: returnDate ? new Date(returnDate) : null,
//                 travelersCount,
//                 subtotal,
//                 tax,
//                 discount,
//                 total,
//                 status: finalStatus,  
//                 createdBy: { connect: { id: Number((payload as { userId: string }).userId) } },
//                 itineraryItems: {
//                     create: (itinerary as any[]).map((item) => ({
//                         day: item.day,
//                         description: item.activity,
//                         date: new Date(item.date),
//                         cost: item.cost,
//                     }))
//                 },
//                 services: {
//                     create: (services as any[]).map((service) => ({
//                         type: validTypes.includes(service.type.toUpperCase())
//                             ? (service.type.toUpperCase() as ServiceType)
//                             : ServiceType.OTHER,
//                         details: service.details,
//                         cost: service.cost,
//                     }))
//                 }
//             },
//         });

//         return NextResponse.json({ message: "Quotation created", quotation }, { status: 201 });
//     } catch (error) {
//         console.error("QUOTATION CREATE ERROR:", error);
//         return NextResponse.json({ error: "Internal server error" }, { status: 500 });
//     }
// }