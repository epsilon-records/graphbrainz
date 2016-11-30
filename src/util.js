import util from 'util'

export function getFields (info, fragments = info.fragments) {
  if (info.kind !== 'Field') {
    info = info.fieldNodes[0]
  }
  const selections = info.selectionSet.selections
  const reducer = (fields, selection) => {
    if (selection.kind === 'FragmentSpread') {
      const name = selection.name.value
      const fragment = fragments[name]
      if (!fragment) {
        throw new Error(`Fragment '${name}' was not passed to getFields()`)
      }
      fragment.selectionSet.selections.reduce(reducer, fields)
    } else {
      fields[selection.name.value] = selection
    }
    return fields
  }
  return selections.reduce(reducer, {})
}

export function prettyPrint (obj, { depth = 5,
                                    colors = true,
                                    breakLength = 120 } = {}) {
  console.log(util.inspect(obj, { depth, colors, breakLength }))
}

export function toFilteredArray (obj) {
  return (Array.isArray(obj) ? obj : [obj]).filter(x => x)
}

export function extendIncludes (includes, moreIncludes) {
  includes = toFilteredArray(includes)
  moreIncludes = toFilteredArray(moreIncludes)
  const seen = {}
  return includes.concat(moreIncludes).filter(x => {
    if (seen[x]) {
      return false
    }
    seen[x] = true
    return true
  })
}
