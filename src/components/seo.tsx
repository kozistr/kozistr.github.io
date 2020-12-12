import * as React from 'react';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import THUMBNAIL_DEFAULT_IMAGE from '../images/thumbnail.jpg';

export interface SEOPropsType {
  description: string;
  lang: string;
  meta: any[];
  title: string;
  keywords: string[];
  thumbnail?: string;
}

function SEO({
  description,
  lang,
  meta,
  title,
  keywords = ['김도진', '기술블로그', '천재개발자', '백엔드', '프론트엔드', 'GoLang'],
  thumbnail = THUMBNAIL_DEFAULT_IMAGE,
}: SEOPropsType) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  );

  const metaDescription = description ?? site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={title === 'Home' ? site.siteMetadata.title : `%s | ${site.siteMetadata.title}`}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: 'og:image',
          content: thumbnail,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata.author,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `keywords`,
          content: keywords,
        },
      ].concat(meta)}
    />
  );
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  keywords: [],
};

export default SEO;
