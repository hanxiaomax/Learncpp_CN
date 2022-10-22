---
title: 9.6 - 指针简介
alias: 9.6 - 指针简介
origin: //introduction-to-pointers/
origin_title: "9.6 — Introduction to pointers"
time: 2022-1-2
type: translation
tags:
- pointer
---

??? note "关键点速记"
	
	-

指针是 C++ 中的历史遗留产物之一，也是很多人学习C++时容易卡壳的地方。但是，稍后你会看到，其实指针并不可怕。

实际上，指针的行为和[[lvalue-reference|左值引用]]是很像的。但是在我们继续介绍之前，先来左一些准备工作。


!!! info "相关内容"

	如果你还不熟悉左值引用，现在是复习的好时机。[[9-3-Lvalue-references|9.3 - 左值引用]]、[[9-4-Lvalue-references-to-const|9.4 - const类型的左值引用]]和[[9-5-Pass-by-lvalue-reference|9.5 - 传递左值引用]]都是非常有帮助的材料。

考虑下下面代码：

```cpp
char x {}; // chars use 1 byte of memory
```


这行定义在生成代码时，RAM中的一段内存就会被指定给该对象。对于这个例子来说，假设变量x所用的内存地址为140。那么每当我们在表达式或者语句中使用x时，程序会自动地到内存地址140的地方去取值。

这么做最大的好处是我们无需关心内存地址的指定和使用，也不需要关心存放对象值使用了多少你村。我们只需要通过变量的[[identifier|标识符(identifier)]]也就是变量名即可，编译器会自动将其转换为对应的内存地址。编译器为我们代劳了全部的寻址工作。

对于引用来说也是这样：

```cpp
int main()
{
    char x {}; // assume this is assigned memory address 140
    char& ref { x }; // ref is an lvalue reference to x (when used with a type, & means lvalue reference)

    return 0;
}
```


因为 `ref` 是 `x` 的别名，所以任何使用`ref`的地方，程序仍然会到内存地址140的地方去取值。编译器同样为我们代劳了寻址的过程，我们无需操心。


## 取地址运算符 (&)

尽管在默认的情况下，变量的地址并不会暴露给用户，但该地址实际上是可以获取的。 [[address-of-operator|取地址操作符 &]] 就可以返回其操作数的地址，非常简单：

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    std::cout << x << '\n';  // print the value of variable x
    std::cout << &x << '\n'; // print the memory address of variable x

    return 0;
}
```


在笔者的电脑上返回如下结果：

```
5
0027FEA0
```


在上面的例子中，我们使用取地址运算符来获取变量x的地址并将其打印处理。内存地址通常是以十六进制值的形式打印的（参考[[4-15-Literals|4.15 - 字面量]]了解十六进制的内容），但通常不包括前缀`0x`。

对于使用内存数超过一个字节的对象，取地址会返回该段内存的首地址（第一个字节）。


!!! tip "小贴士"

	`&` 符号在不同的语境下有不同的含义，比较容易混淆：

	-   当后面接着类型名时，&表示一个左值引用: `int& ref`；
	-   当用于一元表达式时，&表示取地址运算符: `std::cout << &x`.
	-   当用于二元表达式时，&是[[bitwise-and|按位与操作]]: `std::cout << x & y`.

## 解引用运算符`*`

仅仅获得变量的地址，往往不是很有用。

对于一个地址来说，最有用的操作是获取它存放的值。[[dereference-operator|解引用运算符]]（也叫间接访问运算符），可以返回一个地址存放的值（作为左值返回）：

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    std::cout << x << '\n';  // print the value of variable x
    std::cout << &x << '\n'; // print the memory address of variable x

    std::cout << *(&x) << '\n'; // print the value at the memory address of variable x (parentheses not required, but make it easier to read)

    return 0;
}
```


在笔者机器上返回下面内容：

```
5
0027FEA0
5
```

