/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional: Customize other settings here

  // Middleware matcher — tells Next.js where middleware should apply
  matcher: ["/premium/:path*"],
};

module.exports = nextConfig; 