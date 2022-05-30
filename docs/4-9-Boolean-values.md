---
title: 4.9 - 布尔值
alias: 4.9 - 布尔值
origin: /boolean-values/
origin_title: "4.9 — Boolean values"
time: 2022-5-2
type: translation
tags:
- data type
- bool
---

??? note "关键点速记"
	- 不能用统一初始化和一个整型数来初始化布尔变量，其他情况是可以转换的

在现实中，有些问题的答案只有”是“或”不是“两种。”苹果是水果吗？“，是的。”你爱吃笋吗？“不。

现在，我们考虑一个类似的语句，它只能用`true`或`false`来回答：”苹果是水果“，`true`。”我喜欢吃笋“，`false`。

像这种只有两种可能答案的语句（yes/true 或 no/false）很常见，很多编程语言都有用于处理此类输出结果的特殊类型。它们称为布尔类型（注意：Boolean在英语中是大大写字母开头的，因为它的发明人是乔治布尔（George Boole））。


## 布尔变量

布尔变量只有两种可能的值：_true_ 和 _false_。

声明布尔类型的变量需要使用关键字 **bool**。

```cpp
bool b;
```

初始化布尔类型的变量或为其赋值，需要使用 `true` 或 `false`。

```cpp
bool b1 { true };
bool b2 { false };
b1 = false;
bool b3 {}; // 默认初始化为 false
```


和一元负号运算符(`-`)可以被用来将一个正数变成负数一样，使用逻辑**非**运算符(`!`)可以将布尔值`true`变成`false`或者把`false`变成`true`：

```cpp
bool b1 { !true }; // b1 被初始化为 false
bool b2 { !false }; // b2 被初始化为 true
```

布尔值通常并不会以 “true” 或 “false”来存储。实际上它是以整型来存储的：`true`会变成1，`false`会变成0。类似地，当布尔类型求值时，求值的实际结果也并不是“true” 或 “false”。通常它们会求值成_0_ (false) 或 _1_ (true)。因为布尔类型实际上是以整型存储的，因此它属于一种整形的类型(integral type)。


## 打印布尔变量

当使用 `std::cout`打印布尔变量时， `std::cout` 会将 false 打印成 0，而把 true 打印成1：

```cpp
#include <iostream>

int main()
{
    std::cout << true << '\n'; // true evaluates to 1
    std::cout << !true << '\n'; // !true evaluates to 0

    bool b{false};
    std::cout << b << '\n'; // b is false, which evaluates to 0
    std::cout << !b << '\n'; // !b is true, which evaluates to 1
    return 0;
}
```

Outputs:

```
1
0
0
1
```

如果你希望 `std::cout` 打印 “true” 或 “false” 而不是 0 或 1，你可以使用 `std::boolalpha`。例如：

```cpp
#include <iostream>

int main()
{
    std::cout << true << '\n';
    std::cout << false << '\n';

    std::cout << std::boolalpha; // print bools as true or false

    std::cout << true << '\n';
    std::cout << false << '\n';
    return 0;
}
```

打印结果：

```
1
0
true
false
```

你可以使用 `std::noboolalpha` 来关闭此功能。

## 整型转换为布尔类型

你不能用统一初始化和一个整型数来初始化布尔变量：

```cpp
#include <iostream>

int main()
{
	bool b{ 4 }; // 错误：: 不允许缩窄转换
	std::cout << b;

	return 0;
}
```


(注意：有些版本的g++并不会有上述限制）

不过，在其他场景下整型是可以被转换为布尔值的。整型值0会被转换为`false`，而其他整型会被转换为`true`。

```cpp
#include <iostream>

int main()
{
	std::cout << std::boolalpha; // print bools as true or false

	bool b1 = 4 ; // 拷贝初始化允许隐式转换
	std::cout << b1 << '\n';

	bool b2 = 0 ; // 拷贝初始化允许隐式转换
	std::cout << b2 << '\n';


	return 0;
}
```


打印结果为：

```
true
false
```

注意：`bool b1 = 4;` 可以能会产生警告。这种情况下你需要关闭编译的”将告警当做错误处理“功能，这样你猜呢编译上述代码。

## 输入布尔值

使用 `std::cin` 来输入布尔类型常常会让新手程序员抓狂。

考虑下面的程序：

```cpp
#include <iostream>

int main()
{
	bool b{}; // 默认初始化为 false
	std::cout << "Enter a boolean value: ";
	std::cin >> b;
	std::cout << "You entered: " << b << '\n';

	return 0;
}
```


```
Enter a Boolean value: true
You entered: 0
```

什么！怎么会这样？

实际上，`std::cin`只能够接收两种布尔类型输入：0和1（而不是 `true` 或 `false` ）。任何其他的输入都会导致 `std::cin` 出错。在上面的例子中，因为我们输入了true，因此实际上 `std::cin`出错了，输入出错后，接受输入的变量会被清零，因此`b`就被赋值为`false`。因此，当 `std::cout` 打印`b`的时候，会打印0。

为了让 `std::cin` 能够接受 “false” 和 “true” 作为输入，`std::boolalpha` 必须被打开。

```cpp
#include <iostream>

int main()
{
	bool b{};
	std::cout << "Enter a boolean value: ";

	// 允许用户输入 'true' 或 'false' 作为布尔值
	std::cin >> std::boolalpha;
	std::cin >> b;

	std::cout << "You entered: " << b << '\n';

	return 0;
}
```


不过，当`std::boolalpha` 打卡后，“0” 和 “1” 就不会再被看出布尔类型了。

## 布尔类型的返回值

布尔值常备用作函数的返回值，用来检查某件事(物)是否为true。这种函数命名时通常以`is`开头（例如 `isEqual`）或 `has`（例如 `hasCommonDivisor`）。

考虑下面这个例子，和上面有些类似：

```cpp
#include <iostream>

// 如果 x 和 y 相等则返回 true 否则返回 false
bool isEqual(int x, int y)
{
    return (x == y); //  如果 x 和 y 相等，operator== 则返回 true 否则返回 false
}

int main()
{
    std::cout << "Enter an integer: ";
    int x{};
    std::cin >> x;

    std::cout << "Enter another integer: ";
    int y{};
    std::cin >> y;

    std::cout << std::boolalpha; // print bools as true or false

    std::cout << x << " and " << y << " are equal? ";
    std::cout << isEqual(x, y); // will return true or false

    return 0;
}
```


两次运行的输出结果如下：

```
Enter an integer: 5
Enter another integer: 5
5 and 5 are equal? true
```

```
Enter an integer: 6
Enter another integer: 4
6 and 4 are equal? false
```

原理是什么呢？首先我们从输入获取 x 和 y 的值。接下来，表达式 `isEqual(x, y)`会进行求值。在第一次yun'x is evaluated. In the first run, this results in a function call to isEqual(5, 5). Inside that function, 5 == 5 is evaluated, producing the value _true_. The value _true_ is returned back to the caller to be printed by std::cout. In the second run, the call to isEqual(6, 4) returns the value _false_.

Boolean values take a little bit of getting used to, but once you get your mind wrapped around them, they’re quite refreshing in their simplicity! Boolean values are also a huge part of the language -- you’ll end up using them more than all the other fundamental types put together!

We’ll continue our exploration of Boolean values in the next lesson.