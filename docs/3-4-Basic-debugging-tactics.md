---
title: 3.4 — 基本代码调试技术
alias: 3.4 — 基本代码调试技术
origin: /basic-debugging-tactics/
origin_title: "3.4 — Basic debugging tactics"
time: 2022-1-2
type: translation
tags:
- debugging 
---

在上一课中，我们探索了一种通过运行程序和使用猜测来查找问题所在的策略。本节课我们将探索一些用于猜测和收集信息以帮助发现问题的基本策略。

## Debug 技术 1：注释掉代码

先从一个简单的问题开始。如果程序表现出错误的行为，我们可以注释掉一些代码，看看问题是否仍然存在。如果问题仍然存在，则注释掉的代码肯定没有问题。

考虑以下代码：

```cpp
int main()
{
    getNames(); // ask user to enter a bunch of names
    doMaintenance(); // do some random stuff
    sortNames(); // sort them in alphabetical order
    printNames(); // print the sorted list of names

    return 0;
}
```

假设这个程序应该按字母顺序打印用户输入的名字，但它却按相反的字母顺序打印。问题在哪里? `getNames` 是否输入了错误的名称？`sortNames` 是否将它们反向排序？还是 `printNames` 打印的顺序不对？以上任何一种猜测都有可能，但是 `domainmaintenance()` 多半与问题无关，所以可以先将其注释掉。

```cpp
int main()
{
    getNames(); // ask user to enter a bunch of names
//    doMaintenance(); // do some random stuff
    sortNames(); // sort them in alphabetical order
    printNames(); // print the sorted list of names

    return 0;
}
```

如果问题消失了，那么 `domainance` 反倒是有问题的，到时候再注意力集中在那里。

不过，问题很可能还会存在，因此 `doMaintenance` 不是错误的根源，我们可以从搜索中排除整个函数。这并不能帮助我们理解实际问题是发生在 `doMaintenance` 调用之前还是之后，但终归是缩小了范围。

不要忘记注释掉了哪些函数，以便以后可以取消注释!

## Debug 技术 2：验证代码流程

复杂程序中另一个常见的问题是程序调用一个函数的次数太多或过少(包括根本不调用)。

在这种情况下，将语句放在函数的顶部以打印函数名会很有帮助。这样，当程序运行时，就可以打印出调用了哪些函数。

!!! tip "小贴士"

	当打印用于调试目的的信息时，使用`std::cerr`而不是`std::cout`。这样做的一个原因是`std::cout`可能会被缓冲，这意味着在要求`std::cout`打印信息和它实际打印信息之间可能会有一个时间差。如果使用`std::cout`进行打印然后程序立即崩溃，那么`std::cout`可能还没有来得及打印。这可能会误导你。另一方面，`std::cerr`是无缓冲的，这意味着发送给它的任何内容都将立即打印。这有助于确保所有调试输出尽快出现(以一些性能为代价，我们在调试时通常不关系性能)。

	使用 `std::cerr` 也可以表明该打印信息和错误流程有关。


考虑以下不能正常工作的程序：

```cpp
#include <iostream>

int getValue()
{
	return 4;
}

int main()
{
    std::cout << getValue;

    return 0;
}
```

你必须关闭 “将警告当做错误处理” 的编译选项，才能编译该代码。

虽然我们期望这个程序打印值 4，但它实际打印了 `1`。

在 Visual Studio (或者其他编译器)上，也可能打印：

```
00101424
```

添加一些调试语句：

```cpp
#include <iostream>

int getValue()
{
std::cerr << "getValue() called\n";
	return 4;
}

int main()
{
std::cerr << "main() called\n";
    std::cout << getValue;

    return 0;
}
```

!!! tip "小贴士"

	在添加临时调试语句时，不缩进会很有帮助。这样在不需要时可以很方便的找到它们并删除。

现在，函数执行时会打印对应的函数名：

```cpp
main() called
1
```

可以看到 `getValue` 根本没被调用过。那么肯定是调用该函数的代码出了问题。仔细看看那行代码：

```cpp
std::cout << getValue;
```

哦，看，我们忘记了函数调用的括号。它应该是：

```cpp
#include <iostream>

int getValue()
{
std::cerr << "getValue() called\n";
	return 4;
}

int main()
{
std::cerr << "main() called\n";
    std::cout << getValue(); // added parenthesis here

    return 0;
}
```

这样一来就没问题了：

