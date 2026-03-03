import type { TocItem } from '#/types/epub'

interface TableOfContentsProps {
  items: TocItem[]
  onSelect: (href: string) => void
}

export function TableOfContents({ items, onSelect }: TableOfContentsProps) {
  if (items.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        No table of contents available
      </div>
    )
  }

  return (
    <div className="p-2">
      <h3 className="font-semibold text-gray-800 p-2 border-b">Table of Contents</h3>
      <ul className="mt-2">
        {items.map((item, index) => (
          <li key={index}>
            <button
              onClick={() => onSelect(item.href)}
              className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm truncate"
              title={item.label}
            >
              {item.label}
            </button>
            {item.subitems && item.subitems.length > 0 && (
              <ul className="ml-4">
                {item.subitems.map((subitem, subIndex) => (
                  <li key={subIndex}>
                    <button
                      onClick={() => onSelect(subitem.href)}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded text-sm text-gray-600 truncate"
                      title={subitem.label}
                    >
                      {subitem.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
