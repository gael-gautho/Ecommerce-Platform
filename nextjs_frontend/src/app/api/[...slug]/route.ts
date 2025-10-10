import { NextRequest, NextResponse } from "next/server";

async function handleProxy(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {
  
  const path = req.nextUrl.pathname.replace('/api', '');
  const url = `${process.env.NEXT_PUBLIC_API_HOST}/${path}/`;
  console.log(req.cookies.get('session_access_token'))

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("Content-Type") || "application/json",
      "Authorization": `Bearer ${req.cookies.get('session_access_token')?.value}` || "",
    },
    body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.text(),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });

}

export async function GET(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {

  return handleProxy(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {

  return handleProxy(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {

  return handleProxy(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ slug: string[] }> }) {

  return handleProxy(req, context);
}