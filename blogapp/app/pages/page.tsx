import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const pages = [
  { title: "Home", href: "/", description: "Back to the main landing page" },
  { title: "Blog", href: "/blog", description: "Browse all blog articles" },
  { title: "Contact", href: "/contact", description: "Get in touch with us" },
];

export default function PagesPage() {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pages</h1>
      <p className="text-gray-500 mb-8">All available pages on this site.</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {pages.map((page) => (
          <Link key={page.href} href={page.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-5">
                <h3 className="font-semibold text-gray-900 mb-1">{page.title}</h3>
                <p className="text-sm text-gray-500">{page.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
