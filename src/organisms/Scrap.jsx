import React, { useEffect } from "react"
import { ScrapCard } from "../atoms/ScrapCard"
import { ScrapContainer } from "../atoms/ScrapContainer"
import { ScrapContent } from "../atoms/ScrapContent"
import { ScrapClose } from "../atoms/ScrapClose"
import { ScrapComment, ScrapCommentFold, ScrapEditableComment } from "../atoms/ScrapComment"
import { useResize } from "../effects"

export const Scrap = (props) => {
    const { children, showComment, isFocused, comment, onChangeComment, matchQuery } = props
    const [contentHeight, setContentHeight] = React.useState(200)
    const child = React.cloneElement(React.Children.only(children), { matchQuery })
    const ref = React.useRef()
    
    useEffect(() => {
      console.log(ref.current.clientHeight)
      setContentHeight(ref.current.clientHeight)
    }, [isFocused])
  
    useResize(() => {
      setContentHeight(ref.current.clientHeight)
    })
  
    return (
      <ScrapCard>
        <ScrapContainer contentHeight={contentHeight} isFocused={isFocused} className={isFocused ? "is-expand" : null}>
          <ScrapContent ref={ref}>{child}</ScrapContent>
          {/*showComment
            ? (isFocused ? <ScrapCommentFold><ScrapEditableComment value={comment} onChange={onChangeComment}></ScrapEditableComment></ScrapCommentFold>
                           : <ScrapComment>{comment}</ScrapComment>)
            : null*/}
        </ScrapContainer >
        <ScrapClose onClick={props.onRemove}></ScrapClose>
      </ScrapCard>
    )
  }
  