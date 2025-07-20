import { prisma } from "@/lib/prisma";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"; 

type DecodedToken = { name?: string; email?: string; role?: string };

export async function POST(req: NextRequest) { 
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: DecodedToken;
  try {
    decoded = jwtDecode<DecodedToken>(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  if (decoded.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
 
  const body = await req.json();
  const { name, state, country, description, imageUrl } = body;

  if (!name || typeof name !== "string") {
    return NextResponse.json(
      { error: "`name` is required and must be a string" },
      { status: 400 }
    );
  } 
  try {
    const destination = await prisma.destination.create({
      data: { name, state, country, description, imageUrl },
    });
    return NextResponse.json(
      { destination, message: "Destination created successfully" },
      { status: 201 }
    );
  } catch (err: any) { 
    if (err.code === "P2002" && err.meta?.target?.includes("name")) {
      return NextResponse.json(
        { error: "A destination with this name already exists" },
        { status: 409 }
      );
    }
    console.error("DB error:", err);
    return NextResponse.json(
      { error: "Failed to create destination" },
      { status: 500 }
    );
  }
}

export async function GET() { 
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let decoded: DecodedToken;
  try {
    decoded = jwtDecode<DecodedToken>(token);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  if (decoded.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
 
  try {
    const destinations = await prisma.destination.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ destinations }, { status: 200 });
  } catch (err) {
    console.error("DB error:", err);
    return NextResponse.json(
      { error: "Failed to retrieve destinations" },
      { status: 500 }
    );
  }
}




// import { prisma } from "@/lib/prisma";
// import { jwtDecode } from "jwt-decode";
// import { cookies } from "next/headers";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get("auth_token")?.value;
//         if (!token) {
//             return new Response("Unauthorized", { status: 401 });
//         }
//         const decoded = jwtDecode(token) as {name?: string; email?: string; role?: string};
//         if (decoded.role !== "admin") {
//             return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//         }
//         const body = await req.json();
//         const response = await prisma.destination.create({
//             data: {
//                 name: body.name,
//                 state: body.state,
//                 country: body.country,
//                 description: body.description,
//                 imageUrl: body.image,
//             }
//         })
//         return NextResponse.json({ response, message: "Destination created successfully" }, { status: 201 });
//     } catch (error) {
//         return NextResponse.json({ error: "Failed to create destination" }, { status: 500 });
//     }
// }

// export async function GET() {
//     try {
//         const cookieStore = await cookies();
//         const token = cookieStore.get("auth_token")?.value;
//         if (!token) {
//             return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//         }
//         const decoded = jwtDecode(token) as {name?: string; email?: string; role?: string};
//         if (decoded.role !== "admin") {
//             return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//         }
//         const destinations = await prisma.destination.findMany();
//         return NextResponse.json({ destinations }, { status: 200 });
//     } catch (error) {
//         return NextResponse.json({ error: "Failed to retrieve destinations" }, { status: 500 });
//     }
// }