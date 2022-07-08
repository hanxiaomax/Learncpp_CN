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

We’ll see where this makes a difference shortly.

All elements of the array can still be accessed through the pointer (we’ll see how this works in the next lesson), but information derived from the array’s type (such as how long the array is) can not be accessed from the pointer.

However, this also effectively allows us to treat fixed arrays and pointers identically in most cases.

For example, we can dereference the array to get the value of the first element:

```cpp
int array[5]{ 9, 7, 5, 3, 1 };

// Deferencing an array returns the first element (element 0)
std::cout << *array; // will print 9!

char name[]{ "Jason" }; // C-style string (also an array)
std::cout << *name << '\n'; // will print 'J'
```

Note that we’re not _actually_ dereferencing the array itself. The array (of type int[5]) gets implicitly converted into a pointer (of type int*), and we dereference the pointer to get the value at the memory address the pointer is holding (the value of the first element of the array).

We can also assign a pointer to point at the array:

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

COPY

This works because the array decays into a pointer of type int*, and our pointer (also of type int*) has the same type.

## 指针和固定数组的差异

There are a few cases where the difference in typing between fixed arrays and pointers makes a difference. These help illustrate that a fixed array and a pointer are not the same.

The primary difference occurs when using the sizeof() operator. When used on a fixed array, sizeof returns the size of the entire array (array length * element size). When used on a pointer, sizeof returns the size of the pointer (in bytes). The following program illustrates this:

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

This program prints:

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