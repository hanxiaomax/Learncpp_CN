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

??? note "关键点速记"

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

第二种方法是通过隐式解引用：

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

如你所见，使用隐式解引用调用函数看起来和正常的函数调用一模一样，因为函数名本来就是指向函数的指针！但是，有些旧的编译器并不支持这种隐式解引用的方式，但是现代编译器都支持。

==需要注意的是：默认形参不适用于通过函数指针调用的函数。默认形参在编译时解析(也就是说，如果你没有为默认形参提供实参，编译器将在编译代码时为您提供一个实参)。但是，函数指针在运行时解析。因此，在使用函数指针进行函数调用时，无法解析默认形参。在这种情况下，必须显式地传入任何默认参数的值。==

还要注意，因为函数指针可以设置为nullptr，所以在调用函数指针之前，最好通过断言或有条件测试判断它是否是空指针。就像普通指针一样，对空函数指针的解引用会导致[[undefined-behavior|未定义行为]]。

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


## 将函数作为实参传递给其他函数

函数指针最大的用途其实是将函数作为参数传递给另外一个函数。这种作为实参传递给其他函数的函数，称为[[callback functions|回调函数]]。

考虑这样一种情况，假设正在编写一个函数来执行一项任务(例如对数组排序)，但你希望用户能够定义如何执行该任务的特定部分(例如数组是按升序还是降序排序)。让我们仔细看看这个问题是如何具体应用于排序的，作为一个可以推广到其他类似问题的例子。

许多基于比较的排序算法都基于类似的概念：排序算法遍历列表，对数字对进行比较，并基于这些比较的结果对数字进行重新排序。因此，通过改变比较方法，我们可以改变算法的排序方式，而不影响其他排序代码。

下面是之前的选择排序例子：

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

让我们用一个函数来替换这里的比较。比较函数比较两个整数并返回一个布尔值来指示元素是否应该交换，它看起来像这样:

```cpp
bool ascending(int x, int y)
{
    return x > y; // swap if the first element is greater than the second
}
```

使用 `ascending()` 函数修改后的排序算法如下：

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

现在，为了让调用者决定如何进行排序，我们不使用固定的比较函数，而是允许调用者提供他们自己的排序函数！这是通过函数指针完成的。

因为调用者的比较函数将比较两个整数并返回一个布尔值，所以指向这样一个函数的指针看起来像这样:


```cpp
bool (*comparisonFcn)(int, int);
```

因此，我们将允许调用者将一个指向他们想要的比较函数的指针作为第三个形参传递给排序例程，然后我们将使用调用者的函数进行比较。

下面是一个使用函数指针形参进行用户定义比较的选择排序的完整示例，以及如何调用它的示例：


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

运行结果如下：

```
9 8 7 6 5 4 3 2 1
1 2 3 4 5 6 7 8 9
```

酷不酷？我们给了调用者控制选择排序如何工作的能力。

调用者甚至可以定义自己的“奇怪的”比较函数：

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

运行结果如下：

```
2 4 6 8 1 3 5 7 9
```

如你所见，在此上下文中使用函数指针是一种很好方式，调用者可以将自己的功能“挂钩”到你以前编写和测试过的内容中，这有助于促进代码重用！以前，如果希望按降序排列一个数组，按升序排列另一个数组，则需要多个版本的排序例程。现在你可以编写一个版本并按调用者希望的任何方式排序！

注意：==如果函数形参是函数类型的，它将被转换为指向函数类型的指针==。这意味着：

```cpp
void selectionSort(int* array, int size, bool (*comparisonFcn)(int, int))
```

等价于：

```cpp
void selectionSort(int* array, int size, bool comparisonFcn(int, int))
```

这只适用于函数形参，而不适用于独立的函数指针，因此使用比较有限。


## 提供默认函数

如果你要允许调用方将函数作为参数传入，那么为调用方提供一些标准函数以方便使用通常是很有用的。例如，在上面的选择排序示例中，提供`ascending()`和`descending()`函数以及`selectionSort()`函数将使调用者的工作更加轻松，因为他们不必每次想要使用`ascending()`和`descending()`函数时都重写它们。

你甚至可以设置其中一个作为默认参数：

```cpp
// Default the sort to ascending sort
void selectionSort(int* array, int size, bool (*comparisonFcn)(int, int) = ascending);
```

在这个例子中，如果用户正常调用 `selectionSort` （不使用函数指针），`comparisonFcn` [[parameters|形参]]默认是升序的。你必须确保 `ascending` 函数在此之前被定义，否则编译器将会报告 `ascending` 找不到。

## 使用类型别名让函数指针看起来更优雅

实话实说——函数指针的语法的确很难看。不过，==[[type-aliases|类型别名]]可以用来使指向函数的指针看起来更像常规变量==：

```cpp
using ValidateFunction = bool(*)(int, int);
```

类型别名 “ValidateFunction” 是一个指向函数的指针，该指针接受两个整型形参并返回一个bool类型值。

此时我们就可以不这样做：

```cpp
bool validate(int x, int y, bool (*fcnPtr)(int, int)); // 丑陋
```

你可以这样做：

```cpp
bool validate(int x, int y, ValidateFunction pfcn) // 优雅
```


## 使用 `std::function`

定义和存储函数指针还有一个办法，即使用 `std::function`，它定义在标准库 `<functional>` 头文件中。可以将函数指针定义为一个 `std::function` 对象：

```cpp
#include <functional>
bool validate(int x, int y, std::function<bool(int, int)> fcn); // std::function method that returns a bool and takes two int parameters
```

如你所见，返回值类型定义在尖括号中，参数类型则被定义在括号中。如果没有参数的话，括号可以留空。

使用 `std::function` 更新之前的例子：

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

类型别名也可以帮助 `std::function` 提高可读性：

```cpp
using ValidateFunctionRaw = bool(*)(int, int); // type alias to raw function pointer
using ValidateFunction = std::function<bool(int, int)>; // type alias to std::function
```

需要注意的是，`std::function`只允许通过隐式解引用(e.g. `fcnPtr()`)调用函数，而不支持显示解引用调用函数 (e.g. `(*fcnPtr)()`)。

C++17 中[[10-11-class-template-argument-deduction-and-deduction -guides|类模板参数推断CTAD]] 可以用来从初始化值直接推断 `std::function` 的类型。在上面的例子中，我们就可以写 `std::function fcnPtr{ &foo };`而不需要写 `std::function<int()> fcnPtr{ &foo };` ，让编译器自己推断模板参数。但是 CTAD 并不能在定义类型别名时使用，因为此时我们并没有提供初始化值。

## 函数指针的类型推断

`auto` 关键字可以推断普通变量类型，`auto` 关键字也可以推断函数指针类型。

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

这完全符合您的预期，而且语法非常简洁。当然，缺点是关于函数的形参类型和返回类型的所有细节都是隐藏的，因此在调用函数或使用其返回值时很容易出错。

## 小结

如果你希望将函数存储在数组(或其他结构)中，或者需要将函数传递给另一个函数时，函数指针非常有用。因为声明函数指针的语法很难看而且容易出错，我们建议使用`std::function`。在函数指针类型只使用一次的地方(例如单个形参或返回值)，可以直接使用`std::function`。在多次使用函数指针类型的地方，创建`std::function`的类型别名则是更好的选择。
