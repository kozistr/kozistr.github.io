import { DiscussionEmbed } from 'disqus-react'
import * as React from 'react'

import config from '../../../config'

interface CommentProps {
  slug: string
  title: string
}

const Comment = ({ slug, title }: CommentProps) => {
  const disqusConfig = {
    shortname: config.disqusShortname,
    config: {
      url: `${config.siteUrl + slug}`,
      identifier: slug,
      title,
    },
  }

  return (
    <div className="comments">
      <DiscussionEmbed {...disqusConfig} />
    </div>
  )
}

export default Comment
