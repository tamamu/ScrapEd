import styled from "styled-components";
import { Scrap } from "./Scrap";
import { ScrapP } from "../atoms/ScrapP";
import { ScrapPre } from "../atoms/ScrapPre";

export const ScrapText = (props) => {
    const { isPreformatted, src, query, comment, matchQuery } = props
    return (
      matchQuery(src, query) || matchQuery(comment, query) ?
      <Scrap {...props}>
        {isPreformatted ? <ScrapPre>{src}</ScrapPre> : <ScrapP>{src}</ScrapP>}
      </Scrap>
      : null
    )
}