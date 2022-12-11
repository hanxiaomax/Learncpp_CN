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

我们会使用[plog](https://github.com/SergiusTheBest/plog)日志记录器输出到日志记录器的样子。plog是一个纯头文件实现的库，因此很容易在任何需要它的地方包含它，而且它是轻量级的，易于使用。

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


代码输出的日志如下所示(在 `Logfile.txt` 文件中):

```
2018-12-26 20:03:33.295 DEBUG [4752] [main@14] main() called
2018-12-26 20:03:33.296 DEBUG [4752] [getUserInput@4] getUserInput() called
```

如何包含、初始化和使用记录器取决于你选择的日志工具。

注意，使用这种方法也不需要条件编译指令，因为大多数记录器都有一种方法来减少/消除对日志的写入输出。这使得代码更容易阅读，因为条件编译行增加了很多混乱。使用`plog`，可以通过更改`init`语句来临时禁用日志记录:

```cpp
plog::init(plog::none , "Logfile.txt"); // plog::none eliminates writing of most messages, essentially turning logging off
```


我们不会在以后的课程中使用plog，所以你不需要担心学习它。

!!! cite "题外话"

	如果你想自己编译上面的例子，或者在你自己的项目中使用plog，可以按照这些说明来安装它:
	
	首先，获取最新版本的 plog:
	- 访问 [plog](https://github.com/SergiusTheBest/plog) 的 Github 仓库；
	-  点击右上角的绿色Code按钮，然后选择“Download zip”。
	
	接下来，在电脑上解压压缩包（假设是`somewhere`）。
	
	最后，对于每个需要使用它的项目，在IDE的`include directory`设置 `somewhere\plog-master\include\`。如果你使用 Visual Studio 可以参考：[[A-2-using-libraries-with-visual-studio|A.2 - 在visual studio中使用库]]，如果是Code::Blocks则参考[[A-3-using-libraries-with-Code-Blocks|A.3 - 在Code Blocks中使用库]]。

