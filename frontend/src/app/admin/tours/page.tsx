import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import AdminNav from "../AdminNav";
import ToursAdminClient from "./ToursAdminClient";

import {
  getAdminToursPage,
} from "@/lib/server/admin-tours";

export const dynamic = "force-dynamic";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Manage Tours | Admin",
    description:
      "Manage tour details, starting prices, and photos in the Methmi Enterprises admin dashboard.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function ToursAdminPage({
  searchParams,
}: Props) {
  const params = await searchParams;

  // Read requested page number.
  const rawPage = params.page;

  const requestedPage = Number(rawPage ?? "1");

  // Validate page number.
  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  // Fetch tours using safe pagination.
  const {
    tours,
    total,
    totalPages,
    currentPage,
  } = await getAdminToursPage(page);

  // ICA 7 FIX:
  // Redirect invalid or out-of-range pages.
  if (
    rawPage !== undefined &&
    rawPage !== String(currentPage)
  ) {
    redirect(`/admin/tours?page=${currentPage}`);
  }

  return (
    <>
      <AdminNav />

      <main className="container-page py-10">
        <ToursAdminClient
          key={currentPage}
          initialTours={tours}
        />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">

          <p className="text-sm text-ink-700">
            Total Tours: {total}
          </p>

          {totalPages > 1 && (
            <nav
              aria-label="Tours pagination"
              className="flex items-center gap-3"
            >

              {currentPage > 1 && (
                <Link
                  href={`/admin/tours?page=${currentPage - 1}`}
                  className="rounded-lg border px-4 py-2"
                >
                  Previous
                </Link>
              )}

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              {currentPage < totalPages && (
                <Link
                  href={`/admin/tours?page=${currentPage + 1}`}
                  className="rounded-lg border px-4 py-2"
                >
                  Next
                </Link>
              )}

            </nav>
          )}

        </div>
      </main>
    </>
  );
}