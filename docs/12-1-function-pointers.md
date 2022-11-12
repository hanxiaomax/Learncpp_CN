---
title: 12.1 - 函数指针
alias: 12.1 - 函数指针
origin: /function-pointers/
origin_title: "12.1 — Function Pointers"
time: 2022-9-26
type: translation
tags:
- function
---


在 [[9-6-Introduction-to-pointers|9.6 - 指针简介]] 中我们介绍了指针，指针是一个保存着其他地址变量的变量。[[function-pointer|函数指针]]也是类似的，只不过它指向的不是变量，而是一个函数！

考虑下面函数：

```cpp
int foo()
{
    return 5;
}
```

`foo` 是函数名，但是函数的类型是什么？函数有它自己的[[lvalue|左值]]函数类型——在这个例子中，函数类型是返回整型并且不接受参数。和变量类似，函数也在存放在内存中。

当函数被调用时，程序会跳转到被调用函数的地址去执行：

```cpp
int foo() // code for foo starts at memory address 0x002717f0
{
    return 5;
}

int main()
{
    foo(); // jump to address 0x002717f0

    return 0;
}
```

在你的编程生涯中可能会犯这样的错误：

```cpp
#include <iostream>

int foo() // code starts at memory address 0x002717f0
{
    return 5;
}

int main()
{
    std::cout << foo << '\n'; // we meant to call foo(), but instead we're printing foo itself!

    return 0;
}
```


本来我们是想要调用函数foo并打印它的返回值的，但是却无意中直接使用 `std::cout` 打印函数本身。此时会得到什么样的结果呢？

在笔者的机器上会输出如下结果：

```
0x002717f0
```

但是，在你的电脑上可能会打印其他值（例如 1），这取决于你的编译器如何将函数指针转换为其他类型。如果你的机器没有打印函数地址，那么你可以将函数强制转换为空指针并打印：

```cpp
#include <iostream>

int foo() // code starts at memory address 0x002717f0
{
    return 5;
}

int main()
{
    std::cout << reinterpret_cast<void*>(foo) << '\n'; // 告诉 C++ 将foo解析为空指针

    return 0;
}
```

就像可以声明一个指向普通变量的非const指针一样，也可以声明一个指向函数的非const指针。在本课的其余部分，我们将研究这些函数指针及其用法。函数指针是一个相当高级的主题，对于只希望了解C++基础知识的人来说，本课的其余部分可以安全地跳过或略过。

## 指向函数的指针


创建非const函数指针的语法是C++中最丑陋的语法之一：

```cpp
// fcnPtr is a pointer to a function that takes no arguments and returns an integer
int (*fcnPtr)();
```

上面代码中的 `fcnPtr` 上一个函数指针，它没有形参且返回整型。`fcnPtr` 可以执行任何该类型的函数。

`*fcnPtr` 两边的括号是必须的，它可以确保优先级是正确的，否则 `int* fcnPtr()`就会被解析为名为`fcnPtr`，不接受参数，返回整型指针的函数的前向声明。

创建const函数指针，需要将const关键字添加在星号后面：

```cpp
int (*const fcnPtr)();
```

如果把const放在int前面，则表示函数指针指向的函数返回一个const整型。

## 将函数赋值给函数指针

函数指针可以用函数初始化(非const函数指针可以被赋值为函数)。在上面的例子中，我们直接使用了`foo`，并且它已经被转换为一个函数指针。与指向变量的指针一样，我们也可以使用`&foo`来获得指向`foo`的函数指针。

```cpp
int foo()
{
    return 5;
}

int goo()
{
    return 6;
}

int main()
{
    int (*fcnPtr)(){ &foo }; // fcnPtr points to function foo
    fcnPtr = &goo; // fcnPtr now points to function goo

    return 0;
}
```

下面代码是一种常见的错误：

```cpp
fcnPtr = goo();
```

该行代码将 `goo()` 的返回值(类型为`int`) 赋值给 `fcnPtr` (实际期望的类型是`int(*)()`)，这并不是我们的本意。我们其实希望 `fcnPtr`被赋值为 `goo` 的地址，而不是 `goo()` 的 So no parentheses are needed.

注意，函数指针的类型（返回值和参数）必须和函数类型匹配，一些实例如下：

```cpp
// function prototypes
int foo();
double goo();
int hoo(int x);

// function pointer assignments
int (*fcnPtr1)(){ &foo }; // 对 
int (*fcnPtr2)(){ &goo }; // 错 -- 返回值类型不正确
double (*fcnPtr4)(){ &goo }; // 对 
fcnPtr1 = &hoo; // 错 -- fcnPtr1 不接受参数，和 hoo() 不匹配
int (*fcnPtr3)(int){ &hoo }; // 对
```