```
main() called
getValue() called
4
```

此时可以删除临时调试语句了。

## Debug 技术 3： 打印值

对于某些类型的错误，程序可能计算或传递了错误的值。

我们还可以输出变量(包括参数)或表达式的值，以确保它们是正确的。

考虑下面的程序，它应该把两个数字相加，但实际上并不是：

```cpp
#include <iostream>

int add(int x, int y)
{
	return x + y;
}

void printResult(int z)
{
	std::cout << "The answer is: " << z << '\n';
}

int getUserInput()
{
	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
	return x;
}

int main()
{
	int x{ getUserInput() };
	int y{ getUserInput() };

	std::cout << x << " + " << y << '\n';

	int z{ add(x, 5) };
	printResult(z);

	return 0;
}
```

输出结果不正确：

```
Enter a number: 4
Enter a number: 3
4 + 3
The answer is: 9
```

结果不对，但你能发现错误吗？即使在这个简短的程序中，问题也很难被发现。接下来添加一些代码来打印变量的值：

```cpp
#include <iostream>

int add(int x, int y)
{
	return x + y;
}

void printResult(int z)
{
	std::cout << "The answer is: " << z << '\n';
}

int getUserInput()
{
	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
	return x;
}

int main()
{
	int x{ getUserInput() };
std::cerr << "main::x = " << x << '\n';
	int y{ getUserInput() };
std::cerr << "main::y = " << y << '\n';

	std::cout << x << " + " << y << '\n';

	int z{ add(x, 5) };
std::cerr << "main::z = " << z << '\n';
	printResult(z);

	return 0;
}
```

输出：

```
Enter a number: 4
main::x = 4
Enter a number: 3
main::y = 3
4 + 3
main::z = 9
The answer is: 9
```

变量 `x` 和 `y` 的值都是正确的，但是`z`的值不正确。所以问题肯定在这附近，这样一来`add`函数就非常可疑了。

修改一下`add`函数：

```cpp
#include <iostream>

int add(int x, int y)
{
std::cerr << "add() called (x=" << x <<", y=" << y << ")\n";
	return x + y;
}

void printResult(int z)
{
	std::cout << "The answer is: " << z << '\n';
}

int getUserInput()
{
	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
	return x;
}

int main()
{
	int x{ getUserInput() };
std::cerr << "main::x = " << x << '\n';
	int y{ getUserInput() };
std::cerr << "main::y = " << y << '\n';

	std::cout << x << " + " << y << '\n';

	int z{ add(x, 5) };
std::cerr << "main::z = " << z << '\n';
	printResult(z);

	return 0;
}
```

输出结果：

```
Enter a number: 4
main::x = 4
Enter a number: 3
main::y = 3
add() called (x=4, y=5)
main::z = 9
The answer is: 9
```

变量 `y` 的值是3，但是我们的函数 `add` 的参数 `y` 的值是`5`。我们肯定传递了错误的参数。果然：

```cpp
int z{ add(x, 5) };
```

找到了！在调用`add`函数的时候我们传递了字面量 5 而不是变量`y`。修改这个问题只需要把这里的实参改掉就可以了。


再看一个例子：

这个程序与前面的程序非常相似：

```cpp
#include <iostream>

int add(int x, int y)
{
	return x + y;
}

void printResult(int z)
{
	std::cout << "The answer is: " << z << '\n';
}

int getUserInput()
{
	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
	return --x;
}

int main()
{
	int x{ getUserInput() };
	int y{ getUserInput() };

	int z { add(x, y) };
	printResult(z);

	return 0;
}
```


输出结果：

```
Enter a number: 4
Enter a number: 3
The answer is: 5
```

结果不对，什么原因呢？

让我们对这段代码进行一些调试：

```cpp
#include <iostream>

int add(int x, int y)
{
std::cerr << "add() called (x=" << x << ", y=" << y << ")\n";
	return x + y;
}

void printResult(int z)
{
std::cerr << "printResult() called (z=" << z << ")\n";
	std::cout << "The answer is: " << z << '\n';
}

int getUserInput()
{
std::cerr << "getUserInput() called\n";
	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
	return --x;
}

int main()
{
std::cerr << "main() called\n";
	int x{ getUserInput() };
std::cerr << "main::x = " << x << '\n';
	int y{ getUserInput() };
std::cerr << "main::y = " << y << '\n';

	int z{ add(x, y) };
std::cerr << "main::z = " << z << '\n';
	printResult(z);

	return 0;
}
```

