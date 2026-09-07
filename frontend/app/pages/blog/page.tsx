import type { Metadata } from "next";

import { Navbar } from "@/app/components/marketing/navbar";
import { Footer } from "@/app/components/marketing/footer";
import { BlogListClient } from "@/app/components/blog/blog-list-client";

export const metadata: Metadata = {
  title: "Blog — BestBuild",
  description:
    "Guides, product updates, and stories from BestBuild — the AI-powered construction marketplace.",
};

export default function BlogIndexPage() {
  return (
    <>
      <Navbar />
      <main>
        <BlogListClient />
      </main>
      <Footer />
    </>
  );
}
