import styled from "styled-components"

export const ScrapCard = styled.div`
text-align: left;
display: flex;
justify-content: center;
font-size: 16px;
box-shadow: 0 1px 2px 0 rgba(0,0,0,.15);
border: 1px solid #fff;
padding: 8px;
transition: all .1s ease-in-out;
background: #fff;

&:hover {
  box-shadow: 0 10px 20px rgba(0,0,0,.19), 0 6px 6px rgba(0,0,0,.23);
}
`