这个程序非常简单。首先我们声明了一个变量x并且打印出它的值。然后我们打印出了变量x的地址。最后，使用解引用运算符从变量x的地址获取值（就是x的值），然后打印出来。

!!! tldr "关键信息"

	对于一个给定地址，可以使用[[dereference-operator|解引用运算符]]获取该地址保存的值（左值）

	解引用和取地址是一对相反的操作，取地址获取对象的地址，解引用从地址获取对象。

!!! tip "小贴士"

	尽管解引用看起来就像乘法，但是你可以区分它们，因为解引用操作符是一元的，而乘法操作符是二元的。


获取变量的内存地址，然后立即解引用该地址以获得值，这其实也不算是什么有用的操作(毕竟，我们可以直接访问变量的值)。

不过，在了解取地址和解引用之后，我们可以开始介绍指针了。

## 指针

A pointer is an object that holds a _memory address_ (typically of another variable) as its value. This allows us to store the address of some other object to use later.

!!! cite "题外话"

    In modern C++, the pointers we are talking about here are sometimes called “raw pointers” or “dumb pointers”, to help differentiate them from “smart pointers” that were introduced into the language more recently. We cover smart pointers in [chapter M](https://www.learncpp.com/#ChapterM).

Much like reference types are declared using an ampersand (&) character, pointer types are declared using an asterisk (*):

```cpp
int;  // a normal int
int&; // an lvalue reference to an int value

int*; // a pointer to an int value (holds the address of an integer value)
```


To create a pointer variable, we simply define a variable with a pointer type:

```cpp
int main()
{
    int x { 5 };    // normal variable
    int& ref { x }; // a reference to an integer (bound to x)

    int* ptr;       // a pointer to an integer

    return 0;
}
```

COPY

Note that this asterisk is part of the declaration syntax for pointers, not a use of the dereference operator.

!!! success "最佳实践"

	When declaring a pointer type, place the asterisk next to the type name.

## Warning

	Although you generally should not declare multiple variables on a single line, if you do, the asterisk has to be included with each variable.
	
	```cpp
	int* ptr1, ptr2;   // incorrect: ptr1 is a pointer to an int, but ptr2 is just a plain int!
	int* ptr3, * ptr4; // correct: ptr3 and p4 are both pointers to an int
	```
	
	Although this is sometimes used as an argument to not place the asterisk with the type name (instead placing it next to the variable name), it’s a better argument for avoiding defining multiple variables in the same statement.

## Pointer initialization

Like normal variables, pointers are _not_ initialized by default. A pointer that has not been initialized is sometimes called a wild pointer. Wild pointers contain a garbage address, and dereferencing a wild pointer will result in undefined behavior. Because of this, you should always initialize your pointers to a known value.

!!! success "最佳实践"

	Always initialize your pointers.

```cpp
int main()
{
    int x{ 5 };

    int* ptr;        // an uninitialized pointer (holds a garbage address)
    int* ptr2{};     // a null pointer (we'll discuss these in the next lesson)
    int* ptr3{ &x }; // a pointer initialized with the address of variable x

    return 0;
}
```

COPY

Since pointers hold addresses, when we initialize or assign a value to a pointer, that value has to be an address. Typically, pointers are used to hold the address of another variable (which we can get using the address-of operator (&)).

Once we have a pointer holding the address of another object, we can then use the dereference operator (*) to access the value at that address. For example:

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

COPY

This prints:

```
5
5
```

Conceptually, you can think of the above snippet like this:  
![](https://www.learncpp.com/images/CppTutorial/Section6/6-Pointer.png?ezimgfmt=rs:409x145/rscb2/ng:webp/ngcb2)

This is where pointers get their name from -- `ptr` is holding the address of `x`, so we say that `ptr` is “pointing to” `x`.

!!! info "作者注"

	A note on pointer nomenclature: “X pointer” (where X is some type) is a commonly used shorthand for “pointer to an X”. So when we say, “an integer pointer”, we really mean “a pointer to an integer”. This distinction will be valuable when we talk about const pointers.

Much like the type of a reference has to match the type of object being referred to, the type of the pointer has to match the type of the object being pointed to:

```cpp
int main()
{
    int i{ 5 };
    double d{ 7.0 };

    int* iPtr{ &i };     // ok: a pointer to an int can point to an int object
    int* iPtr2 { &d };   // not okay: a pointer to an int can't point to a double
    double* dPtr{ &d };  // ok: a pointer to a double can point to a double object
    double* dPtr2{ &i }; // not okay: a pointer to a double can't point to an int
}
```


With one exception that we’ll discuss next lesson, initializing a pointer with a literal value is disallowed:

```cpp
int* ptr{ 5 }; // not okay
int* ptr{ 0x0012FF7C }; // not okay, 0x0012FF7C is treated as an integer literal
```


## Pointers and assignment

We can use assignment with pointers in two different ways:

1.  To change what the pointer is pointing at (by assigning the pointer a new address)
2.  To change the value being pointed at (by assigning the dereferenced pointer a new value)

First, let’s look at a case where a pointer is changed to point at a different object:

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int* ptr{ &x }; // ptr initialized to point at x

    std::cout << *ptr << '\n'; // print the value at the address being pointed to (x's address)

    int y{ 6 };
    ptr = &y; // // change ptr to point at y

    std::cout << *ptr << '\n'; // print the value at the address being pointed to (y's address)

    return 0;
}
```

COPY

The above prints:

```
5
6
```

In the above example, we define pointer `ptr`, initialize it with the address of `x`, and dereference the pointer to print the value being pointed to (`5`). We then use the assignment operator to change the address that `ptr` is holding to the address of `y`. We then dereference the pointer again to print the value being pointed to (which is now `6`).

Now let’s look at how we can also use a pointer to change the value being pointed at:

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int* ptr{ &x }; // initialize ptr with address of variable x

    std::cout << x << '\n';    // print x's value
    std::cout << *ptr << '\n'; // print the value at the address that ptr is holding (x's address)

    *ptr = 6; // The object at the address held by ptr (x) assigned value 6 (note that ptr is dereferenced here)

    std::cout << x << '\n';
    std::cout << *ptr << '\n'; // print the value at the address that ptr is holding (x's address)

    return 0;
}
```

COPY

This program prints:

```
5
5
6
6
```

In this example, we define pointer `ptr`, initialize it with the address of `x`, and then print the value of both `x` and `*ptr` (`5`). Because `*ptr` returns an lvalue, we can use this on the left hand side of an assignment statement, which we do to change the value being pointed at by `ptr` to `6`. We then print the value of both `x` and `*ptr` again to show that the value has been updated as expected.

!!! tldr "关键信息"

	When we use a pointer without a dereference (`ptr`), we are accessing the address held by the pointer. Modifying this (`ptr = &y`) changes what the pointer is pointing at.

	When we dereference a pointer (`*ptr`), we are accessing the object being pointed at. Modifying this (`*ptr = 6;`) changes the value of the object being pointed at.

## Pointers behave much like lvalue references

Pointers and lvalue references behave similarly. Consider the following program:

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int& ref { x };  // get a reference to x
    int* ptr { &x }; // get a pointer to x

    std::cout << x;
    std::cout << ref;  // use the reference to print x's value (5)
    std::cout << *ptr << '\n'; // use the pointer to print x's value (5)

    ref = 6; // use the reference to change the value of x
    std::cout << x;
    std::cout << ref;  // use the reference to print x's value (6)
    std::cout << *ptr << '\n'; // use the pointer to print x's value (6)

    *ptr = 7; // use the pointer to change the value of x
    std::cout << x;
    std::cout << ref;  // use the reference to print x's value (7)
    std::cout << *ptr << '\n'; // use the pointer to print x's value (7)

    return 0;
}
```

COPY

This program prints:

```
555
666
777
```

In the above program, we create a normal variable `x` with value `5`, and then create an lvalue reference and a pointer to `x`. Next, we use the lvalue reference to change the value from `5` to `6`, and show that we can access that updated value via all three methods. Finally, we use the dereferenced pointer to change the value from `6` to `7`, and again show that we can access the updated value via all three methods.

Thus, both pointers and references provide a way to indirectly access another object. The primary difference is that with pointers, we need to explicitly get the address to point at, and we have to explicitly dereference the pointer to get the value. With references, the address-of and dereference happens implicitly.

There are some other differences between pointers and references worth mentioning:

-   References must be initialized, pointers are not required to be initialized (but should be).
-   References are not objects, pointers are.
-   References can not be reseated (changed to reference something else), pointers can change what they are pointing at.
-   References must always be bound to an object, pointers can point to nothing (we’ll see an example of this in the next lesson).
-   References are “safe” (outside of dangling references), pointers are inherently dangerous (we’ll also discuss this in the next lesson).

## The address-of operator returns a pointer

It’s worth noting that the address-of operator (&) doesn’t return the address of its operand as a literal. Instead, it returns a pointer containing the address of the operand, whose type is derived from the argument (e.g. taking the address of an `int` will return the address in an `int` pointer).

We can see this in the following example:

```cpp
#include <iostream>
#include <typeinfo>

