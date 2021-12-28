import * as React from 'react'
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome'
import {
  faUserCircle,
  faAt,
  faMapMarkerAlt,
  faBuilding,
  faLink,
  faAddressCard,
  faRss,
} from '@fortawesome/free-solid-svg-icons'
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faGithub,
  faKaggle,
  faMedium,
  faSlideshare,
} from '@fortawesome/free-brands-svg-icons'

import './bio.scss'
import config from '../../../config'

const Bio = () => {
  const {
    comment,
    name,
    company,
    location,
    email,
    website,
    linkedin,
    facebook,
    instagram,
    github,
    kaggle,
    medium,
    sildeshare,
  } = config

  return (
    <div className="bio">
      {!comment ? null : <span className="comment">{comment}</span>}

      {!name ? null : (
        <div className="bio-item name">
          <div className="icon-wrap">
            <Fa icon={faUserCircle} />
          </div>
          <a href="/about">
            <span>{name}</span>
          </a>
        </div>
      )}

      {!company ? null : (
        <div className="bio-item company">
          <div className="icon-wrap">
            <Fa icon={faBuilding} />
          </div>
          <span>{company}</span>
        </div>
      )}

      {!location ? null : (
        <div className="bio-item location">
          <div className="icon-wrap">
            <Fa icon={faMapMarkerAlt} />
          </div>
          <span>{location}</span>
        </div>
      )}

      {!email ? null : (
        <div className="bio-item email">
          <div className="icon-wrap">
            <Fa icon={faAt} />
          </div>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      )}

      {!website ? null : (
        <div className="bio-item website">
          <div className="icon-wrap">
            <Fa icon={faLink} />
          </div>

          <a href={website} target="_blank" rel="noopener noreferrer">
            {website}
          </a>
        </div>
      )}

      <div className="bio-item about">
        <div className="icon-wrap">
          <Fa icon={faAddressCard} />
        </div>

        <a href="/about">
          <span>About ME</span>
        </a>
      </div>

      <div className="social">
        <a href={`${config.siteUrl}/rss`} target="_blank" rel="noopener noreferrer">
          <Fa icon={faRss} className="rss" />
        </a>

        {!linkedin ? null : (
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            <Fa icon={faLinkedin} className="linkedin" />
          </a>
        )}
        {!facebook ? null : (
          <a href={facebook} target="_blank" rel="noopener noreferrer">
            <Fa icon={faFacebook} className="facebook" />
          </a>
        )}
        {!instagram ? null : (
          <a href={instagram} target="_blank" rel="noopener noreferrer">
            <Fa icon={faInstagram} className="instagram" />
          </a>
        )}
        {!github ? null : (
          <a href={github} target="_blank" rel="noopener noreferrer">
            <Fa icon={faGithub} className="github" />
          </a>
        )}
        {!kaggle ? null : (
          <a href={kaggle} target="_blank" rel="noopener noreferrer">
            <Fa icon={faKaggle} className="kaggle" />
          </a>
        )}
        {!medium ? null : (
          <a href={medium} target="_blank" rel="noopener noreferrer">
            <Fa icon={faMedium} className="medium" />
          </a>
        )}
        {!sildeshare ? null : (
          <a href={sildeshare} target="_blank" rel="noopener noreferrer">
            <Fa icon={faSlideshare} className="sildeshare" />
          </a>
        )}
      </div>
    </div>
  )
}

export default Bio
