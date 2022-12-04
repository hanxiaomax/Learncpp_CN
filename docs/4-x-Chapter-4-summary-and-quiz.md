---
title: 4.x - 小结与测试 - 基本数据类型
alias: 4.x - 小结与测试 - 基本数据类型
origin: /chapter-4-summary-and-quiz/
origin_title: "4.x — Chapter 4 summary and quiz"
time: 2022-4-12
type: translation
tags:
- summary
---


## 章节回顾

[[4-1-Introduction-to-fundamental-data-types|4.1 - 基础数据类型简介]]

- 内存的最小单元称为[[bit|位]]。内存可寻找的最小单位是[[byte|字节]]，现代标准一个字节等于8个位。
- 一种**数据类型**告诉编译器如何将内存中的数据解析成有意义的值。
- C++ 支持多种基础数据类型，包括浮点数、整型、布尔类型、字符、null指针和 void。

[[4-2-Void|4.2 - Void]]

- **Void**用于表示无类型。其最主要的作用是表明函数无返回值。

[[4-3-Object-sizes-and-the-sizeof-operator|4.3 - 对象的大小和 sizeof 操作符]]

- 不同数据类型占据的内存大小也不同，同时也会收到机器体系结构的影响。参考 [[4-3-Object-sizes-and-the-sizeof-operator|4.3 - 对象的大小和 sizeof 操作符]] 中的表格了解每种基础数据类型占用的空间。
- `sizeof` 运算符可以返回某个类型所占用的字节数。

[[4-4-Signed-integers|4.4 - 有符号整型]]

- **有符号整型**用于保存正数和负数，也包括0。一个特定数据类型能够保存的值，称为该类型的范围。当使用整型时，一定要注意溢出和整型除0问题。

[[4-5-Unsigned-integers-and-why-to-avoid-them|4.5 - 无符号整型以及为什么要避免使用它]]

- **无符号整型**只能保存正整数，通常应该避免使用它，除非是用于位运算。

[[4-6-Fixed-width-integers-and-size_t|4.6 - 固定宽度整型和 size_t]]

- **固定宽度整型**是具有确定大小的整型，但是并不是所有的体系结构都支持。速度优先和大小优先的整型是保证某其具有某大小前提下的最快的或最小的整型。`std::int8_t` 和 `std::uint8_t` 一般不要使用，它们的行为更像字符而不是整型。
- **size_t** 是一种无符号整型，它用于表示对象的大小或长度。

[[4-7-Introduction-to-scientific-notation|4.7 - 科学计数法]]

- 科学计数法是一种表示大数的简单记法。C++ 支持科学计数法表示浮点数。科学计数法中，e前面的部分称为有效数字。

[[4-8-Floating-point-numbers|4.8 - 浮点数]]

- **浮点数**类型用于保存实数（包括哪些有小数部分的数）。数字的精度指的是在不丢失精度的前提下，可以表示多少个有效数字。[[rounding-error|舍入误差]]出现在过多的有效数字被存放在无法保存这么多有效数字的浮点数中。舍入误差一致存在，即使是像 0.1 这样简单的数。因此，你不能将浮点数进行直接比较。

[[4-9-Boolean-values|4.9 - 布尔值]]

- **布尔**类型用于存放 `true` 和 `false`。

[[4-10-Introduction-to-if-statements|4.10 - if 语句简介]]

- **If 语句** [[4-10-Introduction-to-if-statements|4.10 - if 语句简介]] 允许我们满足某种条件时才执行一条或多条语句。if 语句的条件表达式会被解析为布尔值。

[[4-11-Chars|4.11 - 字符]]

- **字符**存放的值会被解析为 ASCII 字母。当使用字符时，小心不要将 ASCII 码值和数字搞混。如果需要把字符当整型打印处理，需要使用 `static_cast`。

[[4-12-Introduction-to-type-conversion-and-static_cast|4.12 - 类型转换和 static_cast]]

- 尖括号在 C++ 中通常用来表示参数化类型。在 `static_cast` 中，尖括号的内容指定了目标类型。(例如 `static_cast<int>(x)`会把 `x` 转换为 `int`)。

[[4-13-Const-variables-and-symbolic-constants|4.13 - const 变量和符号常量]]  

- 常量指的是值不会改变的变量。C++ 支持两种常量：字面量常量和符号常量
- [[symbolic-constants|符号常量]]指的是给与常量的名字。常量是符号变量的一种，使用替换文本的类对象宏也是符号常量；


[[4-14-Compile-time-constants-constant-expressions-and-constexpr|4.14 - 编译时常量、常量表达式和 constexpr]]  

- [[constant expression|常量表达式]]是一个可以在编译时求值的表达式。编译时常量是其值在编译时已知的常量。运行时常量是在运行时之前不知道其初始化值的常量。constexprvariable必须是编译时常量。

[[4-15-Literals|4.15 - 字面量]]  

- [[literals|字面量]]是直接嵌入到代码中的常量。字面量是有类型的，而字面量后缀可以用来修改字面量的默认类型。
- 魔鬼数字指的是含义不明确或是稍后会被修改的字面量（通常是数字），不要在代码中使用魔术数字，应该用符号常量代替它。

[[4-16-Numeral-systems-decimal-binary-hexadecimal-and-octal|4.16 - 数值系统（十进制、二进制、十六进制和八进制）]]

- 在日常生活中，我们使用十进制数，它有10位数字。计算机使用二进制，它只有2位数字。C++还支持八进制(以8为基数)和十六进制(以16为基数)。这些都是数字系统的例子，是用来表示数字的符号(数字)的集合。

[[4-17-An introduction-to-std-string|4.17 - std::string 简介]]  
[[4-18-Introduction-to-std-string_view|4.18 - std::string_view 简介]]  

- 字符串是用于表示文本(如名称、单词和句子)的顺序字符的集合。字符串字面值总是放在双引号之间。C++中的字符串字面量是C风格的字符串，它的类型比较奇怪，很难处理。
- **std::string**提供了简便、安全的处理字符串的方式。字符串字面量总是放在双引号中。使用 `std::string` 需要包含 `<string>` 头文件；
- `std::string_view` 为已经存在的字符串（C风格字符串、`std::string`或字符数组）提供了一种只读的访问方式，而不需创建拷贝。 