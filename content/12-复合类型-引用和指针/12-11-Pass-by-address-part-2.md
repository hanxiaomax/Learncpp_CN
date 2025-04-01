---
title: 12.11 - 按地址传递 Part2
alias: 12.11 - 按地址传递 Part2
origin: /pass-by-address-part-2/
origin_title: "9.10 — Pass by address part 2"
time: 2022-9-7
type: translation
tags:
- pointer
- address
---

本节课继续[[12-10-Pass-by-address|12.10 - 按地址传递]]的内容。

## “可选”参数按地址传递

传递地址的一个更常见的用途是允许函数接受一个“可选”参数。举例说明比描述更容易：

```cpp
#include <iostream>
#include <string>

void greet(std::string* name=nullptr)
{
    std::cout << "Hello ";
    std::cout << (name ? *name : "guest") << '\n';
}

int main()
{
    greet(); // we don't know who the user is yet

    std::string joe{ "Joe" };
    greet(&joe); // we know the user is joe

    return 0;
}
```

程序输出：

```
Hello guest
Hello Joe
```

在这个程序中，`greet()` 函数的参数是按地址传递的，且具有默认值 `nullptr`。在  `main()` 函数中，我们两次调用该函数。第一次调用时，我们不知道用户是谁，所以调用`greet()` 时没有传递任何[[arguments|实参]]，此时参数 `name` 使用默认值 `nullptr`，函数打印 “guest”。 第二次调用时，我们传递了一个有效的用户—— `greet(&joe)`。此时 `name` 参数通过地址得到了`joe`，函数使用它打印了用户名 “Joe”。

然而，在许多情况下，函数重载是实现相同结果的更好选择：

```cpp
#include <iostream>
#include <string>
#include <string_view>

void greet(std::string_view name)
{
    std::cout << "Hello " << name << '\n';
}

void greet()
{
    greet("guest");
}

int main()
{
    greet(); // we don't know who the user is yet

    std::string joe{ "Joe" };
    greet(joe); // we know the user is joe

    return 0;
}
```


这样做有很多好处：我们不再需要担心[[dereference-operator|解引用]]空指针，而且如果需要的话，我们可以传入字符串字面量。

## 改变指针参数指向的值

当将地址传递给函数时，该地址将从实参复制到指针形参中(这很好，因为复制地址非常快)。现在考虑下面的程序:

```cpp
#include <iostream>

// \[\[maybe_unused\]\] gets rid of compiler warnings about ptr2 being set but not used
void nullify(\[\[maybe_unused\]\] int* ptr2)
{
    ptr2 = nullptr; // Make the function parameter a null pointer
}

int main()
{
    int x{ 5 };
    int* ptr{ &x }; // ptr points to x

    std::cout << "ptr is " << (ptr ? "non-null\n" : "null\n");

    nullify(ptr);

    std::cout << "ptr is " << (ptr ? "non-null\n" : "null\n");
    return 0;
}
```

程序输出：

```
ptr is non-null
ptr is non-null
```

如你所见，修改[[parameters|形参]]指针的地址对[[arguments|实参]]没有影响(`ptr` 仍然指向 `x`)。当调用函数 `nullify()` 被调用时 `ptr2` 拷贝了一份 `ptr` 所持有的地址（指向`x`）。当函数修改 `ptr2` 的值时，它只是修改了这份拷贝的副本罢了。

如果我们想让函数改变指针参数的指向，该怎么办呢？


## 通过引用传地址？Pass by address… by reference?

是的，可以这么做。就像可以通过引用传递普通变量一样，也可以通过[[pass-by-reference|按引用传递]]指针。
在下面的例子中，我们通过引用传递 `ptr2` 指向的地址：

```cpp
#include <iostream>

void nullify(int*& refptr) // refptr is now a reference to a pointer
{
    refptr = nullptr; // Make the function parameter a null pointer
}

int main()
{
    int x{ 5 };
    int* ptr{ &x }; // ptr points to x

    std::cout << "ptr is " << (ptr ? "non-null\n" : "null\n");

    nullify(ptr);

    std::cout << "ptr is " << (ptr ? "non-null\n" : "null\n");
    return 0;
}
```

运行结果：

```
ptr is non-null
ptr is null
```

因为 `refptr` 是一个指针的引用，所以当 `ptr` 传入时，`refptr` 被绑定`ptr`。这意味着任何对 `refptr` 的修改都会作用于 `ptr`。

> [!cite] "题外话"
> 因为对指针的引用相当罕见，其语法很容易混淆(它是 `int*&` 还是 `int&*`  ?)好消息是，如果反向操作，编译器将出错，因为不能有指向引用的指针(因为指针必须保存对象的地址，而引用不是对象)。然后你可以把它换过来。

## 为什么现在不推荐使用 `0` 或 `NULL` 表示空指针了？（选读）

在本小节中，我们将解释为什么不再使用`0` 或`NULL` 。

