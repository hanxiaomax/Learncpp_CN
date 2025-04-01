---
title: 20.x - 小结与测试 - 函数
alias: 20.x - 小结与测试 - 函数
origin: /chapter-12-comprehensive-quiz/
origin_title: "12.x — Chapter 12 comprehensive quiz"
time: 2022-4-8
type: translation
tags:
- summary
---



函数的[[arguments|实参]]可以通过传值、传引用或者传地址的方式来传递。
- 在传递基本数据类型和枚举量时使用[[pass-by-value|按值传递]]；
- 在传递结构体、类或者需要函数进行修改的实参时，使用[[pass-by-reference|按引用传递]]；
- 在传递指针或内置数组时使用[[pass-by-address|按地址传递]] 。
如果可以，尽量在传递引用和地址时使用`const`。

值可以通过按值返回、按引用返回或按地址返回。大多数情况下，按值返回是可以的，不过有时候[[return-by-reference|按引用返回]]和[[return-by-address|按地址返回]]也很有用，特别是在处理动态分配的数据、结构体或类时。在使用按引用返回或按地址返回时，记得要确保返回的内容不会[[going-out-of-scope|离开作用域]]。

[[20-1-function-pointers|12.1 - 函数指针]]

- 函数指针允许我们将一个函数传递给另一个函数。这有助于调用者自定义函数的行为，例如列表的排序算法。

[[20-2-the-stack-and-the-heap|12.2 - 栈和堆]]

- 动态内存将在堆上进行分配。

[[16-10-std-vector-capacity-and-stack-behavior|12.3 - std::vector的容量和类栈行为]]

- 函数调用时会在调用栈中堆栈跟踪从程序开始到当前执行点的所有活动函数(那些已被调用但尚未终止的函数)。局部变量会在栈上分配，但是栈的空间是有限的。`std::vector` 可以用来模拟栈的行为。

[[20-3-recursion|12.4 - 递归]]

- 自己调用自己的函数，称为递归函数。所有的递归函数都必须有终止条件。

[[20-4-command-line-arguments|12.5 - 命令行参数]]

- 命令行参数允许用户或其他程序在程序启动时为其传入数据。命令行参数在任何情况下都是C语言风格的字符串，如果期望传递的是数值，则要自行转换。

[[20-5-Ellipsis-and-why-to-avoid-them|12.6 - 省略号以及为什么要避免使用它]]

- 省略号用于传递不定长参数。但是这种情况下不会进行类型检查，也不知道传递了多少参数。程序必须自行追踪相关细节。

[[20-6-introduction-to-lambdas-anonymous-functions|12.7 - lambda表达式简介]]

- Lambda 函数是那些可以嵌入在其他函数中的函数。它们不需要函数名，而且可以在和 algorithms 库结合使用时非常有用。