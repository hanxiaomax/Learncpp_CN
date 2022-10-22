---
title: 9.7 - 空指针
alias: 9.7 - 空指针
origin: /null-pointers/
origin_title: "9.7 — Null pointers"
time: 2022-9-22
type: translation
tags:
- pointer
---

??? note "关键点速记"

	- 指针可以通过值初始化设为空值。`int* ptr{};`
	- 当需要空指针字面量用于指针的初始化、赋值或作为参数时，可以使用 `nullptr`
	- 对空指针解引用会导致未定义行为
	- 整型值会被隐式地转换为布尔值：整型值0会被转换为布尔值`false`，而其他任何整型值都会被转换为布尔值`true`
	- 如果指针是空指针则会被转换为布尔类型false，如果不是非空指针则转换为true
	- 条件判断只能用于区分空指针与非空指针。没有方便的方法来确定非空指针是指向有效对象还是悬空指针(指向无效对象)。指针应该保存有效对象的地址，或者设置为nullptr。这样我们只需要测试指针是否为空，并且可以假设任何非空指针都是有效的。

在上节课中 ([[9-6-Introduction-to-pointers|9.6 - 指针简介]])，我们介绍了指针的基本知识——指针是一个对象，它持有另外一个对象的地址。我们可以使用[[dereference-operator|解引用操作符]]对地址进行解引用以获得该地址存放的值：

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    std::cout << x << '\n'; // print the value of variable x

    int* ptr{ &x }; // ptr holds the address of x
    std::cout << *ptr << '\n'; // use dereference operator to print the value at the address that ptr is holding (which is x's address)

    return 0;
}
```

输出结果：

```
5
5
```

在上一课中，我们还注意到指针可以不指向任何东西。在这节课中，我们将进一步探索这种指针(以及指向虚无的各种含义)。

## 空指针（Null）

除了内存地址，指针还可以保存一个额外的值：空值。空值(通常缩写为null)是一种特殊值，表示某物没有值。当指针持有空值时，意味着该指针不指向任何东西。这样的指针称为空指针。

创建空指针最简单的方法是使用值初始化:

```cpp
int main()
{
    int* ptr {}; // ptr is now a null pointer, and is not holding an address

    return 0;
}
```



!!! success "最佳实践"

	如果你不能将指针初始化为一个有效的地址，请使用值初始化将其初始化为空指针
	
因为我们可以使用赋值来改变指针所指向的对象，所以最初被设置为空的指针以后可以被更改为指向一个有效的对象:

```cpp
#include <iostream>

int main()
{
    int* ptr {}; // ptr is a null pointer, and is not holding an address

    int x { 5 };
    ptr = &x; // ptr now pointing at object x (no longer a null pointer)

    std::cout << *ptr << '\n'; // print value of x through dereferenced ptr

    return 0;
}
```

## nullptr 关键字

类似于 `true` 和 `false` 用于表示布尔字面量值，`nullptr` 关键字则用于表示空指针字面量。因此我们可以使用`nullptr`显式地将指针初始化或赋值为空值。

```cpp
int main()
{
    int* ptr { nullptr }; // can use nullptr to initialize a pointer to be a null pointer

    int value { 5 };
    int* ptr2 { &value }; // ptr2 is a valid pointer
    ptr2 = nullptr; // Can assign nullptr to make the pointer a null pointer

    someFunction(nullptr); // we can also pass nullptr to a function that has a pointer parameter

    return 0;
}
```

在上面的例子中，我们将指针 `ptr2` 的值设置为 `nullptr`，这使得`ptr2`称为一个空指针。

!!! success "最佳实践"

	当需要空指针字面量用于指针的初始化、赋值或作为参数时，可以使用 `nullptr`。

## 对空指针解引用会导致未定义行为

类似于对悬垂指针或野指针解引用，对空指针解引用也会导致未定义行为。大多数情况下，这会使你的程序崩溃。

下面的程序说明了这一点，当你运行程序时，它可能会崩溃或异常终止(来吧，尝试一下，不会搞坏你的机器的)：

```cpp
#include <iostream>

int main()
{
    int* ptr {}; // Create a null pointer
    std::cout << *ptr << '\n'; // Dereference the null pointer

    return 0;
}
```

从概念上讲，这是有道理的。对指针的解引用意味着“到指针所指向的地址并访问那里的值”。空指针没有地址。因此，当你试图访问该地址的值时，它应该做什么?

意外地解引用空指针和悬空指针是C++程序员最常犯的错误之一，并且可能是C++程序在实践中崩溃的最常见原因。


!!! warning "注意"

	无论何时使用指针，都需要格外小心，确保代码没有解引用空指针或悬浮指针，因为这将导致未定义的行为(可能导致应用程序崩溃)。
	

## 检查空指针

正如可以使用条件测试判断布尔值是`true` 还是`false` 那样，我们也可以判断一个指针的值是否是`nullptr` ：

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    int* ptr { &x };

    // pointers convert to Boolean false if they are null, and Boolean true if they are non-null
    if (ptr == nullptr) // explicit test for equivalence
        std::cout << "ptr is null\n";
    else
        std::cout << "ptr is non-null\n";

    int* nullPtr {};
    std::cout << "nullPtr is " << (nullPtr==nullptr ? "null\n" : "non-null\n"); // explicit test for equivalence

    return 0;
}
```

