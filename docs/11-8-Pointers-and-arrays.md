---
title: 11.8 - 指针和数组
alias: 11.8 - 指针和数组
origin: /pointers-and-arrays/
origin_title: "11.8 — Pointers and arrays"
time: 2022-6-15
type: translation
tags:
- array
- pointer
---

??? note "关键点速记"
	- 在表达式中使用数组时，数组会**退化**（隐式转换）为一个指针

在 C++ 中，指针和数组本质上是相互联系的。

## 数组退化

在之前的课程中，我们学习了如何定义一个固定长度的数组：

```cpp
int array[5]{ 9, 7, 5, 3, 1 }; // declare a fixed array of 5 integers
```

对于我们来说，这是一个包含五个整数的数组，但是对于编译器来说，它是一个 `int[5]`类型的数组。我们可以知道`array[0]`,` array[1]`, `array[2]`, `array[3]`, 和 `array[4]` 的值 (分别为 9、7、5、3 和 1 )。

在几乎所有情况下（两种例外情况稍后介绍），当我们在表达式中使用数组时，数组会**退化**（隐式转换）为一个指针。参考下面代码：

```cpp
#include <iostream>

int main()
{
    int array[5]{ 9, 7, 5, 3, 1 };

    // 打印数组的首地址
    std::cout << "Element 0 has address: " << &array[0] << '\n';

    // 打印数组退化后的指针
    std::cout << "The array decays to a pointer holding address: " << array << '\n';


    return 0;
}
```

在笔者的电脑上会打印如下内容：

```
Element 0 has address: 0042FD5C
The array decays to a pointer holding address: 0042FD5C
```

认为数组和指向数组的指针完全一样是一个常见的错误。它们并不是。在上面的例子中，数组的类型是“`int[5]`”它的值就是数组的各个元素。而指向数组的指针，其类型为“`int*`”，其值为数组首个元素的地址。

稍后我们就会介绍它们的具体区别体现在哪里。

数组中的元素也可以通过指针来访问（下节课中进行详细介绍），但是我们不能通过指针来获取数组的类型信息。

然而，在大多数情况下，我们还是可以以相同的方式对待固定数组和指针。

例如，可以对数组解引用以获取第一个元素的值:

```cpp
int array[5]{ 9, 7, 5, 3, 1 };

// Deferencing an array returns the first element (element 0)
std::cout << *array; // will print 9!

char name[]{ "Jason" }; // C-style string (also an array)
std::cout << *name << '\n'; // will print 'J'
```


注意，我们没有对数组本身进行解引用。数组被隐式转换为了指针(`int*`类型)，并对指针解引用，以获得指针所保存的内存地址的值(数组第一个元素的值)。

我们还可以让一个指针指向数组：

```cpp
#include <iostream>

int main()
{
    int array[5]{ 9, 7, 5, 3, 1 };
    std::cout << *array << '\n'; // will print 9

    int* ptr{ array };
    std::cout << *ptr << '\n'; // will print 9

    return 0;
}
```

数组退化为了`int*`类型的指针，而`ptr`也是此类型的指针。

## 指针和固定数组的差异

There are a few cases where the difference in typing between fixed arrays and pointers makes a difference. These help illustrate that a fixed array and a pointer are not the same.

The primary difference occurs when using the `sizeof()` operator. When used on a fixed array, sizeof returns the size of the entire array (`array length * element size`). When used on a pointer, sizeof returns the size of the pointer (in bytes). The following program illustrates this:

在一些情况下，固定数组和指针之间的类型差异会带来问题。这些问题有助于我们解释固定数组和指针的不同。

主要的差异发生在使用 `sizeof()` 操作符时。当用于固定数组时，`sizeof`返回整个数组的大小(`array length * element size`)。当用于指针时，sizeof返回指针的大小(以字节为单位)。下面的程序说明了这一点:


```cpp
#include <iostream>

int main()
{
    int array[5]{ 9, 7, 5, 3, 1 };

    std::cout << sizeof(array) << '\n'; // will print sizeof(int) * array length

    int* ptr{ array };
    std::cout << sizeof(ptr) << '\n'; // will print the size of a pointer

    return 0;
}
```

程序打印：

```
20
4
```

A fixed array knows how long the array it is pointing to is. A pointer to the array does not.

