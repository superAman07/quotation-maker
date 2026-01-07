import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "cookie"; 
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
    try { 
        const cookie = req.headers.get("cookie");
        if (!cookie) {
            return NextResponse.json([], { status: 401 });
        }
        const { auth_token } = parse(cookie);
        if (!auth_token) {
            return NextResponse.json([], { status: 401 });
        }
 
        let userId: number;
        let role: string;

        try {
            const secret = new TextEncoder().encode(JWT_SECRET);
            const verified = await jwtVerify(auth_token, secret);
            
            // Standardize ID access (handle both 'id' and 'userId' payload keys)
            userId = Number(verified.payload.id || verified.payload.userId);
            role = verified.payload.role as string;
        } catch {
            return NextResponse.json([], { status: 401 });
        }

        // 1. Define Filter Logic
        let whereClause: any = {};

        if (role === 'Admin') {
            // Admin sees all quotations
            whereClause = {};
        } else {
            // Employee sees:
            // 1. Quotes they created
            // 2. OR Quotes assigned to them
            whereClause = {
                OR: [
                    { createdById: userId },
                    { assignedToId: userId }
                ]
            };
        }

        // 2. Fetch with Creator/Assignee details
        const quotations = await prisma.quotation.findMany({
            where: whereClause,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                assignedTo: {
                    select: { name: true, email: true }
                },
                createdBy: {
                    select: { name: true }
                }
            }
        });

        return NextResponse.json(quotations);
    } catch (error) {
        console.error("Error fetching quotations:", error);
        return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 });
    }
}

// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import jwt from "jsonwebtoken"; 

// export async function GET(req: Request) {
//     try { 
//         const cookie = req.headers.get("cookie") || "";
//         const tokenMatch = cookie.match(/auth_token=([^;]+)/);
//         const token = tokenMatch ? tokenMatch[1] : null;

//         if (!token) {
//             return NextResponse.json([], { status: 401 });
//         }
 
//         const secret = process.env.JWT_SECRET!;
//         let payload;
//         try {
//             payload = jwt.verify(token, secret);
//         } catch {
//             return NextResponse.json([], { status: 401 });
//         }
 
//         let email: string | undefined;
//         if (typeof payload === "object" && payload !== null && "email" in payload) {
//             email = (payload as jwt.JwtPayload).email as string | undefined;
//         }

//         if (!email) {
//             return NextResponse.json([], { status: 401 });
//         }

//         const quotations = await prisma.quotation.findMany({
//             where: {
//                 createdBy: {
//                     email: email 
//                 }
//             }
//         });

//         return NextResponse.json(quotations);
//     } catch (error) {
//         console.error("Error fetching quotations:", error);
//         return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 });
//     }
// }