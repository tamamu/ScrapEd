import styled from "styled-components"
import { Scrap } from "./Scrap"

export const ScrapImage = (props) => {
    const { src, query, comment, matchQuery } = props
    return (
      query.length === 0 || matchQuery(comment, query) ?
      <Scrap {...props}>
        <img src={src} alt={'scraped'} height={100} />
      </Scrap>
      : null
    )
  }