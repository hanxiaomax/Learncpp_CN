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
	- 当定义函数的参数时，最好使用指针语法(`*`)而不是数组语法(`[]`)。
	- 数组退化为指针传递到函数后，修改该指针会修改原数组
	- 作为结构或类的一部分的数组不会在将整个结构或类传递给函数时发生退化。如果有需要，可以用这种方式防止数组退化为指针。


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

在一些情况下，固定数组和指针之间的类型差异会带来问题。这些问题有助于我们解释固定数组和指针的不同。

主要的差异发生在使用 `sizeof()` 操作符时。当用于固定数组时，`sizeof`返回整个数组的大小(`array length * element size`)。当用于指针时，`sizeof` 返回指针的大小(以字节为单位)。下面的程序说明了这一点:

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

固定数组知道它所指向的数组有多长，而指向数组的指针并不知道数组有多长。

第二个区别发生在使用取地址操作符(`&`)时。对指针使用取地址操作符，会得到指针变量的内存地址。对数组使用取地址操作符，将返回指向地址的指针，这个指针指向数组的第一个元素，但是类型信息不同(在上面的例子中，`&array`的类型是`int(*)[5]`)。你不太可能会用到它。

```cpp
#include <iostream>

int main()
{
    int array[5]{ 9, 7, 5, 3, 1 };
    std::cout << array << '\n';	 // 类型为 int[5], 打印 009DF9D4
    std::cout << &array << '\n'; // 类型为 int(*)[5], 打印 009DF9D4

    std::cout << '\n';

    int* ptr{ array };
    std::cout << ptr << '\n';	 // 类型为 int*, 打印 009DF9D4
    std::cout << &ptr << '\n';	 // 类型为 int**, 打印 009DF9C8

    return 0;
}
// h/t to reader PacMan for this example
```


## 将固定数组传递给函数

在[[11-2-Arrays-Part-II|11.2 - 数组（第二部分）]]中我们介绍过，拷贝大型数组的开销是很大的，C++在将数组传递给函数时，并不会将其拷贝一份。实际上，固定数组在传递给函数时也会退化为指针，该指针会被传递给函数：

```cpp hl_lines="3"
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


```
32
4
```

注意，即使形参声明为固定数组，也会发生这种情况：

```cpp hl_lines="4"
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

打印结果为：

```
32
4
```

在上面的例子中，C++ 隐式地将使用数组语法(`[]`)的参数转换为指针语法(`*`)。这意味着下面两个函数的声明是相同的：

```cpp
void printSize(int array[]);
void printSize(int* array);
```

有些程序员更喜欢使用`[]`语法，因为它可以清楚地表明函数需要一个数组，而不是一个指针。然而，在大多数情况下，由于指针并不知道数组有多大，所以无论如何都需要将数组大小作为一个单独的参数来传递(字符串是一个特例，因为它们以`null`结尾)。

我们建议使用指针语法，因为它表明形参被视为指针，而不是固定的数组。此外，某些操作（如 `sizeof()`）会将该形参作为指针进行操作。

!!! success "最佳实践"

	当定义函数的参数时，最好使用指针语法(`*`)而不是数组语法(`[]`)。


## 传地址

数组在传递给函数时**退化**为指针的事实，解释了为什么在函数中更改数组会更改传入的实际数组。考虑下面的例子:

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


当 `changeArray()` 被调用时，数组退化为一个指针，该指针的值(数组第一个元素的内存地址)被复制到`changeArray()` 函数的`ptr`形参中。虽然`ptr`中的值是数组地址的副本，但`ptr`仍然指向实际的数组(不是副本!)因此，当对`ptr`解引用时，访问的元素实际上是数组的第一个元素!

精明的读者会注意到这种现象也适用于指向非数组值的指针。


## 结构体和类中的数组不会退化

最后，值得注意的是，作为结构或类的一部分的数组不会在将整个结构或类传递给函数时发生退化。如果有需要，可以用这种方式防止数组退化为指针。在编写利用数组的类时，这种方法也是有用的

在下一课中，我们介绍指针算术，并讨论数组索引的工作原理。