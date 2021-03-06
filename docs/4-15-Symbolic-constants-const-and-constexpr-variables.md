---
title: 4.15 - 符号常量 const 和 constexpr 变量
alias: 4.15 - 符号常量 const 和 constexpr 变量
origin: /const-constexpr-and-symbolic-constants/
origin_title: "4.15 -- Symbolic constants-const and constexpr variables"
time: 2022-5-24
type: translation
tags:
- const
- constexpr
- C++17
---

??? note "关键点速记"

    - const 变量必须初始化，且初始化之后值不可以改变
    - 任何在初始化后值就不能被改变，且初始化值可以在编译时确定的变量，都必须声明为 `constexpr`
    - constexpr 不能被定义在其他文件中然后通过前向声明使用，这样编译器就无法在编译时得到它的值
    - 任何在初始化后值就不能被改变，但是初始化值不能在编译时确定的变量，都应该声明为 `const`
    - 字面量是隐式的 `constexpr`，因为字面量的值在编译时就可以确定
    - 常数表达式指的是可以在运行时求值得到结果的表达式
    - C++17 和之前的版本不支持 `constexpr std:: string` ，只有在 C++20 中才有有限的的支持。如果你想要使用 `constexpr strings`，应该用 `std:: string_view` 代替
    - 避免使用 `#define` 来创建符号常量宏。使用 const 或者 constexpr
    

## Const 变量

到目前为止，我们看到的所有变量都是“非常量”——也就说它们的值可以在任何时间被改变，例如：

```cpp
int x { 4 }; // initialize x with the value of 4
x = 5; // change value of x to 5
```

不过，有时候需要将变量定义为不能改变。例如，地球的引力是 `9.8 meters/second^2`，这个值不太可能会随时改变（如果真的会随时改变的话，你应该担心的就不是 C++了）。所以将这个值定义为常量可以确保它不会被意外改变。

将变量定义为常量，只需要在类型前面或后面添加 `const` 关键字，例如：

```cpp
const double gravity { 9.8 };  // preferred use of const before type
int const sidesInSquare { 4 }; // "east const" style, okay, but not preferred
```

尽管 C++ 允许你在类型前面或者后面添加 ` const` 关键字，我们还是推荐你把它放在类型前面，这样看上去更像是正常的英语语法。

const 类型的变量通常被称为符号常量（与之相对的是字符串常量，字符串常量是没有名字的）。

## Const 变量必须初始化

const 变量**必须**在定义时初始化，此后你也不能通过赋值来改变它：

```cpp
int main()
{
    const double gravity; // error: const variables must be initialized
    gravity = 9.9; // error: const variables can not be changed

    return 0;
}
```

注意，const 变量可以使用其他类型的变量初始化（包括非 const 类型的变量）：

```cpp
#include <iostream>

int main()
{
    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    const int usersAge { age };

    // age is non-const and can be changed
    // usersAge is const and can not be changed

    std::cout << usersAge;

    return 0;
}
```

## 运行时常量和编译时常量

C++ 实际上有两种类型的常量。

[[runtime|运行时]]常量的初始化值必须在运行时才能解析（当程序运行时），下面的例子展示了运行时常量：

```cpp
#include <iostream>

void printInt(const int x) // x is a runtime constant because the value isn't known until the program is run
{
    std::cout << x;
}

int main()
{
    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    const int usersAge { age }; // usersAge is a runtime constant because the value isn't known until the program is run

    std::cout << "Your age is: ";
    printInt(usersAge);

    return 0;
}
```

上面程序中的 `usersAge` 和 `x` 这样的变量，就是运行时常量，因为编译器不能确定它们的初始值，必须等到程序运行时才能确定。`usersAge` 的值依赖用户的输入（只有在运行时才能获取输入）而 `x` 的值依赖于传入函数的值（也只有在程序运行时才知道）。不过，一旦这些值被初始化之后，它们的值就不能再改变了。

编译时常量的初始化值，可以在[[compile-time|编译时]]就确定。下面的例子展示了编译时常量：

```cpp
const double gravity { 9.8 }; // the compiler knows at compile-time that gravity will have value 9.8
const int something { 1 + 2 }; // the compiler can resolve this at compiler time
```

编译时常量可以使编译器进行编译优化，这是运行时常量做不到的。例如，每当使用 `gravity` 的时候，编译器可以直接将其替换为字面量 9.8。

当你声明一个 const 变量的时候，编译器会自动追踪并判断它是运行时常量还是编时常量。在大多数情况下，是什么并没有关系，但是有少数情况 C++ 要求必须使用一个编译时常量而非运行时常量（我们会在后面介绍这种情况）。

## constexpr

为了能够更加确切，C++引入了关键字 **constexpr**，它可以确保一个常量是编译时常量：