字面量“`0`”既可以被解释为整数[[literals|字面量]]，也可以被解释为空指针字面量。在某些情况下，想要区分其准确含义并不容易——在一些情况下，编译器可能认为我们指的是其中一个含义，而我们指的是另一个——这会给程序的行为带来意想不到的后果。

[[preprocessor|预处理器]]宏 `NULL` 并没有在标准中明确定义，它的值可能是 `0`, `0L`, `((void*)0)`, 或其他值。

在课程[[11-1-Introduction-to-function-overloading|11.1 - 函数重载]]中，我们介绍了函数[[overload|重载]](多个函数可以具有相同的名称，只要它们可以通过形参的数量或类型来区分)。编译器可以通过作为函数调用一部分传入的参数来确定您想要哪个重载函数。

这种情况下使用 `0` 或 `NULL` 时可能带来问题：

```cpp
#include <iostream>
#include <cstddef> // 定义了 NULL

void print(int x) // 函数接受整数
{
	std::cout << "print(int): " << x << '\n';
}

void print(int* ptr) // 接受一个整型指针
{
	std::cout << "print(int*): " << (ptr ? "non-null\n" : "null\n");
}

int main()
{
	int x{ 5 };
	int* ptr{ &x };

	print(ptr);  // 总是调用 print(int*) 因为ptr类型为 int* (good)
	print(0);    // 总是调用 print(int) 因为 0 是一个整型字面量 (但愿这是我们所希望的)

	print(NULL); // 这个语句可能做以下任何事：
	// 调用 print(int) (Visual Studio 会这么做)
	// 调用 print(int*)
	// 导致歧义，引发编译错误(gcc 和 Clang 会这么做)

	print(nullptr); // 总是调用 print(int*)

	return 0;
}
```


在笔者的电脑上(使用 Visual Studio)，打印：

```
print(int*): non-null
print(int): 0
print(int): 0
print(int*): null
```

当传递参数0时，编译器会优先调用 `print(int)` 而不是 `print(int*)`，这可能会导致问题，如果我们的本意是希望使用空指针并调用 `print(int*)` 的话。

在 `NULL` 被定义为值 `0` 的情况下，`print(NULL)` 也会调用 `print(int)` ，而不是 `print(int*)` ，就像你期望的NULL指针字面量一样。在 `NULL` 没有定义为 `0` 的情况下，可能会导致其他行为，如调用 `print(int*)` 或编译错误。

使用 `nullptr` 可以避免这种二义性(它总是会导致函数 `print(int*)` 被调用)，因为  `nullptr` 只能匹配指针类型。

## `std::nullptr_t` (选读)

因为 `nullptr` 可以在重载函数中区分与整型值，所以它必定属于另外一种类型。那么，`nullptr` 是什么类型呢？实际上， `nullptr` 的类型为 `std::nullptr_t` (定义在 `<cstddef>`)。`std::nullptr_t` 只能保存一个值：`nullptr`！尽管有人觉得这很蠢，但是有一种情况下是有用的。如果我们需要定义一个函数并且只接收 `nullptr` **字面量**实参，则可以让形参为 `std::nullptr_t` 类型。

```cpp
#include <iostream>
#include <cstddef> // for std::nullptr_t

void print(std::nullptr_t)
{
    std::cout << "in print(std::nullptr_t)\n";
}

void print(int*)
{
    std::cout << "in print(int*)\n";
}

int main()
{
    print(nullptr); // calls print(std::nullptr_t)

    int x { 5 };
    int* ptr { &x };

    print(ptr); // calls print(int*)

    ptr = nullptr;
    print(ptr); // calls print(int*) (since ptr has type int*)

    return 0;
}
```


在上面的例子中，函数调用 `print(nullptr)` 会被解析为 `print(std::nullptr_t)` 而不是 `print(int*)` ，因为前者无需类型转换即可匹配。

有一种情况可能会让人有点困惑，那就是当 `ptr` 值为`nullptr`时调用 `print(ptr)` 。记住，函数重载匹配的是类型，而不是值，`ptr` 的类型是 `int*` 。因此，`print(int*)` 将被匹配。`print(std::nullptr_t)` 在这种情况下甚至不需要考虑，因为指针类型不会隐式转换为 `std::nullptr_t` 。

你可能永远都不需要使用它，但为了以防万一，知道它是很好的。

## 其实都是按值传递

现在您已经理解了通过引用、地址和值传递之间的基本区别，让我们暂时简化一下。：）

虽然编译器通常可以将引用优化掉，但在有些情况下，这是不可能的，而引用实际上是需要的。引用通常由编译器使用指针实现。这意味着，在幕后，引用传递本质上只是地址传递(对引用的访问执行隐式解引用)。

在上一课中，我们提到过，通过地址传递只是将一个地址从调用者复制到被调用函数——它只是按值传递一个地址。

因此，我们可以得出这样的结论：C++确实是按值传递所有内容的！ [[pass-by-address|按地址传递]]或[[pass-by-reference|按引用传递]]的参数，其特别之处只在于传递进来的地址可以被解引用，所以能通过它修改实参，而普通形参不能做到这一点。
