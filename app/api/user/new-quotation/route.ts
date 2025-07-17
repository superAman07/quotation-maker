import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "cookie";
import { jwtVerify } from "jose";
import { QuotationStatus } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    try {
        
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
 
        const {
            // quotationNo,
            // clientInfo,
            // travelSummary,
            // accommodations,
            // itinerary,
            // inclusions,
            // exclusions,
            // costing,
            // notes,
            // status
            quotationNo,
            clientName,
            clientEmail,
            clientPhone,
            clientAddress,
            travelDate,
            groupSize,
            mealPlan,
            vehicleUsed,
            localVehicleUsed,
            flightCost,
            flightImageUrl,
            landCostPerHead,
            totalPerHead,
            totalGroupCost,
            notes,
            status,
            accommodation,
            itinerary,
            inclusions,
            exclusions,
        } = await req.json();
 
        const validStatuses = ["DRAFT", "SENT", "APPROVED", "REJECTED", "CANCELLED"];
        const finalStatus = validStatuses.includes((status || "").toUpperCase())
            ? (status.toUpperCase() as QuotationStatus)
            : QuotationStatus.DRAFT;

        const quotation = await prisma.quotation.create({
            data: {
                // quotationNo: quotationNo,
                // clientName: clientInfo.name,
                // clientEmail: clientInfo.email,
                // clientPhone: clientInfo.phone,
                // clientAddress: clientInfo.address,
                // travelDate: travelSummary.dateOfTravel,
                // groupSize: travelSummary.groupSize,
                // mealPlan: travelSummary.mealPlan,
                // vehicleUsed: travelSummary.vehicleUsed,
                // flightCost: travelSummary.flightCostPerPerson,
                // flightImageUrl: travelSummary.flightImageUrl,
                // landCostPerHead: costing.landCostPerPerson,
                // totalPerHead: costing.totalCostPerPerson,
                // totalGroupCost: costing.totalGroupCost,
                // notes: notes,
                // status: finalStatus,
                // createdBy: { connect: { id: Number((payload as { userId: string }).userId) } },
                // accommodation: {
                //     create: (accommodations || []).map((acc: any) => ({
                //         location: acc.location,
                //         hotelName: acc.hotelName,
                //         nights: acc.numberOfNights,
                //     })),
                // },
                // itinerary: {
                //     create: (itinerary || []).map((item: any) => ({
                //         dayTitle: item.dayTitle,
                //         description: item.description,
                //     })),
                // },
                // inclusions,
                // exclusions,
                quotationNo,
                clientName,
                clientEmail,
                clientPhone,
                clientAddress,
                travelDate:new Date(travelDate),
                groupSize,
                mealPlan,
                vehicleUsed,
                localVehicleUsed,
                flightCost,
                flightImageUrl,
                landCostPerHead,
                totalPerHead,
                totalGroupCost,
                notes,
                status: finalStatus,
                createdBy: { connect: { id: Number((payload as { userId: string }).userId) } },
                accommodation: { create: accommodation },
                itinerary: { create: itinerary },
                inclusions: { create: inclusions },
                exclusions: { create: exclusions },
            },
        });

        return NextResponse.json({ message: "Quotation created", quotation ,status: 201});
    } catch (error) {
        console.error("QUOTATION CREATE ERROR:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}