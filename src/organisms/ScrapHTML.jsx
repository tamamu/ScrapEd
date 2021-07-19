import styled from "styled-components";
import { Scrap } from "./Scrap";

const textOfHTML = html => {
    const elem = document.createElement('div')
    elem.innerHTML = html
    return elem.innerText
}  

export const ScrapHTML = (props) => {
    const { src, query, comment, matchQuery } = props
    return (
      matchQuery(textOfHTML(src), query) || matchQuery(comment, query) ?
      <Scrap {...props}>
        <div dangerouslySetInnerHTML={{__html: props.src}}></div>
      </Scrap>
      : null
    )
  }