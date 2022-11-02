---
title: typeid 运算符
alias: typeid 运算符
english: typeid
type: glossary
tags:
- 词汇表
- typeid
---

在g++上，输出的结果为[修饰名](https://en.wikipedia.org/wiki/Name_mangling)，可以使用
```bash
a.out | c++filt --types
```
得到可读的结果。[参考](https://stackoverflow.com/questions/4465872/why-does-typeid-name-return-weird-characters-using-gcc-and-how-to-make-it-prin)