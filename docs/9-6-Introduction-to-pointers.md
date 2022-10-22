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
	
	- 指针和引用之间还有一些值得一提的区别：
		-   引用必须被初始化，指针并不是必须初始化（但是你应该初始化）；
		-   引用不是对象，指针是对象； 
		-   引用不能被重新设置（修改引用使其绑定到其他对象），指针则可以被修改指向其他对象；
		-   引用总是绑定到某个对象，指针可以不执行任何对象；
		-   引用是”安全“的（除了[[dangling|悬垂]]引用），指针则是危险的。

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

指针可以看做是一个持有内存地址的对象（通常是其他对象的地址）。这使得我们可以在后面的代码中使用该地址。

!!! cite "题外话"

    在现代 C++ 中，我们此处谈论的指针被称为[[raw-pointer|原始指针]]或[[dumb-pointer|笨指针]]，以便将其与[[smart-pointer|智能指针]]区别开来。智能指针会在[chapter M](https://www.learncpp.com/#ChapterM)介绍。

和使用&定义引用的做法类似，指针类型使用`*`来定义：

```cpp
int;  // a normal int
int&; // an lvalue reference to an int value

int*; // a pointer to an int value (holds the address of an integer value)
```

要创建指针变量，只需定义一个指针类型的变量:

```cpp
int main()
{
    int x { 5 };    // normal variable
    int& ref { x }; // a reference to an integer (bound to x)

    int* ptr;       // a pointer to an integer

    return 0;
}
```

注意，这个星号是指针声明语法的一部分，而不是使用解引用操作符。

!!! success "最佳实践"

	声明指针类型时，在类型名称旁边加上星号。

!!! warning "注意"

	尽管通常情况下我们不应该在一行定义多个变量，但是如果需要这么做，则每个指针变量前面都需要星号
	
	```cpp
	int* ptr1, ptr2;   // incorrect: ptr1 is a pointer to an int, but ptr2 is just a plain int!
	int* ptr3, * ptr4; // correct: ptr3 and p4 are both pointers to an int
	```
	虽然这个例子时常被作为”星号不应该与类型名放在一起“的论据，但我们倒不如说这是一个”不应在一行中定义多个变量的“例子。

## 指针的初始化

和普通的变量不同，==指针默认是不初始化的==。一个没有被初始化的指针，有时称为[[wild-pointer|野指针]]。野指针中存放的是一个无用的地址，对野指针解引用会导致[[undefined-behavior|未定义行为]]。因此，我们一定要将指针初始化为一个已知的值。

!!! success "最佳实践"

	指针必须初始化。

```cpp
int main()
{
    int x{ 5 };

    int* ptr;        // 一个未初始化的指针 (存放这无效地址)
    int* ptr2{};     // 一个空指针 (稍后讨论这种情况)
    int* ptr3{ &x }; // 指针，初始化为变量x的地址

    return 0;
}
```

由于指针保存的是地址，所以其初始化值必须是一个地址。通常，指针用于保存另一个变量的地址(可以使用取地址操作符(&)获取)。

一旦我们有了一个持有另一个对象地址的指针，我们就可以使用解引用操作符`*`来访问该地址的值。例如:


```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    std::cout << x << '\n'; // 打印变量 x 的值

    int* ptr{ &x }; // ptr 保存着 x 的地址
    std::cout << *ptr << '\n'; // 使用解引用操作符打印该地址的内容

    return 0;
}
```

输出结果：

```
5
5
```


形象一点来看，上面的代码片段是这样的：

![](https://www.learncpp.com/images/CppTutorial/Section6/6-Pointer.png?ezimgfmt=rs:409x145/rscb2/ng:webp/ngcb2)


这就是指针名称的由来——`ptr` 保存着`x` 的地址，所以我们说`ptr` 是“指向`x` 。

!!! info "作者注"

	关于指针命名的注意事项:“X指针”(其中X是某种类型)是“指向X的指针”的常用缩写。所以当我们说“一个整数指针”时，我们实际上是指“一个指向整型变量的指针”。当我们讨论const指针时，这种区别就很重要了。
	
就像引用的类型必须匹配被引用对象的类型一样，指针的类型必须匹配被指向对象的类型:


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


除了一个例外，我们将在下一课讨论，用字面量初始化指针是不允许的：

```cpp
int* ptr{ 5 }; // 不可以
int* ptr{ 0x0012FF7C }; // 不可以, 0x0012FF7C 被看做整型字面量
```


## 指针和赋值

在谈论指针的赋值时，可能有两种含义：

1.  改变指针的值使其指向其他地址（给指针赋值一个新地址）； 
2.  改变指针所指内容的值（给指针解引用的结果赋新值）。

首先，让我们看看指针被更改为指向另一个对象的情况:


```cpp
#include <iostream>

int main()
{
    int x{ 5 };
    int* ptr{ &x }; // ptr 初始化为指向 x

    std::cout << *ptr << '\n'; // 打印地址值(x的地址)

    int y{ 6 };
    ptr = &y; // // ptr 更改为指向 y

    std::cout << *ptr << '\n'; // 打印地址值 (y的地址)

    return 0;
}
```

打印：

```
5
6
```

在上面的例子中，我们定义了指针`ptr` 并用x的地址初始化它。对指针解引用以打印被指向的值(`5`)。然后使用赋值操作符将`ptr` 保存的地址更改为y的地址。然后再次解引用该指针以打印被指向的值(现在是`6` )。

现在让我们看看如何使用指针来改变被指向的值：

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

输出结果：

```
5
5
6
6
```

在这个例子中，我们首先定义了指针`ptr`，它的初始化为变量`x`的地址，然后打印了 `x` 和 `*ptr` 的值(`5`)。因为`*ptr` 返回的是左值，所我们可以把它用在赋值号的左侧，这样就可以将`ptr` 所指的变量的值修改为 `6`。然后，再次打印 `x` 和 `*ptr`以便确定我们的修改是否生效。

!!! tldr "关键信息"

	在使用指针时，如果不同时使用[[dereference-operator|解引用]]的时候，我们使用的是指针存放的地址。修改该地址就可以改变指针的指向 (`ptr = &y`)。

	当对指针应用解引用时(`*ptr`)，我们访问的则是指针所指的对象。修改(`*ptr = 6;`) 它可以改变该变量的值。 

## 指针和左值引用很像

指针和左值引用的行为类似。考虑下面的程序：

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

程序运行结果：

```
555
666
777
```

在上面的程序中，我们创建了一个值为5的普通变量`x`，然后创建一个左值引用和一个指向`x`的指针。接下来，我们使用左值引用将值从5更改为6，并说明我们可以通过所有三个方法访问更新后的值。最后，我们使用解引用的指针将值从6改为7，并再次表明我们可以通过所有三种方法访问更新后的值。

因此，指针和引用都提供了间接访问另一个对象的方法。主要的区别在于，对于指针，我们需要显式地获取要指向的地址，并且显式地解引用指针来获取值。对于引用，地址和解引用都是隐式进行的。

指针和引用之间还有一些值得一提的区别：

-   引用必须被初始化，指针并不是必须初始化（但是你应该初始化）；
-   引用不是对象，指针是对象； 
-   引用不能被重新设置（修改引用使其绑定到其他对象），指针则可以被修改指向其他对象；
-   引用总是绑定到某个对象，指针可以不执行任何对象；
-   引用是”安全“的（除了[[dangling|悬垂]]引用），指针则是危险的。

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