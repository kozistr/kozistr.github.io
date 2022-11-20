import Giscus from '@giscus/react'
import React from 'react'

import config from '../../../config'

const Comment = () => {
  return (
    <Giscus
      id="comments"
      repo="kozistr/kozistr.github.io"
      repoId={config.repoId}
      category={config.category}
      categoryId={config.categoryId}
      mapping="url"
      term="Welcome to giscus!"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="preferred_color_scheme"
      lang="en"
      loading="lazy"
    />
  )
}

export default Comment
