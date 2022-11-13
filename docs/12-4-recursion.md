---
title: 12.4 - 递归
alias: 12.4 - 递归
origin: /recursion/
origin_title: "12.4 — Recursion"
time: 2022-10-3
type: translation
tags:
- recursion
---

在 C++ 中，自己调用自己的函数称为递归函数。下面这个例子是一个递归函数的例子（不佳的写法）：

```cpp
#include <iostream>

void countDown(int count)
{
    std::cout << "push " << count << '\n';
    countDown(count-1); // countDown() calls itself recursively
}

int main()
{
    countDown(5);

    return 0;
}
```


当 `countDown(5)` 被调用时，打印了 “push 5”。然后 `countDown(4)` 被调用，它打印 “push 4” 并调用 `countDown(3)`。`countDown(3)` 会打印 “push 3” 并调用 `countDown(2)`。`countDown(n)` 调用的一系列 `countDown(n-1)`，形成的递归调用等价于一个死循环。

在 [[12-2-the-stack-and-the-heap|12.2 - 栈和堆]] 中我们学过，所有的函数调用都需要将相应的数据放在调用栈上。因为 `countDown()` 函数从不返回（只是不断地调用 `countDown()`)，因此相关的函数信息从来没有被从栈上弹出过。因此，在到达某个极限时，计算机就会耗尽栈上内存，进而发生堆栈溢出，程序崩溃。在笔者的机器上，程序会在count到-11732时崩溃！

## 递归的终止条件

递归函数调用的工作方式通常与普通函数调用一样。然而，上面的程序说明了递归函数最重要的区别：递归函数必须包含递归终止条件，否则它们将“永远”运行(实际上，直到调用堆栈耗尽内存)。递归终止条件——当满足该条件时，将导致递归函数停止调用自身。

递归终止条件通常涉及使用if语句。下面是我们的函数重新设计了一个终止条件(和一些额外的输出)：

```cpp
#include <iostream>

void countDown(int count)
{
    std::cout << "push " << count << '\n';

    if (count > 1) // termination condition
        countDown(count-1);

    std::cout << "pop " << count << '\n';
}

int main()
{
    countDown(5);
    return 0;
}
```

运行程序，`countDown()` 会开始打印：

```
push 5
push 4
push 3
push 2
push 1
```

如果你现在查看调用栈，你会看到以下内容：

```
countDown(1)
countDown(2)
countDown(3)
countDown(4)
countDown(5)
main()
```

由于终止条件存在，`countDown(1)`不调用`countDown(0)`——相反，" if语句"不执行，因此它打印" pop 1 "，然后终止。此时，从栈中弹出`countDown(1)`，控制返回`countDown(2)`。`countDown(2)`在`countDown(1)`被调用后继续执行，因此它打印" pop 2 "然后终止。递归函数调用随后从堆栈中弹出，直到所有的`countDown`实例都被删除。

因此，程序打印的完整结果如下：

```
push 5
push 4
push 3
push 2
push 1
pop 1
pop 2
pop 3
pop 4
pop 5
```

值得注意的是，“push”输出是按前向顺序发生的，因为它们发生在递归函数调用之前。“pop”输出以相反的顺序出现，因为它们出现在递归函数调用之后，因为函数从栈中弹出(其发生的顺序与放入它们的顺序相反)。


## 更有用的例子

现在我们已经讨论了递归函数调用的基本机制，让我们看看另一个更典型的递归函数:

```cpp
// return the sum of all the integers between 1 (inclusive) and sumto (inclusive)
// returns 0 for negative numbers
int sumTo(int sumto)
{
    if (sumto <= 0)
        return 0; // base case (termination condition) when user passed in an unexpected argument (0 or negative)
    if (sumto == 1)
        return 1; // normal base case (termination condition)

    return sumTo(sumto - 1) + sumto; // recursive function call
}
```

仅通过观察递归程序通常很难理解递归调用。当我们调用具有特定值的递归函数时，看看会发生什么通常是有指导意义的。让我们看看当我们调用这个参数为`sumto = 5` 的函数时会发生什么。

```
sumTo(5) called, 5 <= 1 is false, so we return sumTo(4) + 5.
sumTo(4) called, 4 <= 1 is false, so we return sumTo(3) + 4.
sumTo(3) called, 3 <= 1 is false, so we return sumTo(2) + 3.
sumTo(2) called, 2 <= 1 is false, so we return sumTo(1) + 2.
sumTo(1) called, 1 <= 1 is true, so we return 1.  This is the termination condition.
```

现在我们展开调用栈(在返回时将每个函数从调用栈中弹出):

```
sumTo(1) returns 1.
sumTo(2) returns sumTo(1) + 2, which is 1 + 2 = 3.
sumTo(3) returns sumTo(2) + 3, which is 3 + 3 = 6.
sumTo(4) returns sumTo(3) + 4, which is 6 + 4 = 10.
sumTo(5) returns sumTo(4) + 5, which is 10 + 5 = 15.
```

这里可以很明显的看出，每次相加值会递增1，然后再加上传入的值。

因为单看递归函数可能很难理解，所以好的注释特别重要。

