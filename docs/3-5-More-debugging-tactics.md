---
title: 3.5 - 更多代码调试技术
alias: 3.5 - 更多代码调试技术
origin: /more-debugging-tactics/
origin_title: "3.5 — More debugging tactics"
time: 2021-8-30
type: translation
tags:
- debugging
---


在上节课 ([[3-4-Basic-debugging-tactics|3.4 — 基本代码调试技术]]) 中，我们展示了如何手动调试代码。在这节课中我们提供一种新的方式，它可以避免调试语句带来的问题：

1. 调试语句使代码变得混乱；
2. 调试语句使程序的输出变得混乱；
3. 调试语句在使用完之后必须删除，这使得它们不可重用；
4. 调试语句需要修改代码来添加和删除，这可能会引入新的错误。

在这节课中，我们将探索这样做的一些基本技巧。

## 为调试代码添加执行条件

考虑下面程序：

```cpp
#include <iostream>

int getUserInput()
{
std::cerr << "getUserInput() called\n";
	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
	return x;
}

int main()
{
std::cerr << "main() called\n";
    int x{ getUserInput() };
    std::cout << "You entered: " << x;

    return 0;
}
```


当完成问题定位后， 上述程序中的调试语句都需要被删掉或者注释掉。万一将来你还需要在这里定位问题，那么还得把它们加回来或者放开它们的注释。

一种更容易在整个程序中禁用和启用调试的方法是使用预处理器指令使调试语句具有条件:

```cpp
#include <iostream>

#define ENABLE_DEBUG // comment out to disable debugging

int getUserInput()
{
#ifdef ENABLE_DEBUG
std::cerr << "getUserInput() called\n";
#endif
	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
	return x;
}

int main()
{
#ifdef ENABLE_DEBUG
std::cerr << "main() called\n";
#endif
    int x{ getUserInput() };
    std::cout << "You entered: " << x;

    return 0;
}
```


这样一来，我们只需要注释或者取消对  `#define ENABLE_DEBUG` 的注释，即可重用之前全部的调试语句，而不需要依次对其进行添加和删除。如果你的项目中包含多个文件，则可以把 `#define ENABLE_DEBUG` 定义到头文件中，然后被其他文件包含，这样一来在一处对此宏定义进行注释就可以将效果应用到全部代码文件。

这解决了必须删除调试语句的问题及其潜在的风险，但代价是代码会更加混乱。另一个缺点是，如果你犯了一个拼写错误(例如拼错了“DEBUG '”)或忘记将头文件包含到一个代码文件中，该文件的部分或全部调试可能无法启用。因此，尽管这比无条件的版本更好，但仍有改进的空间。
## 使用日志

除了通过预处理器进行条件化调试，我们还可以将调试信息发送到日志文件。日志文件是记录软件中发生的事件的文件(通常存储在磁盘上)。将信息写入日志文件的过程称为日志记录。大多数应用程序和操作系统都会编写日志文件，用于帮助诊断发生的问题。

因为写入日志文件的信息与程序的输出是分开的，所以可以避免混合正常输出和调试输出所造成的混乱。日志文件也可以很容易地发送给其他人进行诊断——因此，如果软件客户遇到问题，你可以要求他们将日志文件发过来，这可能有助于为你提供问题的线索。

虽然你可以自己编写代码来创建日志文件并向它们发送输出，但我们还是推荐使用现有的许多第三方日志工具，具体用哪一个取决于你自己。

我们会使用[plog](https://github.com/SergiusTheBest/plog)日志记录器输出到日志记录器的样子。Plog是一个纯头文件实现的库，因此很容易在任何需要它的地方包含它，而且它是轻量级的，易于使用。

```cpp
#include <iostream>
#include <plog/Log.h> // Step 1: include the logger headers
#include <plog/Initializers/RollingFileInitializer.h>

int getUserInput()
{
	PLOGD << "getUserInput() called"; // PLOGD is defined by the plog library

	std::cout << "Enter a number: ";
	int x{};
	std::cin >> x;
	return x;
}

int main()
{
	plog::init(plog::debug, "Logfile.txt"); // Step 2: initialize the logger

	PLOGD << "main() called"; // Step 3: Output to the log as if you were writing to the console

	int x{ getUserInput() };
	std::cout << "You entered: " << x;

	return 0;
}
```


Here’s output from the above logger (in the `Logfile.txt` file):

```
2018-12-26 20:03:33.295 DEBUG [4752] [main@14] main() called
2018-12-26 20:03:33.296 DEBUG [4752] [getUserInput@4] getUserInput() called
```

How you include, initialize, and use a logger will vary depending on the specific logger you select.

Note that conditional compilation directives are also not required using this method, as most loggers have a method to reduce/eliminate writing output to the log. This makes the code a lot easier to read, as the conditional compilation lines add a lot of clutter. With plog, logging can be temporarily disabled by changing the init statement to the following:

```cpp
plog::init(plog::none , "Logfile.txt"); // plog::none eliminates writing of most messages, essentially turning logging off
```


We won’t use plog in any future lessons, so you don’t need to worry about learning it.

!!! cite "题外话"

    If you want to compile the above example yourself, or use plog in your own projects, you can follow these instructions to install it:

	First, get the latest plog release:
	
	-   Visit the [plog](https://github.com/SergiusTheBest/plog) repo.
	-   Click the green Code button in the top right corner, and choose “Download zip”
	
	Next, unzip the entire archive to `somewhere` on your hard drive.
	
	Finally, for each project, set the `somewhere\plog-master\include\` directory as an `include directory` inside your IDE. There are instructions on how to do this for Visual Studio here: [A.2 -- Using libraries with Visual Studio](https://www.learncpp.com/cpp-tutorial/a2-using-libraries-with-visual-studio-2005-express/) and Code::Blocks here: [A.3 -- Using libraries with Code::Blocks](https://www.learncpp.com/cpp-tutorial/a3-using-libraries-with-codeblocks/).
