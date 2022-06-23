---
title: 8.6 - typedef 和类型别名
alias: 8.6 - typedef 和类型别名
origin: /typedefs-and-type-aliases/
origin_title: "8.6 -- Typedefs and type aliases"
time: 2022-2-18
type: translation
tags:
- typedef
- alias
---

??? note "关键点速记"

	- `using distance_t = double; // distance_t 作为 double 的别名`
	- 类型别名并非新类型
	- 说类型别名并不是**类型安全**的，因为编译器**语义错误**（尽管语法是正确的）
	- 类型别名的作用域规则和变量标识符的规则是一致的
	- 使用类型别名可以定义与平台无关的类型
	- 类型别名可以简化复杂类型名的输入和理解
	- 当类型别名可以提高代码可读性、代码维护性时，明智而审慎地使用它们。

## 类型别名

在 C++ 中，`using` 关键字还可以被用来为已有的类型创建一个[[type-aliases|类型别名(type aliases)]]。创建别名时，在`using`关键字后面紧接着的是别名，然后是一个等号以及一个已有的类型名，例如：

```cpp
using distance_t = double; // distance_t 作为 double 的别名
```

很多类型别名会使用 “`_t`” 或 “`_type`” 后缀来减少命名冲突的几率。不过，这个习惯的一致性并不好，很多类型别名是没有后缀的。

```cpp
using distance_type = double; // 没问题, 后面的章节多会使用这种形式
using distance = double; // 这样也可以，, 但是可能会和其他变量名造成混淆或冲突
```


一旦完成定义后，**类型别名**可以在任何使用**类型**的地方使用。 例如，我们可以使用类型别名创建一个变量：

```cpp
distance_t milesToDestination{ 3.4 }; // 定义 double 类型的变量
```

当编译器遇到一个类型别名的时候，它会把别名替换为真正的类型，例如：

```cpp
#include <iostream>

int main()
{
    using distance_t = double; // 定义 distance_t 作为 double 的别名

    distance_t milesToDestination{ 3.4 }; // 定义 double 类型变量

    std::cout << milesToDestination << '\n'; // 打印 double 值

    return 0;
}
```

输出结果如下：

```
3.4
```

在上面的程序中，我们将 `distance_t` 定义为 `double` 的别名。

接下来，我们定义了一个  `distance_t`  类型的变量 `milesToDestination` 。因为编译器指定 `distance_t`是一个别名，所以它会使用真实的变量类型，即 `double`。因此，变量 `milesToDestination` 在编译时实际上是 `double` 类型的，在任何情况下它的行为也是和 `double` 类型完全一致的。

最后，将 `milesToDestination` 的值作为`double`类型打印。

## 类型别名并不是一种新的类型

类型别名在创建时并没有实际创建一个新的类型——它只是为已有的类型创建了一个新的标识符。类型别名和它对应的类型是可以完全互换的。

这使得我们可以做一些语法上正确，但是语义上没什么实际意义的操作，例如：

```cpp
int main()
{
    using miles_t = long; // define miles_t as an alias for type long
    using speed_t = long; // define speed_t as an alias for type long

    miles_t distance { 5 }; // distance is actually just a long
    speed_t mhz  { 3200 };  // mhz is actually just a long

    // The following is syntactically valid (but semantically meaningless)
    distance = mhz;

    return 0;
}
```


尽管，从概念上来讲我们希望 `miles_t` 和 `speed_t` 具有不同的含义，但是它们实际上都是`long`类型的。这也意味着`miles_t`、`speed_t` 和 `long` 可以互换使用。的确，当我们把`speed_t` 类型的值赋值给 `miles_t` 类型的值是，编译器会认为这只是将一个`long`赋值给了另外一个`long`，所以不会产生任何警告或者报错信息。

因为编译器不会识别这些**语义错误**，所以我们说类型别名并不是**类型安全**的。不过，它们仍然非常有用。

!!! warning "注意"

	注意不要混淆使用两个语义不同的类型别名

