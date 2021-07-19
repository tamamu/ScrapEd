import styled from "styled-components"

export const ScrapP = styled.p`
  margin: 0;
  padding: 0;
  word-break: break-all;
  overflow-wrap: hyphens;
  transition: all 1s;
  &:first-letter {
    font-weight: bold;
    font-size: 40px;
    font-size: 4rem;
    line-height: 40px;
    line-height: 4rem;
    height: 4rem;
    text-transform: uppercase;
    transition: all 1s;
  }
`