注意，在上面的例子中，我们使用了 `sumto - 1` 而不是 `--sumto`。这是因为 `operator--` 是有副作用的，而在一个表达式中多次使用一个有副作用的变量会导致[[undefined-behavior|未定义行为]]。使用 `sumto - 1` 可以避免副作用，使得 `sumto` 可以安全地在一个表达式中多次使用。

## 递归算法

使用递归函数解决问题的思路如下：首先找到问题子集的解(递归地)，然后修改子解以得到解。在上述算法中，sumTo(value)首先求解sumTo(value-1)，然后将变量value的值相加，求出sumTo(value)的解。

Recursive functions typically solve a problem by first finding the solution to a subset of the problem (recursively), and then modifying that sub-solution to get to a solution. In the above algorithm, sumTo(value) first solves sumTo(value-1), and then adds the value of variable value to find the solution for sumTo(value).

In many recursive algorithms, some inputs produce trivial outputs. For example, sumTo(1) has the trivial output 1 (you can calculate this in your head), and does not benefit from further recursion. Inputs for which an algorithm trivially produces an output is called a **base case**. Base cases act as termination conditions for the algorithm. Base cases can often be identified by considering the output for an input of 0, 1, “”, ”, or null.

**Fibonacci numbers**

One of the most famous mathematical recursive algorithms is the Fibonacci sequence. Fibonacci sequences appear in many places in nature, such as branching of trees, the spiral of shells, the fruitlets of a pineapple, an uncurling fern frond, and the arrangement of a pine cone.

Here is a picture of a Fibonacci spiral:  
![](https://www.learncpp.com/images/CppTutorial/Section7/Fibonacci.png?ezimgfmt=rs:802x497/rscb2/ng:webp/ngcb2)

Each of the Fibonacci numbers is the length of the side of the square that the number appears in.

Fibonacci numbers are defined mathematically as:

```
F(n) =

0 if n = 0  
1 if n = 1  
f(n-1) + f(n-2) if n > 1
```

Consequently, it’s rather simple to write a (not very efficient) recursive function to calculate the nth Fibonacci number:

```cpp
#include <iostream>

int fibonacci(int count)
{
    if (count == 0)
        return 0; // base case (termination condition)
    if (count == 1)
        return 1; // base case (termination condition)
    return fibonacci(count-1) + fibonacci(count-2);
}

// And a main program to display the first 13 Fibonacci numbers
int main()
{
    for (int count { 0 }; count < 13; ++count)
        std:: cout << fibonacci(count) << ' ';

    return 0;
}
```

COPY

Running the program produces the following result:

0 1 1 2 3 5 8 13 21 34 55 89 144

Which you will note are exactly the numbers that appear in the Fibonacci spiral diagram.

## 记忆化算法

The above recursive Fibonacci algorithm isn’t very efficient, in part because each call to a Fibonacci non-base case results in two more Fibonacci calls. This produces an exponential number of function calls (in fact, the above example calls fibonacci() 1205 times!). There are techniques that can be used to reduce the number of calls necessary. One technique, called **memoization**, caches the results of expensive function calls so the result can be returned when the same input occurs again.

Here’s a memoized version of the recursive Fibonacci algorithm:

```cpp
#include <iostream>
#include <vector>

// h/t to potterman28wxcv for a variant of this code
int fibonacci(int count)
{
	// We'll use a static std::vector to cache calculated results
	static std::vector results{ 0, 1 };

	// If we've already seen this count, then use the cache'd result
	if (count < static_cast<int>(std::size(results)))
		return results[count];

	// Otherwise calculate the new result and add it
	results.push_back(fibonacci(count - 1) + fibonacci(count - 2));
	return results[count];
}

// And a main program to display the first 13 Fibonacci numbers
int main()
{
	for (int count { 0 }; count < 13; ++count)
		std::cout << fibonacci(count) << ' ';

	return 0;
}
```

COPY

This memoized version makes 35 function calls, which is much better than the 1205 of the original algorithm.

## 递归和迭代

One question that is often asked about recursive functions is, “Why use a recursive function if you can do many of the same tasks iteratively (using a _for loop_ or _while loop_)?”. It turns out that you can always solve a recursive problem iteratively -- however, for non-trivial problems, the recursive version is often much simpler to write (and read). For example, while it’s possible to write the Fibonacci function iteratively, it’s a little more difficult! (Try it!)

Iterative functions (those using a for-loop or while-loop) are almost always more efficient than their recursive counterparts. This is because every time you call a function there is some amount of overhead that takes place in pushing and popping stack frames. Iterative functions avoid this overhead.

That’s not to say iterative functions are always a better choice. Sometimes the recursive implementation of a function is so much cleaner and easier to follow that incurring a little extra overhead is more than worth it for the benefit in maintainability, particularly if the algorithm doesn’t need to recurse too many times to find a solution.

In general, recursion is a good choice when most of the following are true:

-   The recursive code is much simpler to implement.
-   The recursion depth can be limited (e.g. there’s no way to provide an input that will cause it to recurse down 100,000 levels).
-   The iterative version of the algorithm requires managing a stack of data.
-   This isn’t a performance-critical section of code.

However, if the recursive algorithm is simpler to implement, it may make sense to start recursively and then optimize to an iterative algorithm later.

!!! success "最佳实践"

	Generally favor iteration over recursion, except when recursion really makes sense.