程序输出接过为：

```
ptr is non-null
nullPtr is null
```

在[[4-9-Boolean-values|4.9 - 布尔值]]一课中，我们知道==整型值会被隐式地转换为布尔值：整型值0会被转换为布尔值`false`，而其他任何整型值都会被转换为布尔值`true`。==

类似地，指针也会隐式转换为布尔值：空指针转换为布尔值`false` ，非空指针转换为布尔值`true` 。这样一来我们可以不必显式地测试 `nullptr` ，只使用隐式转换到布尔值来测试指针是否为空指针即可。下面的程序和之前的程序效果一样：

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    int* ptr { &x };

    // 如果指针是空指针则会被转换为布尔类型false，如果不是非空指针则转换为true
    if (ptr) // implicit conversion to Boolean
        std::cout << "ptr is non-null\n";
    else
        std::cout << "ptr is null\n";

    int* nullPtr {};
    std::cout << "nullPtr is " << (nullPtr ? "non-null\n" : "null\n"); // implicit conversion to Boolean

    return 0;
}
```

!!! warning "注意"

	条件判断只能用于区分空指针与非空指针。没有方便的方法来确定非空指针是指向有效对象还是悬空指针(指向无效对象)。


## 使用 `nullptr` 避免悬垂指针

对空指针或悬空指针的解引用将导致未定义的行为。因此，我们需要确保不在代码中做这两件事。

我们可以很容易地避免对空指针的解引用，在尝试解引用之前先对指针进行判空即可：

```cpp
// Assume ptr is some pointer that may or may not be a null pointer
if (ptr) // if ptr is not a null pointer
    std::cout << *ptr << '\n'; // okay to dereference
else
    // do something else that doesn't involve dereferencing ptr (print an error message, do nothing at all, etc...)
```

但是，悬垂指针如何判断呢？因为没有办法检测指针是否是[[dangling|悬垂]]状态，所以必须从源头上避免在程序中出现任何悬浮指针。为此，我们需要确保任何不指向有效对象的指针都被设置为`nullptr`。

这样，在对指针进行解引用之前，我们只需要测试它是否为空——如果它非空，我们就假定该指针不是[[dangling|悬垂]]的。

!!! success "最佳实践"

	指针应该保存有效对象的地址，或者设置为nullptr。这样我们只需要测试指针是否为空，并且可以假设任何非空指针都是有效的。


Unfortunately, avoiding dangling pointers isn’t always easy: when an object is destroyed, any pointers to that object will be left dangling. Such pointers are _not_ nulled automatically! It is the programmer’s responsibility to ensure that all pointers to an object that has just been destroyed are properly set to `nullptr`.

!!! warning "注意"

	When an object is destroyed, any pointers to the destroyed object will be left dangling (they will not be automatically set to `nullptr`). It is your responsibility to detect these cases and ensure those pointers are subsequently set to `nullptr`.

## Legacy null pointer literals: 0 and NULL

In older code, you may see two other literal values used instead of `nullptr`.

The first is the literal `0`. In the context of a pointer, the literal `0` is specially defined to mean a null value, and is the only time you can assign an integral literal to a pointer.

```cpp
int main()
{
    float* ptr { 0 };  // ptr is now a null pointer (for example only, don't do this)

    float* ptr2; // ptr2 is uninitialized
    ptr2 = 0; // ptr2 is now a null pointer (for example only, don't do this)

    return 0;
}
```


!!! cite "题外话"

    On modern architectures, the address `0` is typically used to represent a null pointer. However, this value is not guaranteed by the C++ standard, and some architectures use other values. The literal `0`, when used in the context of a null pointer, will be translated into whatever address the architecture uses to represent a null pointer.

Additionally, there is a preprocessor macro named `NULL` (defined in the `<cstddef>` header). This macro is inherited from C, where it is commonly used to indicate a null pointer.

```cpp
#include <cstddef> // for NULL

int main()
{
    double* ptr { NULL }; // ptr is a null pointer

    double* ptr2; // ptr2 is uninitialized
    ptr2 = NULL; // ptr2 is now a null pointer
}
```

COPY

Both `0` and `NULL` should be avoided in modern C++ (use `nullptr` instead). We discuss why in lesson [9.10 -- Pass by address (part 2)](https://www.learncpp.com/cpp-tutorial/pass-by-address-part-2/).

## Favor references over pointers whenever possible

Pointers and references both give us the ability to access some other object indirectly.

Pointers have the additional abilities of being able to change what they are pointing at, and to be pointed at null. However, these pointer abilities are also inherently dangerous: A null pointer runs the risk of being dereferenced, and the ability to change what a pointer is pointing at can make creating dangling pointers easier:

```cpp
int main()
{
    int* ptr { };

    {
        int x{ 5 };
        ptr = &x; // set the pointer to an object that will be destroyed (not possible with a reference)
    } // ptr is now dangling

    return 0;
}
```


Since references can’t be bound to null, we don’t have to worry about null references. And because references must be bound to a valid object upon creation and then can not be reseated, dangling references are harder to create.

Because they are safer, references should be favored over pointers, unless the additional capabilities provided by pointers are required.

!!! success "最佳实践"

	Favor references over pointers unless the additional capabilities provided by pointers are needed.