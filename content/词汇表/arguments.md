---
title: 实参
alias: 实参
english: arguments
type: glossary
tags:
- 词汇表
- arguments
---

调用函数时使用的参数。

实参可以通过几种方式向[[parameters|形参]]传递：
1. [[pass-by-value|按值传递]]时，形参得到一份实参的拷贝
2. [[pass-by-reference|按引用传递]]时，形参（声明为引用类型）被绑定到实参，从而可以修改实参
3. [[pass-by-address|按地址传递]]是，形参（声明为指针类型）获得形参持有地址的拷贝，和实参指向同一个地址，可以修改该地址存放的值。但是地址本身是实参的拷贝，所以修改形参的值（地址）不会影响到实参，实参仍然持有原地址。