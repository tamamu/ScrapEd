import styled from "styled-components"

export const ScrapContainer = styled.div`
display: flex;
flex-direction: column;
flex: 1;
overflow: hidden;
position: relative;
min-height: 120px;
max-height: ${props => props.isFocused ? props.contentHeight : 120}px;
transform-origin: top left;
transition: max-height .5s ease-in-out;
&.is-expand {
  transition: max-height .5s ease-in-out;
}
&:after {
  content: '';
  position: absolute;
  top: 60px;
  width: 100%;
  height: 60px;
  background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
  transition: all .5s;
}
&.is-expand:after {
  top: 100%;
  transition: all .5s;
}
`