int main()
{
	int x{ 4 };
	std::cout << typeid(&x).name() << '\n'; // print the type of &x

	return 0;
}
```

COPY

On Visual Studio, this printed:

int *

With gcc, this prints “pi” (pointer to int) instead. Because the result of typeid().name() is compiler-dependent, your compiler may print something different, but it will have the same meaning.

## The size of pointers

The size of a pointer is dependent upon the architecture the executable is compiled for -- a 32-bit executable uses 32-bit memory addresses -- consequently, a pointer on a 32-bit machine is 32 bits (4 bytes). With a 64-bit executable, a pointer would be 64 bits (8 bytes). Note that this is true regardless of the size of the object being pointed to:

```cpp
#include <iostream>

int main() // assume a 32-bit application
{
    char* chPtr{};        // chars are 1 byte
    int* iPtr{};          // ints are usually 4 bytes
    long double* ldPtr{}; // long doubles are usually 8 or 12 bytes

    std::cout << sizeof(chPtr) << '\n'; // prints 4
    std::cout << sizeof(iPtr) << '\n';  // prints 4
    std::cout << sizeof(ldPtr) << '\n'; // prints 4

    return 0;
}
```

COPY

The size of the pointer is always the same. This is because a pointer is just a memory address, and the number of bits needed to access a memory address is constant.

## Dangling pointers

Much like a dangling reference, a dangling pointer is a pointer that is holding the address of an object that is no longer valid (e.g. because it has been destroyed). Dereferencing a dangling pointer will lead to undefined results.

Here’s an example of creating a dangling pointer:

```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int* ptr{ &x };

    std::cout << *ptr << '\n'; // valid

    {
        int y{ 6 };
        ptr = &y;

        std::cout << *ptr << '\n'; // valid
    } // y goes out of scope, and ptr is now dangling

    std::cout << *ptr << '\n'; // undefined behavior from dereferencing a dangling pointer

    return 0;
}
```

COPY

The above program will probably print:

```
5
6
6
```

But it may not, as the object that `ptr` was pointing at went out of scope and was destroyed at the end of the inner block, leaving `ptr` dangling.

## Conclusion

Pointers are variables that hold a memory address. They can be dereferenced using the dereference operator (*) to retrieve the value at the address they are holding. Dereferencing a wild or dangling (or null) pointer will result in undefined behavior and will probably crash your application.

Pointers are both more flexible than references and more dangerous. We’ll continue to explore this in the upcoming lessons.