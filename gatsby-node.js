const path = require(`path`)
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { createFilePath } = require('gatsby-source-filesystem')
const TerserPlugin = require('terser-webpack-plugin')

const config = require('./config')

exports.createPages = async ({ actions, graphql, reporter }) => {
  const blogPostTemplate = path.resolve(`src/templates/Post.tsx`)
  const result = await graphql(`
    {
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 1000) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              tags
              update(formatString: "YYYY-MM-DD")
              date(formatString: "YYYY-MM-DD")
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }

  const getSeries = slug => {
    const parts = slug.split('_')
    if (parts.length < 3) {
      const seriesNum = parts[parts.length - 1].replace('/', '')
      return !isNaN(seriesNum) ? parseInt(seriesNum, 10) : 0
    }
    return 0
  }

  const { edges } = result.data.allMarkdownRemark

  await Promise.all(
    edges.map(async ({ node }) => {
      const { fields, frontmatter } = node
      const { slug } = fields
      const { date, update } = frontmatter

      let filteredEdges = []
      const series = []

      if (getSeries(slug)) {
        filteredEdges = edges.filter(e => {
          const fSlug = e.node.fields.slug
          const splitedFSlug = fSlug.split('_')
          if (splitedFSlug.length >= 3) return false

          if (slug.split('_').length > 1 && slug.split('_')[0] === splitedFSlug[0]) {
            return true
          }
        })

        if (filteredEdges.length) {
          for (const e of filteredEdges) {
            const seriesNum = getSeries(e.node.fields.slug)

            if (seriesNum) {
              series.push({
                slug: e.node.fields.slug,
                title: e.node.frontmatter.title,
                num: seriesNum,
              })
            }
          }

          series.sort((a, b) => a.num - b.num)
        }
      }

      actions.createPage({
        path: slug,
        component: blogPostTemplate,
        context: { slug, series, lastmod: update.includes('0001') ? date : update },
      })
    })
  )
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })

    const rewriteSlug = slug => {
      if (slug.match(/\//g).length > 2) {
        return `/${slug.split('/').slice(-2, -1)[0]}/`
      }

      return slug.replace(/\/(18|19|20|21)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])-/, '/')
    }

    const fm = node.frontmatter

    if (fm.title.includes(`"`)) {
      console.log('')
      console.warn(`
        It is not recommended to include " in the title.
        - file: ${node.fileAbsolutePath}
        - title: ${fm.title}
      `)
    }

    if (!fm.keywords) {
      fm.keywords = [config.title, config.author]
    }

    if (!fm.tags) {
      fm.tags = ['undefined']
    } else if (typeof fm.tags === 'string') {
      fm.tags = [fm.tags]
    }

    if (fm.date.includes('+')) {
      fm.date = new Date(fm.date.split('+')[0])
    } else {
      fm.date = new Date(fm.date)
    }

    if (!fm.update) {
      fm.update = '0001-01-01T00:00:00.000Z'
    }

    actions.createNodeField({
      name: `slug`,
      node: node,
      value: rewriteSlug(slug),
    })
  }
}

exports.onCreateWebpackConfig = ({ stage, actions, getConfig }) => {
  const config = getConfig()

  if (config.mode === 'production') {
    actions.setWebpackConfig({ devtool: false })
  }

  if (stage === 'build-javascript') {
    config.optimization.minimizer = [
      ...config.optimization.minimizer,
      new CssMinimizerPlugin(),
      new TerserPlugin({
        test: /\.(js|jsx|ts|tsx)$/,
        parallel: true,
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            warnings: false,
            drop_console: true,
          },
          extractComments: false,
        },
      }),
    ]

    actions.replaceWebpackConfig(config)
  }
}
