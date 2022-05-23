#topic-tag

🔔 Description::

[[词汇表]]

## Notes for {{title}}

```dataviewjs

dv.table(["Title","Topics","Status","type"],dv.current().file.inlinks
.map(b=>{
    var page = dv.page(b)
    return [page.file.link,page.tags,page.Status,"#"+page.tag]
})
)

```
