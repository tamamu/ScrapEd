import './App.css';

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useInterval } from './effects';
import { ScrapList } from './molecules/ScrapList';
import { Searchbar } from './organisms/Searchbar';
import { ScrapImage } from './organisms/ScrapImage';
import { ScrapText } from './organisms/ScrapText';
import { ScrapHTML } from './organisms/ScrapHTML';

const matchQuery = (src, query, caseSensitive = false) => {
  const src_ = caseSensitive ? src : src.toLowerCase()
  const query_ = caseSensitive ? query : query.toLowerCase()
  return query_.length === 0 || (query_.length > 0 && src_.includes(query_))
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

  const scrapToElement = ({scrap, showComment, isFocused, matchQuery}, idx) => {
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
            isFocused={isFocused}
            onChangeComment={onChangeComment}
            onRemove={onRemove}
            matchQuery={matchQuery}
            />
        )
      case 'text':
        return (
          <ScrapText
            src={data}
            query={searchQuery}
            comment={comment}
            showComment={showComment}
            isFocused={isFocused}
            onChangeComment={onChangeComment}
            onRemove={onRemove}
            matchQuery={matchQuery}
            />
        )
      case 'html':
        return (
          <ScrapHTML
            src={data}
            query={searchQuery}
            comment={comment}
            showComment={showComment}
            isFocused={isFocused}
            onChangeComment={onChangeComment}
            onRemove={onRemove}
            matchQuery={matchQuery}
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
      <ScrapList empty={Description}
                 scrapList={scrapList}
                 scrapToElement={scrapToElement}
                 focusedScrap={focusedScrap}
                 setFocusedScrap={setFocusedScrap}
                 matchQuery={matchQuery} />
    </div>
  );
}

export default App;
