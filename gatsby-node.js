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

exports.onCreateNode = async ({ node, actions, getNode }) => {
  if (node.internal.type === `MarkdownRemark`) {
    const slug = createFilePath({ node, getNode, basePath: `pages` })

    const rewriteSlug = slug => {
      // 폴더 경로에 따라 url에 표시되는 것을 폴더 경로를 제거하고 파일명으로만 url을 지정되도록 하기 위함
      if (slug.match(/\//g).length > 2) {
        let tempStr = slug.split('/')
        slug = `/${tempStr[tempStr.length - 2]}/`
      }

      // jekyll 기준으로 파일명에 날짜를 포함시키던 것을 url에서 제거하기 위함
      const dayRegExp = /\/(18|19|20|21)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])-/
      if (slug.match(dayRegExp)) {
        slug = '/' + slug.replace(dayRegExp, '')
      }

      return slug
    }

    const rewriteNode = node => {
      if (node.frontmatter.title.includes(`"`)) {
        console.log('')
        console.warn(`
          It is not recommended to include " in the title.
          - file: ${node.fileAbsolutePath}
          - title: ${node.frontmatter.title}
        `)
      }

      // 마크다운 파일 내 keywords 필드가 비어있을 시 오류가 나지 않도록 하기 위함
      if (!node.frontmatter.keywords) {
        node.frontmatter.keywords = [config.title, config.author]
      }

      // 마크다운 파일 내 태그 필드가 비어있을 시 오류가 나지 않도록 하기 위함
      if (!node.frontmatter.tags || node.frontmatter.tags === '') {
        node.frontmatter.tags = ['undefined']
      }

      // 태그 필드가 배열이 아닌 문자열 하나일때 배열로 덮음
      else if (typeof node.frontmatter.tags === 'string') {
        node.frontmatter.tags = [node.frontmatter.tags]
      }

      // markdown 내 date의 timezone 제거
      if (node.frontmatter.date.includes('+')) {
        node.frontmatter.date = new Date(node.frontmatter.date.split('+')[0])
      } else {
        node.frontmatter.date = new Date(node.frontmatter.date)
      }

      if (!node.frontmatter.update) {
        node.frontmatter.update = '0001-01-01T00:00:00.000Z'
      }

      return node
    }

    const newSlug = rewriteSlug(slug)
    const newNode = rewriteNode(node)

    actions.createNodeField({
      name: `slug`,
      node: newNode,
      value: newSlug,
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
