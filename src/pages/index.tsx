/* eslint-disable @typescript-eslint/no-explicit-any */

import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import { Link, graphql } from 'gatsby'
import * as React from 'react'

import './styles/index.scss'
import Bio from '../components/Bio'
import Layout from '../components/Layout'
import PostList from '../components/PostList'
import SEO from '../components/seo'

interface IndexPageProps {
  path: string
  data: any
}

const IndexPage = (props: IndexPageProps) => {
  const { data } = props
  const posts = data.allMarkdownRemark.edges
  const title = data.site.siteMetadata.title

  return (
    <Layout>
      <SEO title={title} />
      <div className="index-wrap">
        <Bio />
        <div className="index-post-list-wrap">
          <PostList posts={posts} />
          {posts.length < 10 ? null : (
            <div className="show-more-posts">
              <div className="show-more-btn">
                <Link to="/search">
                  <Fa icon={faSearch} />
                  <span>SHOW MORE POSTS</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }, limit: 50) {
      edges {
        node {
          excerpt(truncate: true, format: PLAIN)
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMM DD, YYYY")
            update(formatString: "MMM DD, YYYY")
            title
            tags
          }
          timeToRead
        }
      }
    }
  }
`

export default IndexPage