与基本类型不同，c++ 会在需要时隐式地将函数转换为函数指针(因此你==不需要使用address-of操作符(&)来获取函数的地址==)。但是，它不会隐式地将函数指针转换为空指针，反之亦然。

函数指针可以被初始化或赋值为 `nullptr`：

```cpp
int (*fcnptr)() { nullptr }; // 对
```

## 使用函数指针调用函数

函数指针的另一个主要功能是使用它来调用函数。通过函数指针调用函数有两个方法，一是通过显式解引用：


```cpp
int foo(int x)
{
    return x;
}

int main()
{
    int (*fcnPtr)(int){ &foo }; // Initialize fcnPtr with function foo
    (*fcnPtr)(5); // call function foo(5) through fcnPtr.

    return 0;
}
```

di'er'zecond way is via implicit dereference:

```cpp
int foo(int x)
{
    return x;
}

int main()
{
    int (*fcnPtr)(int){ &foo }; // Initialize fcnPtr with function foo
    fcnPtr(5); // call function foo(5) through fcnPtr.

    return 0;
}
```

COPY

As you can see, the implicit dereference method looks just like a normal function call -- which is what you’d expect, since normal function names are pointers to functions anyway! However, some older compilers do not support the implicit dereference method, but all modern compilers should.

One interesting note: Default parameters won’t work for functions called through function pointers. Default parameters are resolved at compile-time (that is, if you don’t supply an argument for a defaulted parameter, the compiler substitutes one in for you when the code is compiled). However, function pointers are resolved at run-time. Consequently, default parameters can not be resolved when making a function call with a function pointer. You’ll explicitly have to pass in values for any defaulted parameters in this case.

Also note that because function pointers can be set to nullptr, it’s a good idea to assert or conditionally test whether your function pointer is a null pointer before calling it. Just like with normal pointers, dereferencing a null function pointer lead to undefined behavior.

```cpp
int foo(int x)
{
    return x;
}

int main()
{
    int (*fcnPtr)(int){ &foo }; // Initialize fcnPtr with function foo
    if (fcnPtr) // make sure fcnPtr isn't a null pointer
        fcnPtr(5); // otherwise this will lead to undefined behavior

    return 0;
}
```

COPY

## 将函数作为实参传递给其他函数

One of the most useful things to do with function pointers is pass a function as an argument to another function. Functions used as arguments to another function are sometimes called **callback functions**.

Consider a case where you are writing a function to perform a task (such as sorting an array), but you want the user to be able to define how a particular part of that task will be performed (such as whether the array is sorted in ascending or descending order). Let’s take a closer look at this problem as applied specifically to sorting, as an example that can be generalized to other similar problems.

Many comparison-based sorting algorithms work on a similar concept: the sorting algorithm iterates through a list of numbers, does comparisons on pairs of numbers, and reorders the numbers based on the results of those comparisons. Consequently, by varying the comparison, we can change the way the algorithm sorts without affecting the rest of the sorting code.

Here is our selection sort routine from a previous lesson:

```cpp
#include <utility> // for std::swap

void SelectionSort(int* array, int size)
{
    // Step through each element of the array
    for (int startIndex{ 0 }; startIndex < (size - 1); ++startIndex)
    {
        // smallestIndex is the index of the smallest element we've encountered so far.
        int smallestIndex{ startIndex };

        // Look for smallest element remaining in the array (starting at startIndex+1)
        for (int currentIndex{ startIndex + 1 }; currentIndex < size; ++currentIndex)
        {
            // If the current element is smaller than our previously found smallest
            if (array[smallestIndex] > array[currentIndex]) // COMPARISON DONE HERE
            {
                // This is the new smallest number for this iteration
                smallestIndex = currentIndex;
            }
        }

        // Swap our start element with our smallest element
        std::swap(array[startIndex], array[smallestIndex]);
    }
}
```

COPY

Let’s replace that comparison with a function to do the comparison. Because our comparison function is going to compare two integers and return a boolean value to indicate whether the elements should be swapped, it will look something like this:

```cpp
bool ascending(int x, int y)
{
    return x > y; // swap if the first element is greater than the second
}
```

COPY

And here’s our selection sort routine using the ascending() function to do the comparison:

