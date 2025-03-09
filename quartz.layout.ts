import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/hanxiaomax/Learncpp_CN",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Explorer({
      title: "Chapters", // title of the explorer component
      folderClickBehavior: "collapse", // what happens when you click a folder ("link" to navigate to folder page on click or "collapse" to collapse folder on click)
      folderDefaultState: "collapsed", // default state of folders ("collapsed" or "open")
      useSavedState: true, // whether to use local storage to save "state" (which folders are opened) of explorer
      order: ["filter", "map", "sort"],
      sortFn: (a, b) => {
        const naturalCompare = (a: string, b: string) => {
          const splitA = a.split(/(\d+)/).filter(Boolean)
          const splitB = b.split(/(\d+)/).filter(Boolean)

          for (let i = 0; i < Math.min(splitA.length, splitB.length); i++) {
            const numA = parseInt(splitA[i], 10)
            const numB = parseInt(splitB[i], 10)

            if (!isNaN(numA) && !isNaN(numB)) {
              if (numA !== numB) return numA - numB
            } else {
              const compare = splitA[i].localeCompare(splitB[i])
              if (compare !== 0) return compare
            }
          }

          return splitA.length - splitB.length
        }

        if ((!a.file && !b.file) || (a.file && b.file)) {
          // return a.displayName.localeCompare(b.displayName)
          const f1Title = a.name.toLowerCase() ?? ""
          const f2Title = b.name.toLowerCase() ?? ""
          return naturalCompare(f1Title, f2Title)
        }
        if (a.file && !b.file) {
          return -1
        } else {
          return 1
        }
      },
    }),
  ],
  right: [Component.DesktopOnly(Component.TableOfContents()), Component.Backlinks()],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Explorer(),
  ],
  right: [],
}
