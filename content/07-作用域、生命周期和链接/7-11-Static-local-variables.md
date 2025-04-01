---
title: 7.11 - 静态局部变量
alias: 7.11 - 静态局部变量
origin: /static-local-variables/
origin_title: "6.10 — Static local variables"
time: 2021-6-4
type: translation
tags:
- static
- local variable
---

> [!note] "Key Takeaway"
> - 自动存储持续时间，会在变量定义时创建变量，退出语句块时销毁变量
> - 静态存储持续时间，会在程序开始时创建变量，并且在程序结束时销毁。
> - 具有初值0或者constexpr类型初始化值的静态变量，在程序启动时就会被初始化。而具有非constexpr类型初始化值的静态局部变量则会在第一次被定义时进行初始化(在后续的函数调用中，该变量不会被重新初始化）。
> - 静态局部变量和全局变量一样都可以持续到程序结束前，但是它的可见范围更小，也就更安全。
> - 对静态局部变量进行初始化。静态局部变量只会在第一次执行时被初始化，后面不会对其进行重复地初始化。
> - 当变量创建或者初始化开销很大时，可以将其定义为静态const局部变量
> - 除非变量永远不需要被重置，否则要避免使用静态局部变量

`static` 是 C++ 中最令人困惑的术语之一，这主要是因为`static`在不同语境下的含义也是不同的。

在之前的课程中（[[7-4-Introduction-to-global-variables|7.4 - 全局变量]]），我们介绍过全局变量具有[[static-storage-duration|静态存储持续时间]]，也就是说全局变量会在程序开始时被创建，并且在程序结束时被销毁。

我们还介绍了 `static` 关键字可以使全局变量具有[[internal-linkage|内部链接]]属性，也就是该全局变量只能在定义它的文件中使用。

在本节课中，我们会讨论`static`对局部变量的影响。

## 静态局部变量

在 [[2-5-Introduction-to-local-scope|2.5 - 局部作用域]] 中，我们介绍过局部变量默认具有[[automatic-storage-duration|自动存储持续时间]]，也就是说，它会在定义时被创建，在语句块退出时被销毁。

对局部变量使用 `static` 关键字，可以将局部变量的[[storage-duration|存储持续时间]]从**自动**修改为**静态**。也就是说，这种局部变量会在程序开始时被创建，然后在程序结束后被销毁（就像全局变量一样）。这样一来，静态变量可以在离开作用域后继续保持它的值。

通过一个例子就可以很好的展示**自动持续时间**和**静态持续时间**的不同。

**自动持续时间**（默认）：

```cpp
#include <iostream>

void incrementAndPrint()
{
    int value{ 1 }; // automatic duration by default
    ++value;
    std::cout << value << '\n';
} // value is destroyed here

int main()
{
    incrementAndPrint();
    incrementAndPrint();
    incrementAndPrint();

    return 0;
}
```


每次调用 `incrementAndPrint()` 的时候，变量`value`都会被创建并且赋值为 1。`incrementAndPrint()` 会把`value`递增为 2，然后将 2 打印出来，当 `incrementAndPrint()`函数退出后，变量就会离开作用域并被销毁。所以，输出结果如下：


```
2
2
2
```

接下来，考虑 static 版本的程序。这两个版本程序的唯一区别就是接下来我们使用`static`关键字将自动持续时间修改为静态持续时间。

**静态持续时间**（使用`static`关键字）：

```cpp
#include <iostream>

void incrementAndPrint()
{
    static int s_value{ 1 }; // static duration via static keyword.  This initializer is only executed once.
    ++s_value;
    std::cout << s_value << '\n';
} // s_value is not destroyed here, but becomes inaccessible because it goes out of scope

int main()
{
    incrementAndPrint();
    incrementAndPrint();
    incrementAndPrint();

    return 0;
}
```

在这个程序中，因为 `s_value` 被定义为 `static` 类型，因此它会在程序启动时被创建。

具有初值0或者constexpr类型初始化值的静态变量，在程序启动时就会被初始化。而具有非constexpr类型初始化值的静态局部变量则会在第一次被定义时进行初始化(在后续的函数调用中，该变量不会被重新初始化）。因为 `s_value` 具有 constexpr 初始化值 `1`，所以在程序启动时 `s_value` 就会被初始化。

当函数结束时， `s_value` 会[[out-of-scope|超出作用域]]，但是它不会被销毁。每次 `incrementAndPrint()` 被调用时，`s_value` 的值仍然为之前的值。这样一来，程序的打印结果如下：

```
2
3
4
```

类似 “g_” 通常作为全局变量的前缀，“s_” 常被用来作为静态局部变量的前缀。

静态局部变量最常见的用法是最为一个唯一ID生成器。想象一下，如果有一个程序中包含了很多类似的对象（例如，在某个游戏中你被很多僵尸攻击，或者你希望模拟很多三角形）。这种情况下你几乎不可能定位是哪个对象出问题了。因此，如果你可以为每个对象都创建一个唯一的标识符，则可以在日后debug时轻松地将它们区别开来。

使用静态局部变量可以很轻松地创建唯一ID：

```cpp
int generateID()
{
    static int s_itemID{ 0 };
    return s_itemID++; // makes copy of s_itemID, increments the real s_itemID, then returns the value in the copy
}
```

当函数第一次被调用时，静态局部变量被初始化为0。第二次调用时，该变量递增为了 1。每次调用该函数，静态局部变量的值都会比之前一次调用大1。你可以把这些值作为唯一ID赋值给对象。因为`s_itemID` 是局部变量，所以它并不会被其他函数“篡改”。

静态变量相对于全局变量具有一些优势（它们都不会在程序结束前被销毁），因为它只在定义它的块中可见。这样一来它就会更加安全（当你需要频繁修改它的值的时候）。

> [!success] "最佳实践"
> 对静态局部变量进行初始化。静态局部变量只会在第一次执行时被初始化，后面不会对其进行重复地初始化。
	
## 静态局部常量

静态局部变量也可以被定义为常量。静态局部常量的典型使用场景是当你的函数需要一个常量值，但是创建或初始化该常量的开销非常大（例如该值是从数据库中读取的）。如果你使用一个普通的局部变量，那么这个变量就会在每次函数被调用时初始化。而使用const类型的静态局部变量，你就可以在第一次调用函数时初始化它，然后在后续的调用中对其进行重用。

## 不要使用静态局部变量来改变流程

考虑如下代码：

```cpp
#include <iostream>

int getInteger()
{
	static bool s_isFirstCall{ true };

	if (s_isFirstCall)
	{
		std::cout << "Enter an integer: ";
		s_isFirstCall = false;
	}
	else
	{
		std::cout << "Enter another integer: ";
	}

	int i{};
	std::cin >> i;
	return i;
}

int main()
{
	int a{ getInteger() };
	int b{ getInteger() };

	std::cout << a << " + " << b << " = " << (a + b) << '\n';

	return 0;
}
```

输出如下：

```
Enter an integer: 5
Enter another integer: 9
5 + 9 = 14
```

这段代码的确能够按照预期工作，但是因为我们使用的是一个静态局部变量，这会使得程序难以理解。如果有人在不知道 `getInteger()` 函数的实现细节时，阅读 `main` 函数的代码，它完全不会认为两次调用 `getInteger()` 会产生不同的效果。但是两次调用该函数的确会产生不同的输出，这就好让人感到非常困惑，

	假设你的微波炉上有一个+1按钮，当你按下它的时候就会延长一分钟加热时间。你准备加热一些吃的，设定好时间，然后等着出锅。这期间你可以看看窗外的猫咪，消磨消磨时间。然后微波炉响了，你把饭拿出来长了一口，发现还有点凉。没关系，你又把饭放了回去然后按了一下+1按钮，准备再热一分钟。可是这一次，微波炉只加热了一秒钟，而不是一分钟。这种情况就像我们总说的那样“我们什么也没改，程序就不能正常工作了”或是“上次用还好好的呢”。我们总是期望，当重复一个动作时，得到的结果也应该和之前是一样的，同样的道理也适用于函数。

假设我们想要为计算器添加减法功能，期望的输出结果如下：

```
Addition
Enter an integer: 5
Enter another integer: 9
5 + 9 = 14
Subtraction
Enter an integer: 12
Enter another integer: 3
12 - 3 = 9
```

此时你可能会考虑使用 `getInteger()` 再读取两个整数，就像做加法时一样。

```cpp
int main()
{
  std::cout << "Addition\n";

  int a{ getInteger() };
  int b{ getInteger() };

  std::cout << a << " + " << b << " = " << (a + b) << '\n';

  std::cout << "Subtraction\n";

  int c{ getInteger() };
  int d{ getInteger() };

  std::cout << c << " - " << d << " = " << (c - d) << '\n';

  return 0;
}
```

但是，这样并没有用，输出如下：

```
Addition
Enter an integer: 5
Enter another integer: 9
5 + 9 = 14
Subtraction
Enter another integer: 12
Enter another integer: 3
12 - 3 = 9
```

(输出的还是 “Enter another integer” 而不是 “Enter an integer”)

`getInteger()` 是不可重用的，因它具有某种内部状态（静态局部变量 `s_isFirstCall`），而该状态并不能够从外部被重置。`s_isFirstCall` 并不是一个需要在整个程序中保持唯一的变量，尽管上面第一个程序能够正确运行，但是静态变量阻碍了我们对函数的重用。

实现 `getInteger` 的更好的方法是将 `s_isFirstCall` 作为参数传入。这样主调函数就可以根据需求选择打印的内容。

静态局部变量适用于该变量在整个程序中（或可预见的未来）需要保持唯一性且无需对其进行重置的情况。

> [!success] "最佳实践"
> 除非变量永远不需要被重置，否则要避免使用静态局部变量
	