```cpp
#include <iostream>

int main()
{
    constexpr double gravity { 9.8 }; // ok, the value of 9.8 can be resolved at compile-time
    constexpr int sum { 4 + 5 }; // ok, the value of 4 + 5 can be resolved at compile-time

    std::cout << "Enter your age: ";
    int age{};
    std::cin >> age;

    constexpr int myAge { age }; // 编译错误: age 是一个运行时常量而不是编译时常量

    return 0;
}
```

!!! success "最佳实践"

    任何在初始化后值就不能被改变，且初始化值可以在编译时确定的变量，都必须声明为 `constexpr`。
    任何在初始化后值就不能被改变，但是初始化值不能在编译时确定的变量，都应该声明为 `const`。


在现实中，程序员通常懒得将一个简单函数中的局部变量定义为 `const` 类型，因为这些局部变量被不小心修改的可能性并不大。

注意，字面量是隐式的 `constexpr`，因为字面量的值在编译时就可以确定。

## 常量表达式

常量表达式指的是可以在运行时求值得到结果的表达式，例如：

```cpp
#include <iostream>

int main()
{
    std::cout << 3 + 4; // 3 + 4 evaluated at compile-time

    return 0;
}
```

在上面的程序中，字面量 3 和 4 在编译时就指定，所以编译器可以对表达式 `3+4` 求值，然后替换成 7。这么做可以使代码运行速度加快，因为表达式 `3+4` 无需在运行时求值了。

Constexpr 变量也可以被用在常量表达式中：

```cpp
#include <iostream>

int main()
{
    constexpr int x { 3 };
    constexpr int y { 4 };
    std::cout << x + y; // x + y evaluated at compile-time

    return 0;
}
```

在上面的例子中，因为 `x` 和 `y` 都是 `constexpr`，所以表达式 `x + y` 也是一个常量表达式，它的结果也可以在爱编译时求出。和字面量的例子一样，编译器会把它替换成 7。

## Constexpr 字符串

如果你尝试定义 `constexpr std:: string`，你的编译器可能会报错 ：

```cpp
#include <iostream>
#include <string>

using namespace std::literals;

int main()
{
    constexpr std::string name{ "Alex"s }; // compile error

    std::cout << "My name is: " << name;

    return 0;
}
```

这是因为在 C++17 或之前的版本中还不支持 `constexpr std:: string` ，只有在 C++20 中才有有限的的支持。如果你想要使用 `constexpr strings`，应该用 `std:: string_view` 代替：

```cpp
#include <iostream>
#include <string_view>

using namespace std::literals;

int main()
{
    constexpr std::string_view name{ "Alex"sv }; // ok: std::string_view can be constexpr

    std::cout << "My name is: " << name;

    return 0;
}
```


!!! info "相关内容"

    我们会在[[11-7-An-introduction-to-std-string_view|11.7 - std:: string_view 简介]] 中介绍 `std:: string_view`

## const 变量的命名

有些程序员喜欢用全大写字母来命名  const 变量。而有些程序员则喜欢使用普通变量名加 `k` 前缀。本课程会使用普通变量名的命名方法。const 变量在各种情况下都和普通变量具有一样的表现，只是它们的值不能被修改而已，因此我们也没有必要对其进行特别地命名。

## Const 类型的函数形参和返回值

const 类型也可以用于函数形参：

```cpp
#include <iostream>

void printInt(const int x)
{
    std::cout << x;
}

int main()
{
    printInt(5); // 5 will be used as the initializer for x
    printInt(6); // 6 will be used as the initializer for x

    return 0;
}
```

将函数的形参定义为 `const` 类型，可以借助编译器来确保该参数的值再函数中不会被修改。注意，在上面的例子中我们并没有为 `const` 参数提供一个初始化值——在这个例子中，传递给函数的实参被用作初始化值。

当使用[[pass-by-value|按值传递]]的方式传递实参是，我们通常不会在意函数中是否修改了该才是（毕竟它只是一份拷贝，而且在函数退出时就销毁了）。出于这个原因，通常我们不会把值传递的形参定义为 `const`。 但是，稍后我们会介绍另外一种类型的形参（改变形参会改变创的实参）。对于这种类型的形参，将其定义为 `const` 类型还是很重要的。

!!! success "最佳实践"

    函数的形参按值传递时，没必要定义为 const。

函数的返回值也可以被定义为 `const`：

```cpp
#include <iostream>

const int getValue()
{
    return 5;
}

int main()
{
    std::cout << getValue();

    return 0;
}
```

不过，由于返回值只是拷贝，因此也没必要定义为 `const`。

!!! success "最佳实践"

    不要将返回值定义为 `const`。