```cpp
#include <utility> // for std::swap

void SelectionSort(int* array, int size)
{
    // Step through each element of the array
    for (int startIndex{ 0 }; startIndex < (size - 1); ++startIndex)
    {
        // smallestIndex is the index of the smallest element we've encountered so far.
        int smallestIndex{ startIndex };

        // Look for smallest element remaining in the array (starting at startIndex+1)
        for (int currentIndex{ startIndex + 1 }; currentIndex < size; ++currentIndex)
        {
            // If the current element is smaller than our previously found smallest
            if (ascending(array[smallestIndex], array[currentIndex])) // COMPARISON DONE HERE
            {
                // This is the new smallest number for this iteration
                smallestIndex = currentIndex;
            }
        }

        // Swap our start element with our smallest element
        std::swap(array[startIndex], array[smallestIndex]);
    }
}
```

COPY

Now, in order to let the caller decide how the sorting will be done, instead of using our own hard-coded comparison function, we’ll allow the caller to provide their own sorting function! This is done via a function pointer.

Because the caller’s comparison function is going to compare two integers and return a boolean value, a pointer to such a function would look something like this:

```cpp
bool (*comparisonFcn)(int, int);
```

COPY

So, we’ll allow the caller to pass our sort routine a pointer to their desired comparison function as the third parameter, and then we’ll use the caller’s function to do the comparison.

Here’s a full example of a selection sort that uses a function pointer parameter to do a user-defined comparison, along with an example of how to call it:

```cpp
#include <utility> // for std::swap
#include <iostream>

// Note our user-defined comparison is the third parameter
void selectionSort(int* array, int size, bool (*comparisonFcn)(int, int))
{
    // Step through each element of the array
    for (int startIndex{ 0 }; startIndex < (size - 1); ++startIndex)
    {
        // bestIndex is the index of the smallest/largest element we've encountered so far.
        int bestIndex{ startIndex };

        // Look for smallest/largest element remaining in the array (starting at startIndex+1)
        for (int currentIndex{ startIndex + 1 }; currentIndex < size; ++currentIndex)
        {
            // If the current element is smaller/larger than our previously found smallest
            if (comparisonFcn(array[bestIndex], array[currentIndex])) // COMPARISON DONE HERE
            {
                // This is the new smallest/largest number for this iteration
                bestIndex = currentIndex;
            }
        }

        // Swap our start element with our smallest/largest element
        std::swap(array[startIndex], array[bestIndex]);
    }
}

// Here is a comparison function that sorts in ascending order
// (Note: it's exactly the same as the previous ascending() function)
bool ascending(int x, int y)
{
    return x > y; // swap if the first element is greater than the second
}

// Here is a comparison function that sorts in descending order
bool descending(int x, int y)
{
    return x < y; // swap if the second element is greater than the first
}

// This function prints out the values in the array
void printArray(int* array, int size)
{
    for (int index{ 0 }; index < size; ++index)
    {
        std::cout << array[index] << ' ';
    }

    std::cout << '\n';
}

int main()
{
    int array[9]{ 3, 7, 9, 5, 6, 1, 8, 2, 4 };

    // Sort the array in descending order using the descending() function
    selectionSort(array, 9, descending);
    printArray(array, 9);

    // Sort the array in ascending order using the ascending() function
    selectionSort(array, 9, ascending);
    printArray(array, 9);

    return 0;
}
```

COPY

This program produces the result:

```
9 8 7 6 5 4 3 2 1
1 2 3 4 5 6 7 8 9
```

Is that cool or what? We’ve given the caller the ability to control how our selection sort does its job.

The caller can even define their own “strange” comparison functions:

```cpp
bool evensFirst(int x, int y)
{
	// if x is even and y is odd, x goes first (no swap needed)
	if ((x % 2 == 0) && !(y % 2 == 0))
		return false;

	// if x is odd and y is even, y goes first (swap needed)
	if (!(x % 2 == 0) && (y % 2 == 0))
		return true;

        // otherwise sort in ascending order
	return ascending(x, y);
}

int main()
{
    int array[9]{ 3, 7, 9, 5, 6, 1, 8, 2, 4 };

    selectionSort(array, 9, evensFirst);
    printArray(array, 9);

    return 0;
}
```

COPY

The above snippet produces the following result:

```
2 4 6 8 1 3 5 7 9
```

As you can see, using a function pointer in this context provides a nice way to allow a caller to “hook” their own functionality into something you’ve previously written and tested, which helps facilitate code reuse! Previously, if you wanted to sort one array in descending order and another in ascending order, you’d need multiple versions of the sort routine. Now you can have one version that can sort any way the caller desires!

