import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { Pengaduan, ApiResponse } from "@/types";
import { getSession } from "@/lib/session";

type Params = { params: Promise<{ id: string }> };

// GET /api/pengaduan/[id]
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const pengaduan = await queryOne<Pengaduan>(
      `SELECT * FROM pengaduan WHERE id = ?`,
      [id]
    );

    if (!pengaduan) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Pengaduan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Pengaduan>>({
      success: true,
      data: pengaduan,
    });
  } catch (error) {
    console.error("[GET /api/pengaduan/[id]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal mengambil data" },
      { status: 500 }
    );
  }
}

// PUT /api/pengaduan/[id] - Update status (admin only)
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["menunggu", "diproses", "selesai"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Status tidak valid" },
        { status: 400 }
      );
    }

    const existing = await queryOne<Pengaduan>(
      `SELECT id FROM pengaduan WHERE id = ?`,
      [id]
    );

    if (!existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Pengaduan tidak ditemukan" },
        { status: 404 }
      );
    }

    await query(
      `UPDATE pengaduan SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [status, id]
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Status berhasil diperbarui",
    });
  } catch (error) {
    console.error("[PUT /api/pengaduan/[id]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal memperbarui data" },
      { status: 500 }
    );
  }
}

// DELETE /api/pengaduan/[id] - Delete (admin only)
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await getSession();
    if (!session.isLoggedIn) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await queryOne<Pengaduan>(
      `SELECT id FROM pengaduan WHERE id = ?`,
      [id]
    );

    if (!existing) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Pengaduan tidak ditemukan" },
        { status: 404 }
      );
    }

    await query(`DELETE FROM pengaduan WHERE id = ?`, [id]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Pengaduan berhasil dihapus",
    });
  } catch (error) {
    console.error("[DELETE /api/pengaduan/[id]]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Gagal menghapus data" },
      { status: 500 }
    );
  }
}
