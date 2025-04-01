---
title: 6.4 - 自增自减运算符及其副作用
alias: 6.4 - 自增自减运算符及其副作用
origin: /increment-decrement-operators-and-side-effects/
origin_title: "5.4 — Increment/decrement operators, and side effects"
time: 2021-12-2
type: translation
tags:
- operator
---


> [!note] "Key Takeaway"
> - 后缀版本的运算符多了很多步骤（需要创建一个副本），因此它的性能不如前缀版本
> - 强烈推荐使用前缀版本的递增递减运算符，因为它们性能更好，而且也不容易带来问题
> - 因为 C++ 标准没有规定函数参数的求值顺序。所以 `add(x, ++x)`这样的函数调用结果是不确定的，因为函数 `add`的其中一个参数具有副作用。
> - C++ 没有定义函数参数或运算符操作数的求值顺序。


## 变量的自增自减

将一个变量递增（加1）和递减（减1）都是非常常见的操作，因此它们有专门的运算符。


|运算符	|符号	|形式	|操作|
|---|---|---|---|
|Prefix increment (pre-increment)	|++	|++x	|Increment x, then return x
|Prefix decrement (pre-decrement)	|––	|––x	|Decrement x, then return x
|Postfix increment (post-increment)	|++	|x++	|Copy x, then increment x, then return the copy
|Postfix decrement (post-decrement)|––	|x––	|Copy x, then decrement x, then return the copy


注意，每种操作符都有两个版本，一个是前缀形式（运算符在操作符前面），一个是后缀形式（运算符在操作符后面）。 

前缀递增/递减操作符非常简单，即操作数先递增或递减，然后表达式再求值。例如：

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    int y = ++x; // x is incremented to 6, x is evaluated to the value 6, and 6 is assigned to y

    std::cout << x << ' ' << y;
    return 0;
}
```

打印结果：

```
6 6
```

后缀自增/自减稍微有点复杂。首先，它拷贝了一份操作数，然后对操作数（而不是它的拷贝）进行递增或递减。最后对拷贝的值（而非原始值）进行求值，例如：

```cpp hl_lines="6"
#include <iostream>

int main()
{
    int x { 5 };
    int y = x++; // x 自增为6，拷贝的最初的值为5,5被赋值给了y

    std::cout << x << ' ' << y;
    return 0;
}
```

打印结果：

```
6 5
```

让我们介绍一下第六行是如何工作的。首先，创建一个 `x` 的临时拷贝，值和x一样（5）。随后，这个拷贝被返回然后赋值给 `y`。然后，这个临时的拷贝就被丢弃了。

因此，`y` 最终的值就是 5（递增前的值），然后 x 的值变成了 6（递增后的值）。

注意，后缀版本的运算符多了很多步骤，因此它的性能不如前缀版本。


下面的例子演示了前缀递增递减和后缀递增递减的不同：

```cpp hl_lines="8 10"
#include <iostream>

int main()
{
    int x{ 5 };
    int y{ 5 };
    std::cout << x << ' ' << y << '\n';
    std::cout << ++x << ' ' << --y << '\n'; // prefix
    std::cout << x << ' ' << y << '\n';
    std::cout << x++ << ' ' << y-- << '\n'; // postfix
    std::cout << x << ' ' << y << '\n';

    return 0;
}
```

输出结果如下：

```
5 5
6 4
6 4
6 4
7 3
```

在第八行中，我们使用了前缀递增递减。因此这一行中 x 和 y 先递增，再打印，因此它们更新后的值被打印了出来。


在第十行中，我们使用的是后缀递增递减。因此这一行中，x 和 y 先被拷贝，然后打印。所以我们没有看到递增后的结果被打印出来。递增的结果只有再下一次打印时才能有所体现。

> [!success] "最佳实践"
> 强烈推荐使用前缀版本的递增递减运算符，因为它们性能更好，而且也不容易带来问题。
	
## 副作用

如果我们说一个函数或表达式具有副作用，则意味着它执行后带来了某些影响且这些影响在函数或表达式的生命周期结束后还存在。

副作用的典型例子包括对象的值被改变、进行了输入输出或者更新了图形用户界面（例如打开或关闭某个按钮）。

很多时候，副作用是有用的：

```cpp
x = 5; // the assignment operator modifies the state of x
++x; // operator++ modifies the state of x
std::cout << x; // operator<< modifies the state of the console
```

上面赋值号的副作用是永久地改变了 `x` 的值，即使在赋值语句结束执行后，`x` 的值也还是 5。同样的，`++`运算符也有副作用，`++x`执行后 `x` 的值就递增了。打印 `x` 同样有副作用，它改变了控制台的状态，因为你可以看到 `x` 的值被打印到了控制台。

不过，副作用有时候也会带来意想不到的结果：

```cpp
#include <iostream>

int add(int x, int y)
{
    return x + y;
}

int main()
{
    int x{ 5 };
    int value{ add(x, ++x) }; // 究竟是 5 + 6 还是 6 + 6?
    // 这取决于你的编译器如何选择函数参数的求值顺序

    std::cout << value << '\n'; // value 可能是 11 或者 12，取决于编译器
    return 0;
}
```


因为 C++ 标准没有规定函数参数的求值顺序。如果左边的参数先求值，则实际调用为`add(5,6)`，结果为 11。如果右边的参数先求值，则实际调用为`add(6,6)`，结果为 12。造成这个问题的原因，是因为函数 `add`的其中一个参数具有副作用。

> [!cite] "题外话"
> C++ 标准故意没有定义这些事情，这样编译器可以根据计算机的体系结构选择最自然（一般也是最高效）的方式来处理。

C++ 标准没有规定求值顺序的场景还有一些（例如操作数的求值顺序），所以不同的编译器行为也可能是不一样的。即使C++标准能够明确这些问题，由于历史原因，这里也是编译器bug多发之地。通常，这些问题是可以避免的，只要你避免不要让副作用多次作用在一个变量上。

> [!warning] "注意"
> C++ 没有定义函数参数或运算符操作数的求值顺序。
	
> [!warning] "注意"
> 在一个语句中，不要让副作用多次作用在一个变量上。如果这么做的话，结果可能是不确定的。