#glossary

## 按值传递(pass by value)



## 相关文章

```dataviewjs

dv.table(["Title"],dv.current().file.inlinks
.map(b=>{
    var page = dv.page(b)
    return [page.file.link]
})
)

```
