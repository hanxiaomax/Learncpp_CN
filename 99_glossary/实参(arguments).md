#glossary


## 定义



## 相关文章

```dataviewjs

dv.table(["Title"],dv.current().file.inlinks
.map(b=>{
    var page = dv.page(b)
    return [page.file.link]
})
)

```

