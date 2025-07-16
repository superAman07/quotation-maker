import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "cookie";
import { jwtVerify } from "jose";
import { ServiceType, QuotationStatus } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    try {
        // Parse cookies and get token
        const cookie = req.headers.get("cookie");
        if (!cookie) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        const { auth_token } = parse(cookie);
        if (!auth_token) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Verify JWT
        let payload;
        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const verified = await jwtVerify(auth_token, secret);
            payload = verified.payload;
        } catch {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
        }

        // Only allow Employee
        if (payload.role !== "Employee") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const validTypes = ["HOTEL", "FLIGHT", "TOUR", "INSURANCE", "OTHER"];
        const validStatuses = ["DRAFT", "SENT", "APPROVED", "REJECTED", "CANCELLED"];

        // Get quotation data from request body
        const {
            quotationNo,
            clientName,
            clientEmail,
            clientAddress,
            departureCity,
            destinationCity,
            departureDate,
            returnDate,
            travelersCount,
            subtotal,
            tax,
            discount,
            total,
            itinerary,
            services,
            status,  
        } = await req.json();

        // Validate status
        const finalStatus = validStatuses.includes((status || "").toUpperCase())
            ? (status.toUpperCase() as QuotationStatus)
            : QuotationStatus.DRAFT;
 
        const quotation = await prisma.quotation.create({
            data: {
                quotationNo,
                clientName,
                clientEmail,
                clientAddress,
                departureCity,
                destinationCity,
                departureDate: new Date(departureDate),
                returnDate: returnDate ? new Date(returnDate) : null,
                travelersCount,
                subtotal,
                tax,
                discount,
                total,
                status: finalStatus,  
                createdBy: { connect: { id: Number((payload as { userId: string }).userId) } },
                itineraryItems: {
                    create: (itinerary as any[]).map((item) => ({
                        day: item.day,
                        description: item.activity,
                        date: new Date(item.date),
                        cost: item.cost,
                    }))
                },
                services: {
                    create: (services as any[]).map((service) => ({
                        type: validTypes.includes(service.type.toUpperCase())
                            ? (service.type.toUpperCase() as ServiceType)
                            : ServiceType.OTHER,
                        details: service.details,
                        cost: service.cost,
                    }))
                }
            },
        });

        return NextResponse.json({ message: "Quotation created", quotation }, { status: 201 });
    } catch (error) {
        console.error("QUOTATION CREATE ERROR:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}