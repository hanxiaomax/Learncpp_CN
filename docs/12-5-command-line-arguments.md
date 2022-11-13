---
title: 12.5 - 命令行参数
alias: 12.5 - 命令行参数
origin: /command-line-arguments/
origin_title: "12.5 — Command line arguments"
time: 2022-4-8
type: translation
tags:
- argument
---

??? note "关键点速记"


## 命令行参数的用途

在 [0.5 -- Introduction to the compiler, linker, and libraries](https://www.learncpp.com/cpp-tutorial/introduction-to-the-compiler-linker-and-libraries/) 中我们介绍过，编译和链接后，得到的结果是一个可执行文件。当程序运行时，则会从`main()`函数的顶部开始运行。`main()`函数定义如下：

```cpp
int main()
```


注意，这里的 `main()` 函数没有[[parameters|形参]]。但是很多程序其实需要基于输入来判断如何开始工作。例如，如果我们编写了一个读取图片作为缩略图的程序 `Thumbnail` 。那么 `Thumbnail` 应该读取哪个图片并处理呢？用户必须有办法告诉程序应该打开哪个文件，此时我们可以这样做：

```cpp
// Program: Thumbnail
#include <iostream>
#include <string>

int main()
{
    std::cout << "Please enter an image filename to create a thumbnail for: ";
    std::string filename{};
    std::cin >> filename;

    // open image file
    // create thumbnail
    // output thumbnail
}
```

但是，这么做有一个潜在的问题。每次程序运行时，都必须等待用户的输入才能继续工作。如果我们每次都是手动启动该程序的话，这似乎也没什么问题。但是很多时候这么做是不合适的，例如你需要对多个文件执行该程序或者从另外一个程序中调用该程序。

让我们进一步研究这些案例。

考虑这样一种情况，你希望为给定目录中的所有图像文件创建缩略图。你会怎么做?只要目录中有图像，你就可以多次运行这个程序，手动键入每个文件名。然而，如果有数百个图像，这可能需要一整天！一个好的解决方案是编写一个程序循环遍历目录中的每个文件名，为每个文件调用一次`Thumbnail`。

现在考虑这样一个情况，你正在运营一个网站，你想让你的网站在用户每次上传图片到你的网站时创建一个缩略图。这个程序没有设置为接受来自网络的输入，那么在这种情况下，上传者如何输入文件名呢?一个好的解决方案是让你的web服务器在上传后自动调用`Thumbnail`。

在这两种情况下，我们确实需要一种方法，让一个外部程序在`Thumbnail`启动时将文件名作为输入传递给`Thumbnail`程序，而不是让`Thumbnail`在启动后等待用户输入文件名。

**命令行参数**是可选的字符串参数，在程序启动时由操作系统传递给它。然后程序可以使用它们作为输入(或忽略它们)。就像函数形参为函数提供了向另一个函数提供输入的方法一样，命令行实参为人们或程序提供了向程序提供输入的方法。


## 传递命令行参数

可执行程序可以通过名称在命令行中运行。例如，要运行Windows机器当前目录下的可执行文件" WordCount "，你可以输入:

```
WordCount
```

在UNIX类的操作系统上使用：

```
./WordCount
```

给 `WordCount` 传递参数很简单，只要将参数放在程序名后面即可：


```
WordCount Myfile.txt
```

当 `WordCount` 执行时 `Myfile.txt` 会作为命令行实参传入，如果程序需要多个参数，则需要将它们用空格隔开：

```
WordCount Myfile.txt Myotherfile.txt
```

如果从IDE运行程序，IDE应该提供输入命令行参数的方法。

在Microsoft Visual Studio中，在解决方案资源管理器中右键单击项目，然后选择属性。打开“Configuration Properties”，选择“Debugging”。在右窗格中，有一行称为“命令参数”。你可以在这里输入命令行参数进行测试，当你运行程序时，它们将自动传递给你的程序。

在Code::Blocks中，选择" Project -> Set program 's arguments "。


## 使用命令行参数

现在你已经知道如何向程序提供命令行参数了，下一步就是从C++程序中访问它们。为此，我们使用了一种不同于以往的`main()`形式。`main()`的这种新形式有两个参数(按照约定命名为`argc`和`argv`)：

```cpp
int main(int argc, char* argv[])
```

有时你会看到它被写成：

```cpp
int main(int argc, char** argv)
```

尽管这两种表示是相同的，但我们更喜欢第一种表示，因为它更直观，容易理解。

**argc**是一个整数参数，包含传递给程序的参数数量(请考虑：argc = **arg**ument **c**ount)。`argc`最小是1，因为第一个参数总是程序本身的名称。用户提供的每个命令行参数将导致`argc`增加1。

**argv**是存储实际参数值的地方(请考虑：argv = **arg**ument **v** values，虽然它的正确名称是“参数向量”)。尽管argv的声明看起来很吓人，但argv实际上只是一个C语言风格的字符串数组。这个数组的长度是argc。

让我们写一个名为“MyArgs”的小程序来打印所有命令行参数的值:

```cpp
// Program: MyArgs
#include <iostream>

int main(int argc, char* argv[])
{
    std::cout << "There are " << argc << " arguments:\n";

    // Loop through each argument and print its number and value
    for (int count{ 0 }; count < argc; ++count)
    {
        std::cout << count << ' ' << argv[count] << '\n';
    }

    return 0;
}
```

现在，当我们用命令行参数“Myfile.txt”和“100”调用这个程序(MyArgs)时，输出将如下所示:

```
There are 3 arguments:
0 C:\MyArgs
1 Myfile.txt
2 100
```

参数0是正在运行的当前程序的路径和名称。本例中的参数1和2是我们传入的两个命令行参数。

## 处理数值参数

命令行参数总是作为字符串传递，即使提供的值本质上是数值。若要将命令行参数用作数字，必须将其从字符串转换为数字。不幸的是，在C++中，字符串转数字比你想象的要复杂。

在C++中需要这么做：

```cpp
#include <iostream>
#include <sstream> // for std::stringstream
#include <string>

int main(int argc, char* argv[])
{
	if (argc <= 1)
	{
		// On some operating systems, argv[0] can end up as an empty string instead of the program's name.
		// We'll conditionalize our response on whether argv[0] is empty or not.
		if (argv[0])
			std::cout << "Usage: " << argv[0] << " <number>" << '\n';
		else
			std::cout << "Usage: <program name> <number>" << '\n';

		return 1;
	}

	std::stringstream convert{ argv[1] }; // 创建一个 stringstream 变量 convert，使用 argv[1] 对其进行初始化

	int myint{};
	if (!(convert >> myint)) // do the conversion
		myint = 0; // if conversion fails, set myint to a default value

	std::cout << "Got integer: " << myint << '\n';

	return 0;
}
```

运行该程序并将"567"作为参数：

```
Got integer: 567
```

`std::stringstream` 和 `std::cin` 的工作方式类似。在这个例子中 `argv[1]` 首先用于初始化`stringstream` so that we can use operator>> to extract the value to an integer variable (the same as we would with `std::cin`).

We’ll talk more about `std::stringstream` in a future chapter.

## 操作系统首先解析命令行

When you type something at the command line (or run your program from the IDE), it is the operating system’s responsibility to translate and route that request as appropriate. This not only involves running the executable, it also involves parsing any arguments to determine how they should be handled and passed to the application.

Generally, operating systems have special rules about how special characters like double quotes and backslashes are handled.

For example:

```
MyArgs Hello world!
```

prints:

```
There are 3 arguments:
0 C:\MyArgs
1 Hello
2 world!
```

Typically, strings passed in double quotes are considered to be part of the same string:

```
MyArgs "Hello world!"
```

prints:

```
There are 2 arguments:
0 C:\MyArgs
1 Hello world!
```

Most operating systems will allow you to include a literal double quote by backslashing the double quote:

```
MyArgs \"Hello world!\"
```

prints:

```
There are 3 arguments:
0 C:\MyArgs
1 "Hello
2 world!"
```

Other characters may also require backslashing or escaping depending on how your OS interprets them.

## 小结

Command line arguments provide a great way for users or other programs to pass input data into a program at startup. Consider making any input data that a program requires at startup to operate a command line parameter. If the command line isn’t passed in, you can always detect that and ask the user for input. That way, your program can operate either way.