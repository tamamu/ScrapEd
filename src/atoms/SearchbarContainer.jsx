import styled from "styled-components"

export const SearchbarContainer = styled.div`
position: fixed;
z-index: 9999999;
right: 0;
top: 0;
width: 30vw;
height: 2em;
display: flex;
background: gray;
visibility: ${props => props.isEnabled ? 'visible' : 'hidden'};
`


const SearchbarClose = styled.div`
align-items: end;
margin: auto 8px;
::after{
    font-size: 100%;
    content: "×";
    cursor: pointer;
  }
`