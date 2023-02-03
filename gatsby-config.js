const config = require('./config')
const { title, description, author, googleGTag, siteUrl, language } = config

const gatsbyConfig = {
  siteMetadata: { title, description, author, siteUrl, language },

  plugins: [
    `gatsby-plugin-image`,

    `gatsby-plugin-typescript`,

    `gatsby-plugin-react-helmet`,

    `gatsby-plugin-theme-ui`,

    `gatsby-plugin-sass`,

    `gatsby-plugin-remove-fingerprints`,

    `gatsby-transformer-sharp`,

    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        failOn: `none`,
        stripMetadata: true,
        defaultQuality: 50,
      },
    },

    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [googleGTag],
        pluginConfig: {
          head: true
        }
      },
    },

    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `markdown-pages`,
        path: `${__dirname}/_posts`,
        ignore: [`**/.*`], // ignore files starting with a dot
      },
    },

    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              loading: 'lazy',
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              // classPrefix: 'language-',
              // inlineCodeMarker: null,
              // showLineNumbers: false,
              // noInlineHighlight: false,
              // escapeEntities: {},
              // aliases: {},
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
          {
            resolve: `gatsby-remark-katex`,
            options: {
              strict: `ignore`,
            },
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
            },
          },
          `gatsby-remark-copy-linked-files`,
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

    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: title,
        short_name: title,
        description: description,
        start_url: `/`,
        background_color: `#fff`,
        theme_color: `#6a737d`,
        theme_color_in_head: false,
        lang: language,
        display: `standalone`,
        icon: 'src/images/favicon-32x32.png',
        icons: [
          {
            src: `src/images/android-chrome-192x192.png`,
            sizes: `192x192`,
            type: `image/png`,
          },
          {
            src: `src/images/android-chrome-512x512.png`,
            sizes: `512x512`,
            type: `image/png`,
          },
        ],
        legacy: false,
        cache_busting_mode: 'query',
        crossOrigin: `use-credentials`,
      },
    },

    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.ts`,
      },
    },

    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/`,
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
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { frontmatter: { date: DESC } }, limit: 10
                ) {
                  edges {
                    node {
                      excerpt(truncate: true, format: PLAIN)
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
}

if (process.env.NODE_ENV === 'development') {
  gatsbyConfig.plugins.push({
    resolve: `gatsby-source-filesystem`,
    options: {
      path: `${__dirname}/_drafts`,
      name: 'markdown-pages',
      ignore: [`**/.*`], // ignore files starting with a dot
    },
  })
}

if (process.env.NODE_ENV === 'production') {
  gatsbyConfig.plugins.push(`gatsby-plugin-pnpm`)
}

module.exports = gatsbyConfig