The second difference occurs when using the address-of operator (&). Taking the address of a pointer yields the memory address of the pointer variable. Taking the address of the array returns a pointer to the entire array. This pointer also points to the first element of the array, but the type information is different (in the above example, the type of `&array` is `int(*)[5]`). It’s unlikely you’ll ever need to use this.

```cpp
#include <iostream>

int main()
{
    int array[5]{ 9, 7, 5, 3, 1 };
    std::cout << array << '\n';	 // type int[5], prints 009DF9D4
    std::cout << &array << '\n'; // type int(*)[5], prints 009DF9D4

    std::cout << '\n';

    int* ptr{ array };
    std::cout << ptr << '\n';	 // type int*, prints 009DF9D4
    std::cout << &ptr << '\n';	 // type int**, prints 009DF9C8

    return 0;
}
// h/t to reader PacMan for this example
```

COPY

## Revisiting passing fixed arrays to functions

Back in lesson [11.2 -- Arrays (Part II)](https://www.learncpp.com/cpp-tutorial/arrays-part-ii/), we mentioned that because copying large arrays can be very expensive, C++ does not copy an array when an array is passed into a function. When passing an array as an argument to a function, a fixed array decays into a pointer, and the pointer is passed to the function:

```cpp
#include <iostream>

void printSize(int* array)
{
    // array is treated as a pointer here
    std::cout << sizeof(array) << '\n'; // prints the size of a pointer, not the size of the array!
}

int main()
{
    int array[]{ 1, 1, 2, 3, 5, 8, 13, 21 };
    std::cout << sizeof(array) << '\n'; // will print sizeof(int) * array length

    printSize(array); // the array argument decays into a pointer here

    return 0;
}
```

COPY

This prints:

```
32
4
```

Note that this happens even if the parameter is declared as a fixed array:

```cpp
#include <iostream>

// C++ will implicitly convert parameter array[] to *array
void printSize(int array[])
{
    // array is treated as a pointer here, not a fixed array
    std::cout << sizeof(array) << '\n'; // prints the size of a pointer, not the size of the array!
}

int main()
{
    int array[]{ 1, 1, 2, 3, 5, 8, 13, 21 };
    std::cout << sizeof(array) << '\n'; // will print sizeof(int) * array length

    printSize(array); // the array argument decays into a pointer here

    return 0;
}
```

COPY

This prints:

```
32
4
```

In the above example, C++ implicitly converts parameters using the array syntax ([]) to the pointer syntax (*). That means the following two function declarations are identical:

```cpp
void printSize(int array[]);
void printSize(int* array);
```

COPY

Some programmers prefer using the [] syntax because it makes it clear that the function is expecting an array, not just a pointer to a value. However, in most cases, because the pointer doesn’t know how large the array is, you’ll need to pass in the array size as a separate parameter anyway (strings being an exception because they’re null terminated).

We recommend using the pointer syntax, because it makes it clear that the parameter is being treated as a pointer, not a fixed array, and that certain operations, such as sizeof(), will operate as if the parameter is a pointer.

Best practice

Favor the pointer syntax (*) over the array syntax ([]) for array function parameters.

## 传地址

[[pass-by-address|传地址]]
The fact that arrays decay into pointers when passed to a function explains the underlying reason why changing an array in a function changes the actual array argument passed in. Consider the following example:

```cpp
#include <iostream>

// parameter ptr contains a copy of the array's address
void changeArray(int* ptr)
{
    *ptr = 5; // so changing an array element changes the _actual_ array
}

int main()
{
    int array[]{ 1, 1, 2, 3, 5, 8, 13, 21 };
    std::cout << "Element 0 has value: " << array[0] << '\n';

    changeArray(array);

    std::cout << "Element 0 has value: " << array[0] << '\n';

    return 0;
}
```

```
Element 0 has value: 1
Element 0 has value: 5
```

When changeArray() is called, array decays into a pointer, and the value of that pointer (the memory address of the first element of the array) is copied into the ptr parameter of function changeArray(). Although the value in ptr is a copy of the address of the array, ptr still points at the actual array (not a copy!). Consequently, when dereferencing ptr, the element accessed is the actual first element of the array!

Astute readers will note this phenomenon works with pointers to non-array values as well.

## 结构体和类中的数组不会退化

Finally, it is worth noting that arrays that are part of structs or classes do not decay when the whole struct or class is passed to a function. This yields a useful way to prevent decay if desired, and will be valuable later when we write classes that utilize arrays.

In the next lesson, we’ll take a look at pointer arithmetic, and talk about how array indexing actually works.