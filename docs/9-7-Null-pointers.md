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
	- 当需要空指针字面量用于指针的初始化、赋值或作为参数时，可以使用 `nullptr`。

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

类似于对悬垂指针或野指针解引用，对空指针解引用也会导致未定义行为。大多数情况下， like dereferencing a dangling (or wild) pointer leads to undefined behavior, dereferencing a null pointer also leads to undefined behavior. In most cases, it will crash your application.

The following program illustrates this, and will probably crash or terminate your application abnormally when you run it (go ahead, try it, you won’t harm your machine):

```cpp
#include <iostream>

int main()
{
    int* ptr {}; // Create a null pointer
    std::cout << *ptr << '\n'; // Dereference the null pointer

    return 0;
}
```

COPY

Conceptually, this makes sense. Dereferencing a pointer means “go to the address the pointer is pointing at and access the value there”. A null pointer doesn’t have an address. So when you try to access the value at that address, what should it do?

Accidentally dereferencing null and dangling pointers is one of the most common mistakes C++ programmers make, and is probably the most common reason that C++ programs crash in practice.

Warning

Whenever you are using pointers, you’ll need to be extra careful that your code isn’t dereferencing null or dangling pointers, as this will cause undefined behavior (probably an application crash).

Checking for null pointers

Much like we can use a conditional to test Boolean values for `true` or `false`, we can use a conditional to test whether a pointer has value `nullptr` or not:

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

COPY

The above program prints:

ptr is non-null
nullPtr is null

In lesson [4.9 -- Boolean values](https://www.learncpp.com/cpp-tutorial/boolean-values/), we noted that integral values will implicitly convert into Boolean values: an integral value of `0` converts to Boolean value `false`, and any other integral value converts to Boolean value `true`.

Similarly, pointers will also implicitly convert to Boolean values: a null pointer converts to Boolean value `false`, and a non-null pointer converts to Boolean value `true`. This allows us to skip explicitly testing for `nullptr` and just use the implicit conversion to Boolean to test whether a pointer is a null pointer. The following program is equivalent to the prior one:

```cpp
#include <iostream>

int main()
{
    int x { 5 };
    int* ptr { &x };

    // pointers convert to Boolean false if they are null, and Boolean true if they are non-null
    if (ptr) // implicit conversion to Boolean
        std::cout << "ptr is non-null\n";
    else
        std::cout << "ptr is null\n";

    int* nullPtr {};
    std::cout << "nullPtr is " << (nullPtr ? "non-null\n" : "null\n"); // implicit conversion to Boolean

    return 0;
}
```

COPY

Warning

Conditionals can only be used to differentiate null pointers from non-null pointers. There is no convenient way to determine whether a non-null pointer is pointing to a valid object or dangling (pointing to an invalid object).

Use nullptr to avoid dangling pointers

Above, we mentioned that dereferencing a pointer that is either null or dangling will result in undefined behavior. Therefore, we need to ensure our code does not do either of these things.

We can easily avoid dereferencing a null pointer by using a conditional to ensure a pointer is non-null before trying to dereference it:

```cpp
// Assume ptr is some pointer that may or may not be a null pointer
if (ptr) // if ptr is not a null pointer
    std::cout << *ptr << '\n'; // okay to dereference
else
    // do something else that doesn't involve dereferencing ptr (print an error message, do nothing at all, etc...)
```

COPY

But what about dangling pointers? Because there is no way to detect whether a pointer is dangling, we need to avoid having any dangling pointers in our program in the first place. We do that by ensuring that any pointer that is not pointing at a valid object is set to `nullptr`.

That way, before dereferencing a pointer, we only need to test whether it is null -- if it is non-null, we assume the pointer is not dangling.

Best practice

A pointer should either hold the address of a valid object, or be set to nullptr. That way we only need to test pointers for null, and can assume any non-null pointer is valid.

Unfortunately, avoiding dangling pointers isn’t always easy: when an object is destroyed, any pointers to that object will be left dangling. Such pointers are _not_ nulled automatically! It is the programmer’s responsibility to ensure that all pointers to an object that has just been destroyed are properly set to `nullptr`.

Warning

When an object is destroyed, any pointers to the destroyed object will be left dangling (they will not be automatically set to `nullptr`). It is your responsibility to detect these cases and ensure those pointers are subsequently set to `nullptr`.

Legacy null pointer literals: 0 and NULL

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

COPY

As an aside…

On modern architectures, the address `0` is typically used to represent a null pointer. However, this value is not guaranteed by the C++ standard, and some architectures use other values. The literal `0`, when used in the context of a null pointer, will be translated into whatever address the architecture uses to represent a null pointer.

Additionally, there is a preprocessor macro named `NULL` (defined in the <cstddef> header). This macro is inherited from C, where it is commonly used to indicate a null pointer.

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

Favor references over pointers whenever possible

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

COPY

Since references can’t be bound to null, we don’t have to worry about null references. And because references must be bound to a valid object upon creation and then can not be reseated, dangling references are harder to create.

Because they are safer, references should be favored over pointers, unless the additional capabilities provided by pointers are required.

Best practice

Favor references over pointers unless the additional capabilities provided by pointers are needed.