import React, {useEffect, useRef} from 'react'
import { SearchbarContainer } from '../atoms/SearchbarContainer'
import { SearchbarInput } from '../atoms/SearchbarInput'
import { SearchbarClose } from '../atoms/SearchbarClose'

export const Searchbar = (props) => {
    const { isEnabled, query, onChange, onClose, inputRef } = props
    const input = useRef(null)
  
    useEffect(() => {
      inputRef.current = input.current
    }, [inputRef])
  
    useEffect(() => {
      input.current.focus()
    }, [isEnabled])
  
    return (
      <SearchbarContainer isEnabled={isEnabled}>
        <SearchbarInput value={query} onChange={onChange} ref={input} />
        <SearchbarClose onClick={onClose} />
      </SearchbarContainer>
    )
  }