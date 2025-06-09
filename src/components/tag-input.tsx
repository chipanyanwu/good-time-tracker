"use client"

import React, { useState, useEffect, useCallback } from "react"
import { ReactTags, TagSuggestion, TagSelected } from "react-tag-autocomplete"
import type { Tag } from "@/types/entry"
import { TagType } from "@/types/entry"

interface TagInputProps {
  /** currently selected tags */
  selected: Tag[]
  /** all user's tags (for autocomplete) */
  suggestions: Tag[]
  /** called when the user adds a tag */
  onAddAction: (tag: Tag) => void
  /** called when the user removes a tag */
  onRemoveAction: (tag: Tag) => void
}

export function TagInput({
  selected,
  suggestions,
  onAddAction,
  onRemoveAction,
}: TagInputProps) {
  // react-tag-autocomplete wants two arrays:
  //  - selected: TagSelected[]{ value,label }
  //  - suggestions: TagSuggestion[]{ value,label }

  const [selectedTags, setSelectedTags] = useState<TagSelected[]>([])
  const [suggestedTags, setSuggestedTags] = useState<TagSuggestion[]>([])

  // keep the internal ReactTags state in sync with props.selected
  useEffect(() => {
    setSelectedTags(
      selected.map((t) => ({
        value: t.name,
        label: t.name,
      }))
    )
  }, [selected])

  // same for suggestions
  useEffect(() => {
    setSuggestedTags(
      suggestions.map((t) => ({
        value: t.name,
        label: t.name,
      }))
    )
  }, [suggestions])

  // when the user picks or creates a tag:
  const handleAdd = useCallback(
    (tag: TagSuggestion) => {
      // look up its type if it already existed
      const existing = suggestions.find((t) => t.name === tag.value)
      const newTag: Tag = existing ? existing : { name: String(tag.value) }
      onAddAction(newTag)
    },
    [onAddAction, suggestions]
  )

  // when the user deletes via backspace or click:
  const handleDelete = useCallback(
    (i: number) => {
      const name = selectedTags[i].value
      const tag = selected.find((t) => t.name === name)
      if (tag) onRemoveAction(tag)
    },
    [onRemoveAction, selected, selectedTags]
  )

  return (
    <ReactTags
      // current tags
      selected={selectedTags}
      // autocomplete list
      suggestions={suggestedTags}
      // allow Enter (default), comma, etc.
      delimiterKeys={["Enter"]}
      // let users type brand-new tags
      allowNew
      // backspace deletes last tag if input empty
      allowBackspace
      onAdd={handleAdd}
      onDelete={handleDelete}
      placeholderText="Add a tag..."
      noOptionsText="No matching tags"
      classNames={{
        root: "react-tags",
        rootIsActive: "is-active",
        rootIsDisabled: "is-disabled",
        rootIsInvalid: "is-invalid",
        label: "react-tags__label",
        tagList: "react-tags__list",
        tagListItem: "react-tags__list-item",
        tag: "react-tags__tag",
        tagName: "react-tags__tag-name",
        comboBox: "react-tags__combobox",
        input: "react-tags__combobox-input",
        listBox: "react-tags__listbox",
        option: "react-tags__listbox-option",
        optionIsActive: "is-active",
        highlight: "react-tags__listbox-option-highlight",
      }}
    />
  )
}
