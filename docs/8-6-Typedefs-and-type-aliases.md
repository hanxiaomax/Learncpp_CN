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


`typedef`存在于C++中仍然是出于历史原因，但是ta'mbut their use is discouraged.

Typedefs have a few syntactical issues. First, it’s easy to forget whether the _typedef name_ or _aliased type name_ come first. Which is correct?

```cpp
typedef distance_t double; // incorrect (typedef name first)
typedef double distance_t; // correct (aliased type name first)
```

COPY

It’s easy to get backwards. Fortunately, in such cases, the compiler will complain.

Second, the syntax for typedefs can get ugly with more complex types. For example, here is a hard-to-read typedef, along with an equivalent (and slightly easier to read) type alias with “using”:

```cpp
typedef int (*fcn_t)(double, char); // fcn_t hard to find
using fcn_t = int(*)(double, char); // fcn_t easier to find
```

COPY

In the above typedef definition, the name of the new type (`fcn_t`) is buried in the middle of the definition, making the definition hard to read.

Third, the name “typedef” suggests that a new type is being defined, but that’s not true. As we have seen above, an alias is interchangeable with the aliased type.

!!! success "最佳实践"

	When creating aliased types, prefer the type alias syntax over the typedef syntax.

## When should we use type aliases?

Now that we’ve covered what type aliases are, let’s talk about what they are useful for.

## Using type aliases for platform independent coding

One of the uses for type aliases is that they can be used to hide platform specific details. On some platforms, an `int` is 2 bytes, and on others, it is 4 bytes. Thus, using `int` to store more than 2 bytes of information can be potentially dangerous when writing platform independent code.

Because `char`, `short`, `int`, and `long` give no indication of their size, it is fairly common for cross-platform programs to use type aliases to define aliases that include the type’s size in bits. For example, `int8_t` would be an 8-bit signed integer, `int16_t` a 16-bit signed integer, and `int32_t` a 32-bit signed integer. Using type aliases in this manner helps prevent mistakes and makes it more clear about what kind of assumptions have been made about the size of the variable.

In order to make sure each aliased type resolves to a type of the right size, type aliases of this kind are typically used in conjunction with preprocessor directives:

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

COPY

On machines where integers are only 2 bytes, `INT_2_BYTES` can be #defined, and the program will be compiled with the top set of type aliases. On machines where integers are 4 bytes, leaving `INT_2_BYTES` undefined will cause the bottom set of type aliases to be used. In this way, `int8_t` will resolve to a 1 byte integer, `int16_t` will resolve to a 2 bytes integer, and `int32_t` will resolve to a 4 byte integer using the combination of `char`, `short`, `int`, and `long` that is appropriate for the machine the program is being compiled on.

The fixed-width integers (such as `std::int_fast16_t` and `std::int_least32_t`) and `size_t` type (both covered in lesson [[4-6-Fixed-width-integers-and-size_t|4.6 - 固定宽度整型和 size_t]]) are actually just type aliases to various fundamental types.

This is also why when you print an 8-bit fixed-width integer using `std::cout`, you’re likely to get a character value. For example:

```cpp
#include <cstdint> // for fixed-width integers
#include <iostream>

int main()
{
    std::int_least8_t x{ 97 }; // int_least8_t is actually a type alias for a char type
    std::cout << x;

    return 0;
}
```

COPY

This program prints:

```
a
```

Because `std::int_least8_t` is typically defined as a type alias for one of the char types, variable `x` will be defined as a char type. And char types print their values as ASCII characters rather than as integer values.

Using type aliases to make complex types simple

Although we have only dealt with simple data types so far, in advanced C++, types can be complicated and lengthy to manually enter on your keyboard. For example, you might see a function and variable defined like this:

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

COPY

Typing `std::vector<std::pair<std::string, int>>` everywhere you need to use that type is cumbersome, and it is easy to make a typing mistake. It’s much easier to use a type alias:

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

COPY

Much better! Now we only have to type `pairlist_t` instead of `std::vector<std::pair<std::string, int>>`.

Don’t worry if you don’t know what `std::vector`, `std::pair`, or all these crazy angle brackets are yet. The only thing you really need to understand here is that type aliases allow you to take complex types and give them a simple name, which makes your code easier to read and saves typing.

This is probably the best use for type aliases.

## Using type aliases for legibility

Type aliases can also help with code documentation and comprehension.

With variables, we have the variable’s identifier to help document the purpose of the variable. But consider the case of a function’s return value. Data types such as `char`, `int`, `long`, `double`, and `bool` are good for describing what _type_ a function returns, but more often we want to know what _purpose_ a return value serves.

For example, given the following function:

```cpp
int gradeTest();
```

COPY

We can see that the return value is an integer, but what does the integer mean? A letter grade? The number of questions missed? The student’s ID number? An error code? Who knows! The return type of `int` does not tell us much. If we’re lucky, documentation for the function exists somewhere that we can reference. If we’re unlucky, we have to read the code and infer the purpose.

Now let’s do an equivalent version using a type alias:

```cpp
using testScore_t = int;
testScore_t gradeTest();
```

COPY

The return type of `testScore_t` makes it a little more obvious that the function is returning a type that represents a test score.

In our experience, creating a type alias just to document the return type of a single function isn’t worth it (use a comment instead). But if you have already created a type alias for other reasons, this can be a nice additional benefit.

## Using type aliases for easier code maintenance

Type aliases also allow you to change the underlying type of an object without having to change lots of code. For example, if you were using a `short` to hold a student’s ID number, but then later decided you needed a `long` instead, you’d have to comb through lots of code and replace `short` with `long`. It would probably be difficult to figure out which objects of type `short` were being used to hold ID numbers and which were being used for other purposes.

However, if you use type aliases, then changing types becomes as simple as updating the type alias (e.g. from `using studentID_t = short;` to `using studentID_t = long;`).

While this seems like a nice benefit, caution is necessary whenever a type is changed, as the behavior of the program may also change. This is especially true when changing the type of a type alias to a type in a different type family (e.g. an integer to a floating point value, or vice versa)! The new type may have comparison or integer/floating point division issues, or other issues that the old type did not. If you change an existing type to some other type, your code should be thoroughly retested.

## Downsides and conclusion

While type aliases offer some benefits, they also introduce yet another identifier into your code that needs to be understood. If this isn’t offset by some benefit to readability or comprehension, then the type alias is doing more harm than good.

A poorly utilized type alias can take a familiar type (such as `std::string`) and hide it behind a custom name that needs to be looked up. In some cases (such as with smart pointers, which we’ll cover in a future chapter), obscuring the type information can also be harmful to understanding how the type should be expected to work.

For this reason, type aliases should be used primarily in cases where there is a clear benefit to code readability or code maintenance. This is as much of an art as a science. Type aliases are most useful when they can be used in many places throughout your code, rather than in fewer places.

!!! success "最佳实践"

	Use type aliases judiciously, when they provide a clear benefit to code readability or code maintenance.