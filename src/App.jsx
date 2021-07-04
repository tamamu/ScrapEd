import './App.css';

import React, { useEffect, useState, useRef, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'

function useInterval(callback, delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}



const ScrapLine = styled.div`
  text-align: left;
  display: flex;
  justify-content: center;
  font-size: 16px;
  
  border: 1px solid gray;
  padding: 8px;
  height: 100%;
`
  
const ScrapContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: scroll;
  flex: 1;
`

const ScrapContent = styled.div`
  min-height: 2em;
`

const ScrapComment = styled.pre`
`

const OpenAnimation = keyframes`
  from {height: 0;}
  to {height: 5em;}
`

const ScrapCommentFold = styled.div`
  animation-name: ${OpenAnimation};
  animation-duration: .5s;
  animation-fill-mode: forwards;
  display: flex;
  overflow: hidden;
`

const ScrapEditableComment = styled.textarea`
  background: #444343;
  color: #c8cccc;
  flex: 1;
  margin: 16px 0;
  font-size: 16px;
`

const ScrapClose = styled.div`
align-items: end;
margin: auto 8px;
::after{
    font-size: 200%;
    content: "×";
    cursor: pointer;
  }
`


const Scrap = (props) => {
  const { showComment, editComment, comment, onChangeComment } = props
  return (
    <ScrapLine>
      <ScrapContainer>
        <ScrapContent>{props.children}</ScrapContent>
        {showComment
          ? (editComment ? <ScrapCommentFold><ScrapEditableComment value={comment} onChange={onChangeComment}></ScrapEditableComment></ScrapCommentFold>
                         : <ScrapComment>{comment}</ScrapComment>)
          : null}
      </ScrapContainer >
      <ScrapClose onClick={props.onRemove}></ScrapClose>
    </ScrapLine>
  )
}

const ScrapP = styled.p`
  margin: 0;
  padding: 0;
`

const ScrapPre = styled.pre`
  margin: 0;
  padding: 0;
`

const matchQuery = (src, query, caseSensitive = false) => {
  const src_ = caseSensitive ? src : src.toLowerCase()
  const query_ = caseSensitive ? query : query.toLowerCase()
  return query_.length === 0 || (query_.length > 0 && src_.includes(query_))
}

const ScrapText = (props) => {
  const { isPreformatted, src, query, comment } = props
  return (
    matchQuery(src, query) || matchQuery(comment, query) ?
    <Scrap {...props}>
      {isPreformatted ? <ScrapPre>{src}</ScrapPre> : <ScrapP>{src}</ScrapP>}
    </Scrap>
    : null
  )
}

const ScrapImage = (props) => {
  const { src, query, comment } = props
  return (
    query.length === 0 || matchQuery(comment, query) ?
    <Scrap {...props}>
      <img src={src} alt={'scraped'} height={100} />
    </Scrap>
    : null
  )
}

const textOfHTML = html => {
  const elem = document.createElement('div')
  elem.innerHTML = html
  return elem.innerText
}

const ScrapHTML = (props) => {
  const { src, query, comment } = props
  return (
    matchQuery(textOfHTML(src), query) || matchQuery(comment, query) ?
    <Scrap {...props}>
      <div dangerouslySetInnerHTML={{__html: props.src}}></div>
    </Scrap>
    : null
  )
}

const ScrapList = styled.ul`
  list-style: none;
  margin: 32px;
  padding: 0;
`

const ScrapItem = styled.li`
  margin: 2px 0;
`

const SearchbarBox = styled.div`
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

const SearchbarInput = styled.input`
  height: 100%;
  border: none;
  background: darkgray;
  color: white;
  width: 100%;
  margin: 0;
  padding: 0;
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

const Searchbar = (props) => {
  const { isEnabled, query, onChange, onClose, inputRef } = props
  const input = useRef(null)

  useEffect(() => {
    inputRef.current = input.current
  }, [inputRef])

  useEffect(() => {
    input.current.focus()
  }, [isEnabled])

  return (
    <SearchbarBox isEnabled={isEnabled}>
      <SearchbarInput value={query} onChange={onChange} ref={input} />
      <SearchbarClose onClick={onClose} />
    </SearchbarBox>
  )
}

const Description = () => (
  <div>
    <p>Nothing yet! Copy text or an image you want to scrap.</p>
    <p>Scraps will be saved automatically on your home directory.</p>
  </div>
)

const migrateScrap = (src) => {
  let m = {...src}
  if (m.showComment === undefined) m.showComment = false
  if (m.comment === undefined) m.comment = ''
  return m
}

function App() {

  const isInitialized = useRef(false)
  const initTime = useRef(null)
  const searchBarInput = useRef(null)
  const [focusedScrap, setFocusedScrap] = useState()
  const [scrapList, setScrapList] = useState([])
  const [latestClipboardData, setLatestClipboardData] = useState()
  const [query, setQuery] = useState('')
  const [showSearchbar, setShowSearchbar] = useState(false)

  useEffect(() => {
    async function initialize() {
      const initializer = await window.scraped.init()
      initTime.current = initializer.date
      setScrapList(initializer.scrapList.map(migrateScrap))
      setLatestClipboardData(initializer.scrapList[initializer.scrapList.length-1])
      console.log('initialized')
    }
    initialize()
  }, [])

  const handleCtrlF = useCallback(ev => {
    console.log(ev)
    if (ev.ctrlKey && ev.key === 'f') {
      setShowSearchbar(true)
      if (searchBarInput.current) {
        searchBarInput.current.focus()
      }
    }
  }, [])
  const handleESC = useCallback(ev => {
    if (ev.code === 'Escape' && showSearchbar) {
      console.log('close')
      setShowSearchbar(false)
    }
  }, [showSearchbar])

  useEffect(() => {
    window.addEventListener('keypress', handleCtrlF, false)
    window.addEventListener('keydown', handleESC, false)
    return () => {
      window.removeEventListener('keypress', handleCtrlF, false)
      window.removeEventListener('keydown', handleESC, false)
    }
  }, [handleCtrlF, handleESC])

  const handleDocumentClick = useCallback(ev => {
    setFocusedScrap(null)
  }, [])

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => {
      document.removeEventListener('click', handleDocumentClick)
    }
  }, [handleDocumentClick])

  useInterval(async () => {
    if (initTime.current === null) {
      return
    }

    const cd = await window.scraped.fetchClipboard()
    if (cd && cd.date > initTime.current) {
      if (latestClipboardData === undefined || (latestClipboardData && JSON.stringify(cd.payload) !== JSON.stringify(latestClipboardData.payload))) {
        setLatestClipboardData(cd)
        const scrap = migrateScrap(cd)
        setScrapList([...scrapList, scrap])
        console.log(scrapList)
      }
    }
  }, 1000)

  useEffect(() => {
    if (isInitialized.current) {
      window.scraped.save(JSON.stringify(scrapList))
    }
    isInitialized.current = true
  }, [scrapList])

  const scrapToElement = ({scrap, showComment, editComment}, idx) => {
    const {dataType, data} = scrap.payload
    const comment = scrap.comment
    const onRemove = () => {
      setScrapList(
        scrapList.filter((_, i) => i !== idx)
        )
    }
    const onChangeComment = ev => {
      setScrapList(
        scrapList.map((s, i) => i === idx ? {...s, comment: ev.target.value} : s)
      )
    }
    const searchQuery = showSearchbar ? query : ''
    switch (dataType) {
      case 'image':
        return (
          <ScrapImage
            src={data}
            query={searchQuery}
            comment={comment}
            showComment={showComment}
            editComment={editComment}
            onChangeComment={onChangeComment}
            onRemove={onRemove}
            />
        )
      case 'text':
        return (
          <ScrapText
            src={data}
            query={searchQuery}
            comment={comment}
            showComment={showComment}
            editComment={editComment}
            onChangeComment={onChangeComment}
            onRemove={onRemove}
            />
        )
      case 'html':
        return (
          <ScrapHTML
            src={data}
            query={searchQuery}
            comment={comment}
            showComment={showComment}
            editComment={editComment}
            onChangeComment={onChangeComment}
            onRemove={onRemove}
            />
        )
      default:
        return null
    }
  }

  return (
    <div className="App">
      <Searchbar
        isEnabled={showSearchbar}
        query={query}
        onChange={ev => {
          setQuery(ev.target.value)
        }}
        onClose={ev => {
          setShowSearchbar(false)
        }}
        inputRef={searchBarInput}
        />
      <ScrapList>
        {scrapList.length === 0 ? <Description /> :
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
             editComment: focusedScrap === idx,
             }, idx)}
         </ScrapItem>)
        )}
      </ScrapList>
    </div>
  );
}

export default App;
