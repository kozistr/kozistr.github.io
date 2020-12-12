const config = require('./config');
const { title, description, author, googleAnalytics, siteUrl } = config;

const gatsbyConfig = {
  siteMetadata: { title, description, author, siteUrl },

  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: googleAnalytics,
      },
    },

    `gatsby-plugin-react-helmet`,

    `gatsby-plugin-typescript`,

    `gatsby-plugin-theme-ui`,

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/_posts`,
      },
    },

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        tableOfContents: {
          maxDepth: 3,
        },
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // classPrefix: 'language-',
              // inlineCodeMarker: null,
              // aliases: {},
              // showLineNumbers: false,
            },
          },
          {
            resolve: 'gatsby-remark-emojis',
            options: {
              active: true,
              class: 'emoji-icon',
              size: 64,
              styles: {
                display: 'inline',
                margin: '0',
                'margin-top': '1px',
                position: 'relative',
                top: '5px',
                width: '25px',
              },
            },
          },
          `gatsby-remark-autolink-headers`,
          `gatsby-remark-katex`,
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
            },
          },
        ],
      },
    },

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },

    `gatsby-transformer-sharp`,

    `gatsby-plugin-sharp`,

    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: title,
        short_name: title,
        description: description,
        start_url: `/`,
        lang: 'ko',
        background_color: `#fff`,
        theme_color: `#fff`,
        display: `standalone`,
        icon: 'src/images/icon.png',
        legacy: false,
        include_favicon: false,
      },
    },

    `gatsby-plugin-sass`,

    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.ts`,
      },
    },

    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        query: `
          {
          site {
              siteMetadata {
                  siteUrl
              }
          }

          allSitePage {
            edges {
              node {
                path
                context {
                  lastmod
                }
              }
            }
          }
      }`,
        serialize: ({ site, allSitePage }) => {
          return allSitePage.edges.map(edge => {
            return {
              url: site.siteMetadata.siteUrl + edge.node.path,
              changefreq: `daily`,
              lastmod: edge.node.context.lastmod,
              priority: 0.7,
            };
          });
        },
      },
    },

    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ 'content:encoded': edge.node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] }, limit: 10
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      fields { slug }
                      frontmatter {
                        title
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: `${title} | Feed`,
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: siteUrl,
        sitemap: `${siteUrl}${siteUrl[siteUrl.length - 1] !== '/' ? '/' : ''}sitemap.xml`,
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
  ],
};

if (process.env.NODE_ENV === 'development') {
  gatsbyConfig.plugins.push({
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/_drafts`,
      name: 'markdown-pages',
    },
  });
}

module.exports = gatsbyConfig;
