import React from 'react'

import './toc.scss'

interface TocProps {
  toc: string
  isOutside: boolean
}

const Toc: React.FC<TocProps> = ({ toc, isOutside }) => (
  <div className={`toc ${isOutside ? 'outside' : 'inside'}`} dangerouslySetInnerHTML={{ __html: toc }} />
)

export default Toc
