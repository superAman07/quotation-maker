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
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
 
        const data = await req.json();
        const {
            clientName, clientEmail, clientPhone, clientAddress,
            travelDate, groupSize, totalNights, place,
            flightCost, 
            flights,
            accommodations, transfers, mealPlan, itinerary,
            inclusions, exclusions,
            landCostPerHead, totalPerHead, totalGroupCost,
            notes, status
        } = data;
 
        let mealPlanId = null;
        if (mealPlan) {
            const mealPlanRecord = await prisma.mealPlan.findFirst({
                where: { name: mealPlan },
                select: { id: true }
            });
            if (mealPlanRecord) {
                mealPlanId = mealPlanRecord.id;
            }
        }

        const today = new Date();
        const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
        const quotationNo = `Q-${dateStr}-${randomStr}`;

        const quotation = await prisma.quotation.create({
            data: {
                quotationNo,
                clientName, 
                clientEmail: clientEmail || null, 
                clientPhone: clientPhone, 
                clientAddress: clientAddress || null,
                travelDate: travelDate ? new Date(travelDate) : new Date(),
                groupSize: groupSize || 1,
                totalNights: totalNights || 0,
                place,
                flightCostPerPerson: flightCost || null,
                // flightImageUrl: flightImageUrl || null,
                landCostPerPerson: landCostPerHead || null,
                totalCostPerPerson: totalPerHead || null,
                totalGroupCost: totalGroupCost || null,
                notes: notes || null,
                status: status as QuotationStatus,
                createdBy: { connect: { id: Number((payload as { userId: string }).userId) } },
                ...(mealPlanId && { mealPlan: { connect: { id: mealPlanId } } }),                
                flights: {
                    create: flights?.map((f: any) => ({
                        type: f.type,
                        route: f.route,
                        date: new Date(f.date),
                        imageUrl: f.imageUrl
                    })) || []
                },
                accommodations: accommodations?.length ? { create: accommodations } : undefined,
                transfers: transfers?.length ? { create: transfers } : undefined,
                itinerary: itinerary?.length ? { create: itinerary } : undefined,
                inclusions: inclusions?.length ? { create: inclusions } : undefined,
                exclusions: exclusions?.length ? { create: exclusions } : undefined,
            },
        });

        return NextResponse.json({ message: "Quotation created successfully", quotation }, { status: 201 });
    } catch (error) {
        console.error("QUOTATION CREATE ERROR:", error);
        return NextResponse.json({ error: "Internal server error while creating quotation." }, { status: 500 });
    }
}