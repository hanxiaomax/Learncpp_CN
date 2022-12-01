---
title: 6.5 - 变量遮蔽
alias: 6.5 - 变量遮蔽
origin: /variable-shadowing-name-hiding/
origin_title: "6.5 — Variable shadowing (name hiding)"
time: 2021-6-28
type: translation
tags:
- variable shadowing
---

??? note "Key Takeaway"

	- 内外代码块中如果有同名的变量，那么在两个变量都有效的作用域中，内层定义的变量会临时屏蔽外层定义的变量
	- 在内层嵌套块中，是没有办法直接访问已经被临时屏蔽的外层变量的。
	- 当局部变量和全局变量重名时，它也会在局部变量的作用域中奖全局变量临时屏蔽,不过，因为全局变量属于全局命名空间的一部分，我们可以使用没有前缀的[[scope-resolution-operator|作用域解析运算符]](`::`)告诉编译器去查找全局变量而不是局部变量。
	- 全局变量名具有“g_” 前缀的时候，不容易发生变量遮蔽
	- 避免变量遮蔽


各个块定义了自己的作用域。所以如果我们在一个嵌套块中定义一个变量，而在其外层块中，有一个同名的变量，此时会发生什么？当两个变量都在作用域中时，嵌套块中的变量会将外层块中的同名变量隐藏起来，称为变量隐藏或变量遮蔽（shadowing）。


## 局部变量的遮蔽

```cpp
#include <iostream>

int main()
{ // 外层块
    int apples { 5 }; // 外层块中的 apples

    { // 嵌套块
        // 此处的 apples 指的是外层的 apples
        std::cout << apples << '\n'; // 打印外层的 apples 的值

        int apples{ 0 }; // 在嵌套块中定义 apples

        // 从此，apples 指的是嵌套块中的 apples
        // 外层的 apples 暂时被屏蔽了

        apples = 10; // 将 10 赋值给嵌套块中的 apples

        std::cout << apples << '\n'; // 打印嵌套块的 apples 的值
    } // 嵌套块的 apples 销毁


    std::cout << apples << '\n'; // 打印外层的 apples 的值

    return 0;
} // 外层块的 apples 销毁
```

执行上述代码，打印结果如下：

```
5
10
5
```

在上面的程序中，我们首先在外层块中声明了一个名为`apples`的变量。这个变量在嵌套块中也是可见的，可以看到它的值能够正确打印出来(5)。 然后我们在嵌套块中声明了一个不同的变量（但名字仍然是 `apples`）。从这时开始到嵌套块的结尾，`apples`指的就是嵌套层的`apples`而不是外层的 `apples`。

因此，当我们将 `10` 赋值给 `apples`时，我们赋值的是内层块的`apples`。然后打印`apples`，得到结果10，等到内层块结束时，`apples`就销毁了。但是，外层块的`apples`并不会受影响，所以我们在外层块中仍然可以打印 `apples` (`5`)。

注意，如果我们没有在内层块中定义 `apples`，那么内层块中的`apples`指的仍然是外层的`apples`。这种情况下对 `apples`赋值10，则接收该值的也是外层定义的`apples`：

```cpp
#include <iostream>

int main()
{ // outer block
    int apples{5}; // here's the outer block apples

    { // nested block
        // apples refers to outer block apples here
        std::cout << apples << '\n'; // print value of outer block apples

        // no inner block apples defined in this example

        apples = 10; // this applies to outer block apples

        std::cout << apples << '\n'; // print value of outer block apples
    } // outer block apples retains its value even after we leave the nested block

    std::cout << apples << '\n'; // prints value of outer block apples

    return 0;
} // outer block apples destroyed
```

执行上述代码，打印结果如下：

```
5
10
10
```

在内层嵌套块中，是没有办法直接访问已经被临时屏蔽的外层变量的。

## 全局变量的遮蔽

当局部变量和全局变量重名时，它也会在局部变量的作用域中奖全局变量临时屏蔽：

```cpp
#include <iostream>
int value { 5 }; // global variable

void foo()
{
    std::cout << "global variable value: " << value << '\n'; // value is not shadowed here, so this refers to the global value
}

int main()
{
    int value { 7 }; // hides the global variable value until the end of this block

    ++value; // increments local value, not global value

    std::cout << "local variable value: " << value << '\n';

    foo();

    return 0;
} // local value is destroyed
```

打印结果：

```
local variable value: 8
global variable value: 5
```

不过，因为全局变量属于全局命名空间的一部分，我们可以使用没有前缀的[[scope-resolution-operator|作用域解析运算符]](`::`)告诉编译器去查找全局变量而不是局部变量。


```cpp
#include <iostream>
int value { 5 }; // global variable

int main()
{
    int value { 7 }; // hides the global variable value
    ++value; // increments local value, not global value

    --(::value); // decrements global value, not local value (parenthesis added for readability)

    std::cout << "local variable value: " << value << '\n';
    std::cout << "global variable value: " << ::value << '\n';

    return 0;
} // local value is destroyed
```

打印结果：

```
local variable value: 8
global variable value: 4
```

## 避免变量遮蔽

通常情况下应该避免变量遮蔽， 因为它容易引起变量误用的错误。很多编译器会在检测到变量遮蔽时发出告警。

也正是处于这个原因，我们推荐避免局部变量和全局变量的遮蔽。不过，如果你的全局变量名具有“g_” 前缀的话，这通常是很容易避免的。

!!! success "最佳实践"

	避免变量遮蔽