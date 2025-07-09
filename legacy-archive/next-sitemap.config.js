/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://optimaliq.ai',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/premium/account/'],
      },
    ],
    additionalSitemaps: [
      'https://optimaliq.ai/sitemap.xml',
    ],
  },
  exclude: ['/api/*', '/admin/*', '/_next/*', '/premium/account/*'],
  changefreq: 'weekly',
  priority: 0.7,
} 