!!! cite "题外话"

	有些语言支持强类型typedef(或强类型别名)的概念。强类型typedef定义实际上创建了一个具有原类型所有原始属性的新类型，但如果试图将别名类型的值和强类型定义的值混合使用，编译器将抛出错误。对于 C++20 来说，C++ 并不直接支持强类型typedef(尽管枚举类有类似之处，参见：[10.4 -- Scoped enumerations (enum classes)](https://www.learncpp.com/cpp-tutorial/scoped-enumerations-enum-classes/))，但是有很多第三方的 C++ 库都实现了强typedef类似的行为。
	

## 类型别名的作用域

由于作用域是标识符的属性，类型别名标识符遵循与变量标识符相同的作用域规则：在块内定义的类型别名具有块作用域，并且仅在该块内可用，而在全局命名空间中定义的类型别名具有文件作用域，直到文件末尾都可用。在上面的例子中，`miles_t` 和 `speed_t` 只在 `main()` 函数中可用。

如果你需要在多个文件中使用一个或多个类型别名，它们可以在头文件中定义，并在任何需要使用该定义的代码文件中`#include`：

```cpp title="mytypes.h"
#ifndef MYTYPES
#define MYTYPES

    using miles_t = long;
    using speed_t = long;

#endif
```

通过这种方法`include`的类型别名具有全局作用域。


## `Typedef`

**typedef** (是“type definition”的缩写) 关键字的语义和 `using`是类似的，但是语法顺序是相反的。

```cpp
// 下面两个别名是一致的
typedef long miles_t;
using miles_t = long;
```


`typedef`存在于C++中仍然是出于历史原因，并不推荐使用它。

`typedef`还有一些语法问题。首先，很容易忘记应该把 _typedef_ 名放在前面还是应该把别名放在前面。下面哪个是对的？


```cpp
typedef distance_t double; // 错误 (typedef 名应该放在前面)
typedef double distance_t; // 正确 (需要创建别名的类型应该放在前面)
```


这个是很容易写反的，不过好在写反的时候编译器会报错。

其次，在处理复杂类型时，`typedef`的语法特别丑陋。例如，下面这个`typedef`的例子就非常难以阅读，而使用`using`创建的等价的类型别名则更容易阅读：

```cpp
typedef int (*fcn_t)(double, char); // fcn_t hard to find
using fcn_t = int(*)(double, char); // fcn_t easier to find
```


在上面的 `typedef` 定义中，新类型(`fcn_t`)被藏在了定义的中间部分，这使得该定义变得很难阅读。

第三，“typedef” 这个看起来像是要定义一个新的类型，但是实际上并没有，从之前的例子可以看出，类型和类型别名是可以互换使用的。

!!! success "最佳实践"

	在创建类型别名时，尽量使用类型别名语法而不是`typedef`语法。

## 什么时候应该使用类型别名？

在了解了什么是类型别名之后，是时候该聊聊，合适应该使用类型别名呢？

## 在平台无关的代码中使用类型别名

类型别名的一个用途是，它们可以用来隐藏平台特定的细节。在某些平台上，`int` 为2字节，而在其他平台上为 4 字节。因此，在编写与平台无关的代码时，使用 `int` 存储超过 2 字节的信息可能会有潜在的危险。

因为从字面上并不能看出 `char` 、`short`、`int` 和 `long` 的大小，所以跨平台程序使用类型别名来定义以位为单位包含类型大小的别名是相当常见的。例如， `int8_t` 是一个 8 位有符号整数，`int16_t` 是一个 16 位有符号整数，`int32_t` 是一个32位有符号整数。以这种方式使用类型别名有助于防止错误，并更清楚地说明对变量大小的期望值是多少。

为了确保每个别名类型解析为正确大小的类型，这类类型别名通常与预处理器指令一起使用:

```cpp
#ifdef INT_2_BYTES
using int8_t = char;
using int16_t = int;
using int32_t = long;
#else
using int8_t = char;
using int16_t = short;
using int32_t = int;
#endif
```


在某些机器上，整型只占 2 个字节，这时宏 `INT_2_BYTES` 是被 `#defined` 过的，所以程序在编译时会将这段代码的上半部分定义的类型别名进行编译。在整型占 4 个字节的机器上， 宏 `INT_2_BYTES` 不存在，因此下半部分的类型别名会被编译。 通过这种方法，可以使用`char`、`short`、`int` 和 `long` 的组合在特定的机器上将 `int8_t` 解析为 1 个字节的整数，`int16_t` 解析为 2 个字节的整数，`int32_t` 解析为 4 个字节的整数。

对于固定宽度整型 (例如 `std::int_fast16_t` 和 `std::int_least32_t`) 和 `size_t` 类型 (参见： [[4-6-Fixed-width-integers-and-size_t|4.6 - 固定宽度整型和 size_t]]) 其实也正是这些基础类型的别名罢了。

这也是为什么在使用`std::cout`打印 8 位固定宽度整型的时候，你多半会打印出一个字符的原因。例如：


```cpp
#include <cstdint> // for fixed-width integers
#include <iostream>

int main()
{
    std::int_least8_t x{ 97 }; // int_least8_t 实际上是 char 的类型别名
    std::cout << x;

    return 0;
}
```

程序打印结果为：

```
a
```

因为  `std::int_least8_t `通常被定义为`char` 的类型别名，变量 `x` 将被定义为 `char`。 而 `char` 类型将其值打印为ASCII字符，而不是整数值。

## 使用类型别名简化类型

虽然我们目前只使用过一些简单的数据类型，但是对于高阶C++编程来说，类型通常是复杂且冗长的，如果你手动输入它们会非常费劲。例如，有些函数和变量的定义像下面这样：

```cpp
#include <string> // for std::string
#include <vector> // for std::vector
#include <utility> // for std::pair

bool hasDuplicates(std::vector<std::pair<std::string, int>> pairlist)
{
    // some code here
    return false;
}

int main()
{
     std::vector<std::pair<std::string, int>> pairlist;

     return 0;
}
```


在每个需要的地方输入`std::vector<std::pair<std::string, int>>` 不仅繁琐，而且非常容易出错。如果使用类型别名则简单的多：

```cpp
#include <string> // for std::string
#include <vector> // for std::vector
#include <utility> // for std::pair

using pairlist_t = std::vector<std::pair<std::string, int>>; // make pairlist_t an alias for this crazy type

bool hasDuplicates(pairlist_t pairlist) // use pairlist_t in a function parameter
{
    // some code here
    return false;
}

int main()
{
     pairlist_t pairlist; // instantiate a pairlist_t variable

     return 0;
}
```


看起来好多了对吧！现在，你需要输入的是`pairlist_t` 而不是 `std::vector<std::pair<std::string, int>>`。

如果你还不知道`std::vector`、`std::pair` 或者那些看起来很吓人的尖括号是什么，也不用担心。现在你只需要知道类型别名可以简化类型、使你的代码更易读，减少繁琐的输入就可以了。

这也是类型别名最有用的地方。

## 使用类型别名让程序更清晰

类型别名还有助于增强代码的可读性，践行代码即文档的思想。

With variables, we have the variable’s identifier to help document the purpose of the variable. But consider the case of a function’s return value. Data types such as `char`, `int`, `long`, `double`, and `bool` are good for describing what _type_ a function returns, but more often we want to know what _purpose_ a return value serves.

变量可以通过标识符（变量名）来帮助表示它的用途。但是对于函数返回值来说，尽管 `char`、`int`、 `long`、 `double` 和 `bool`可以表明函数值的类型，但它们并没有办法很好地表明函数返回值的用途究竟是什么。

对于下面的函数来说：

```cpp
int gradeTest();
```

函数返回值的类型是整型，但是这个整型返回值的含义到底是什么呢？是学生的分数？是没有作答的问题数？是学号？还是错误码？没有人知道，因为`int`并不能表达这层含义。如果幸运的话，也许函数有文档可供我们参考。如果不幸的话，你就必须阅读源码然后去猜测它的用途了。

而对于下面这个使用了类型别名的等价的例子来说：

```cpp
using testScore_t = int;
testScore_t gradeTest();
```


返回值类型为 `testScore_t` ，它能够更好地表明函数的返回值表示一次测验的分数。

根据我们的经验，创建类型别名只是为了记录单个函数的返回类型是不值得的(使用注释代替)。但是，如果你已经因为其他原因创建了类型别名，这可能是一个额外好处。


## 使用类型别名提高代码可维护性

使用类型别名还可以在不进行大量改动的情况下修改对象的基本类型。例如，学生的ID原本使用 `short` 来保存，但后来决定用 `long` 来代替，此时你就必须将大量的 `short`替换为 `long`。这个时候往往很难确定究竟哪些`short`是用来保存ID的，而哪些则用于其他目的。

然而，如果你使用了类型别名，那么更改类型就像更新类型别名一样简单(例如，将 `using studentID_t = short;` 修改为 `using studentID_t = long;` )。

虽然这看起来是一个非常方便的特性，但每当类型发生变化时，我们仍然需要保持谨慎，因为程序的行为也可能随之发生变化。当将类型别名的类型更改为不同类型族中的类型时尤其如此(例如，将整数更改为浮点值，或反之亦然)！新类型可能有浮点数比较或整数/浮点除法问题，或其他旧类型所没有的问题。如果你将现有的类型更改为其他类型，代码应该重新、彻底地测试。




## 缺点和结论

然类型别名提供了一些好处，但它们也在代码中引入了另一个需要理解的标识符。如果这一点没有被可读性或理解的好处所抵消，那么类型别名弊大于利。

类型别名使用不当的话，会将熟悉的类型(例如 `std::string` )隐藏在自定义名称后面。在某些情况下(例如智能指针，我们将在以后的章节中讨论)，模糊的类型信息也可能不利于理解类型应该如何工作。

因此，类型别名应该主要用于对代码可读性或代码维护有明显好处的情况。这既是一门科学，也是一门艺术。当类型别名可以在代码的许多地方使用而不是在寥寥几处使用时，才是它们大放异彩的机会。


!!! success "最佳实践"

	当类型别名可以提高代码可读性、代码维护性时，明智而审慎地使用它们。
	