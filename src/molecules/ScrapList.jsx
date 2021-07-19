import styled from "styled-components"

const ScrapListContainer = styled.ul`
list-style: none;
margin: 32px;
padding: 0;
`

const ScrapItem = styled.li`
  margin: 2px 0;
`

export const ScrapList = ({empty, scrapList, scrapToElement, focusedScrap, setFocusedScrap, matchQuery}) => (
    <ScrapListContainer>
        {scrapList.length === 0 ? empty :
        scrapList.map((scrap, idx) => (
         <ScrapItem
           key={idx}
           onClick={ev => {
             ev.stopPropagation()
             setFocusedScrap(idx)
            }}
           >
           {scrapToElement({
             scrap,
             showComment: scrap.comment !== '' || focusedScrap === idx,
             isFocused: focusedScrap === idx,
             matchQuery
             }, idx)}
         </ScrapItem>)
        )}
      </ScrapListContainer>
)