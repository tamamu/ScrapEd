import styled, { keyframes } from "styled-components"

const OpenAnimation = keyframes`
  from {height: 0;}
  to {height: 5em;}
`

export const ScrapComment = styled.pre`
`

export const ScrapCommentFold = styled.div`
  animation-name: ${OpenAnimation};
  animation-duration: .5s;
  animation-fill-mode: forwards;
  display: flex;
  overflow: hidden;
`

export const ScrapEditableComment = styled.textarea`
  background: #444343;
  color: #c8cccc;
  flex: 1;
  margin: 16px 0;
  font-size: 16px;
`