现在让我们用相同的输入再次运行程序：

```
main() called
getUserInput() called
Enter a number: 4
main::x = 3
getUserInput() called
Enter a number: 3
main::y = 2
add() called (x=3, y=2)
main::z = 5
printResult() called (z=5)
The answer is: 5
```

这样一来就可以看出问题了：用户输入的值是 `4` ，但是`main` 函数中 `x` 得到的值却是 `3`。在用户输入的位置和给`x`赋值之间的代码肯定出了问题。在函数 `getUserInput` 中添加一些调试代码来，确定程序是否从用户那里获得了正确的值：

```cpp hl_lines="20"
#include <iostream>

int add(int x, int y)
{
std::cerr << "add() called (x=" << x << ", y=" << y << ")\n";
	return x + y;
}

void printResult(int z)
{
std::cerr << "printResult() called (z=" << z << ")\n";
	std::cout << "The answer is: " << z << '\n';
}

int getUserInput()
{
std::cerr << "getUserInput() called\n";
	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
std::cerr << "getUserInput::x = " << x << '\n'; // 添加调试信息
	return --x;
}

int main()
{
std::cerr << "main() called\n";
	int x{ getUserInput() };
std::cerr << "main::x = " << x << '\n';
	int y{ getUserInput() };
std::cerr << "main::y = " << y << '\n';

	int z{ add(x, y) };
std::cerr << "main::z = " << z << '\n';
	printResult(z);

	return 0;
}
```

输出：

```
main() called
getUserInput() called
Enter a number: 4
getUserInput::x = 4
main::x = 3
getUserInput() called
Enter a number: 3
getUserInput::x = 3
main::y = 2
add() called (x=3, y=2)
main::z = 5
printResult() called (z=5)
The answer is: 5
```

添加这行调试代码后，我们可以看到用户输入被正确地接收到`getUserInput()`的变量 `x` 中。但是变量`x`却得到了错误的值。问题肯定在这两点之间。唯一的罪魁祸首是函数 `getUserInput()`的返回值：

```cpp
return --x;
```

嗯，这很奇怪。`x`前面的“`--`”符号是什么？由于我们的教程还没有讲到这一点，所以如果你不知道它的意思，也不用担心。但是，即使不知道它是什么意思，通过调试工作，你也可以合理地确定这一行有问题——因此，很可能是这个“`--`”符号导致了问题。

因为我们希望 `getUserInput` 只返回 `x`的值，所以干脆把`--`删了试试：

```cpp
#include <iostream>

int add(int x, int y)
{
std::cerr << "add() called (x=" << x << ", y=" << y << ")\n";
	return x + y;
}

void printResult(int z)
{
std::cerr << "printResult() called (z=" << z << ")\n";
	std::cout << "The answer is: " << z << '\n';
}

int getUserInput()
{
std::cerr << "getUserInput() called\n";
	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
std::cerr << "getUserInput::x = " << x << '\n';
	return x; // removed -- before x
}

int main()
{
std::cerr << "main() called\n";
	int x{ getUserInput() };
std::cerr << "main::x = " << x << '\n';
	int y{ getUserInput() };
std::cerr << "main::y = " << y << '\n';

	int z{ add(x, y) };
std::cerr << "main::z = " << z << '\n';
	printResult(z);

	return 0;
}
```

输出：

```
main() called
getUserInput() called
Enter a number: 4
getUserInput::x = 4
main::x = 4
getUserInput() called
Enter a number: 3
getUserInput::x = 3
main::y = 3
add() called (x=4, y=3)
main::z = 7
printResult() called (z=7)
The answer is: 7
```

程序现在可以正常工作了，虽然我们不知道 `--` 是干嘛的，但是这并不影响我们定位和修复这个问题。

## 为什么使用打印语句来调试程序并不是上策

虽然为诊断目的向程序添加调试语句是一种常见的基本技术，也很有用(特别是当调试器由于某些原因不可用时)，但由于以下几个原因，它并不是很好:

1. 调试语句使代码变得混乱；
2. 调试语句使程序的输出变得混乱；
3. 调试语句在使用完之后必须删除，这使得它们不可重用；
4. 调试语句需要修改代码来添加和删除，这可能会引入新的错误。

下节课，我们将介绍一种更好的办法来调试程序。