Note: If a function parameter is of a function type, it will be converted to a pointer to the function type. This means

```cpp
void selectionSort(int* array, int size, bool (*comparisonFcn)(int, int))
```

COPY

can be equivalently written as:

```cpp
void selectionSort(int* array, int size, bool comparisonFcn(int, int))
```

COPY

This only works for function parameters, not stand-alone function pointers, and so is of somewhat limited use.

## 提供默认函数

If you’re going to allow the caller to pass in a function as a parameter, it can often be useful to provide some standard functions for the caller to use for their convenience. For example, in the selection sort example above, providing the ascending() and descending() function along with the selectionSort() function would make the caller’s life easier, as they wouldn’t have to rewrite ascending() or descending() every time they want to use them.

You can even set one of these as a default parameter:

```cpp
// Default the sort to ascending sort
void selectionSort(int* array, int size, bool (*comparisonFcn)(int, int) = ascending);
```

COPY

In this case, as long as the user calls selectionSort normally (not through a function pointer), the comparisonFcn parameter will default to ascending. You will need to make sure that the `ascending` function is declared prior to this point, otherwise the compiler will complain it doesn’t know what `ascending` is.

## 使用类型别名让函数指针看起来更优雅

Let’s face it -- the syntax for pointers to functions is ugly. However, type aliases can be used to make pointers to functions look more like regular variables:

```cpp
using ValidateFunction = bool(*)(int, int);
```

COPY

This defines a type alias called “ValidateFunction” that is a pointer to a function that takes two ints and returns a bool.

Now instead of doing this:

```cpp
bool validate(int x, int y, bool (*fcnPtr)(int, int)); // ugly
```

COPY

You can do this:

```cpp
bool validate(int x, int y, ValidateFunction pfcn) // clean
```

COPY

## 使用 `std::function`

An alternate method of defining and storing function pointers is to use std::function, which is part of the standard library `<functional>` header. To define a function pointer using this method, declare a std::function object like so:

```cpp
#include <functional>
bool validate(int x, int y, std::function<bool(int, int)> fcn); // std::function method that returns a bool and takes two int parameters
```

COPY

As you see, both the return type and parameters go inside angled brackets, with the parameters inside parentheses. If there are no parameters, the parentheses can be left empty.

Updating our earlier example with `std::function`:

```cpp
#include <functional>
#include <iostream>

int foo()
{
    return 5;
}

int goo()
{
    return 6;
}

int main()
{
    std::function<int()> fcnPtr{ &foo }; // declare function pointer that returns an int and takes no parameters
    fcnPtr = &goo; // fcnPtr now points to function goo
    std::cout << fcnPtr() << '\n'; // call the function just like normal

    return 0;
}
```

COPY

Type aliasing std::function can be helpful for readability:

```cpp
using ValidateFunctionRaw = bool(*)(int, int); // type alias to raw function pointer
using ValidateFunction = std::function<bool(int, int)>; // type alias to std::function
```

COPY

Also note that std::function only allows calling the function via implicit dereference (e.g. `fcnPtr()`), not explicit dereference (e.g. `(*fcnPtr)()`).

As of C++17, CTAD can be used to deduce the template parameters of a std::function from an initializer. In the example above, we could have written `std::function fcnPtr{ &foo };` instead of `std::function<int()> fcnPtr{ &foo };` and let the compiler figure out the template type. However, CTAD doesn’t work for the type alias definitions since no initializer is provided.

## 函数指针的类型推断

Much like the `auto` keyword can be used to infer the type of normal variables, the `auto` keyword can also infer the type of a function pointer.

```cpp
#include <iostream>

int foo(int x)
{
	return x;
}

int main()
{
	auto fcnPtr{ &foo };
	std::cout << fcnPtr(5) << '\n';

	return 0;
}
```

COPY

This works exactly like you’d expect, and the syntax is very clean. The downside is, of course, that all of the details about the function’s parameters types and return type are hidden, so it’s easier to make a mistake when making a call with the function, or using its return value.

## 小结

Function pointers are useful primarily when you want to store functions in an array (or other structure), or when you need to pass a function to another function. Because the native syntax to declare function pointers is ugly and error prone, we recommend using std::function. In places where a function pointer type is only used once (e.g. a single parameter or return value), std::function can be used directly. In places where a function pointer type is used multiple times, a type alias to a std::function is a better choice (to prevent repeating yourself).