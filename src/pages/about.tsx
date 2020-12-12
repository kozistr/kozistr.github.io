/* eslint-disable @typescript-eslint/no-explicit-any */

import * as React from 'react';
import {graphql, Link} from 'gatsby';

import Layout from '../components/Layout';
import SEO from '../components/seo';
import Bio from '../components/Bio';
import './styles/index.scss';

const AboutPage = () => {
  return (
    <Layout>
      <SEO title="About" />
      <div className="index-wrap">
        <Bio />
        <div className="index-post-list-wrap">
          <Link to="/about" />
        </div>
      </div>
    </Layout>
  );
};

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 100) {
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
        }
      }
    }
  }
`;

export default AboutPage;
