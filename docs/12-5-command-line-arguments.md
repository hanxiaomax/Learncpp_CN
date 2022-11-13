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

If you are running your program from an IDE, the IDE should provide a way to enter command line arguments.

In Microsoft Visual Studio, right click on your project in the solution explorer, then choose properties. Open the “Configuration Properties” tree element, and choose “Debugging”. In the right pane, there is a line called “Command Arguments”. You can enter your command line arguments there for testing, and they will be automatically passed to your program when you run it.

In Code::Blocks, choose “Project -> Set program’s arguments”.

## 使用命令行参数

Now that you know how to provide command line arguments to a program, the next step is to access them from within our C++ program. To do that, we use a different form of main() than we’ve seen before. This new form of main() takes two arguments (named argc and argv by convention) as follows:

```cpp
int main(int argc, char* argv[])
```

COPY

You will sometimes also see it written as:

```cpp
int main(int argc, char** argv)
```

COPY

Even though these are treated identically, we prefer the first representation because it’s intuitively easier to understand.

**argc** is an integer parameter containing a count of the number of arguments passed to the program (think: argc = **arg**ument **c**ount). argc will always be at least 1, because the first argument is always the name of the program itself. Each command line argument the user provides will cause argc to increase by 1.

**argv** is where the actual argument values are stored (think: argv = **arg**ument **v**alues, though the proper name is “argument vectors”). Although the declaration of argv looks intimidating, argv is really just an array of C-style strings. The length of this array is argc.

Let’s write a short program named “MyArgs” to print the value of all the command line parameters:

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

COPY

Now, when we invoke this program (MyArgs) with the command line arguments “Myfile.txt” and “100”, the output will be as follows:

There are 3 arguments:
0 C:\MyArgs
1 Myfile.txt
2 100

Argument 0 is the path and name of the current program being run. Argument 1 and 2 in this case are the two command line parameters we passed in.

## 处理数值参数

Command line arguments are always passed as strings, even if the value provided is numeric in nature. To use a command line argument as a number, you must convert it from a string to a number. Unfortunately, C++ makes this a little more difficult than it should be.

The C++ way to do this follows:

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

	std::stringstream convert{ argv[1] }; // set up a stringstream variable named convert, initialized with the input from argv[1]

	int myint{};
	if (!(convert >> myint)) // do the conversion
		myint = 0; // if conversion fails, set myint to a default value

	std::cout << "Got integer: " << myint << '\n';

	return 0;
}
```

COPY

When run with input “567”, this program prints:

Got integer: 567

std::stringstream works much like std::cin. In this case, we’re initializing it with the value of argv[1], so that we can use operator>> to extract the value to an integer variable (the same as we would with std::cin).

We’ll talk more about std::stringstream in a future chapter.

## 操作系统首先解析命令行

When you type something at the command line (or run your program from the IDE), it is the operating system’s responsibility to translate and route that request as appropriate. This not only involves running the executable, it also involves parsing any arguments to determine how they should be handled and passed to the application.

Generally, operating systems have special rules about how special characters like double quotes and backslashes are handled.

For example:

MyArgs Hello world!

prints:

There are 3 arguments:
0 C:\MyArgs
1 Hello
2 world!

Typically, strings passed in double quotes are considered to be part of the same string:

MyArgs "Hello world!"

prints:

There are 2 arguments:
0 C:\MyArgs
1 Hello world!

Most operating systems will allow you to include a literal double quote by backslashing the double quote:

MyArgs \"Hello world!\"

prints:

There are 3 arguments:
0 C:\MyArgs
1 "Hello
2 world!"

Other characters may also require backslashing or escaping depending on how your OS interprets them.

## 小结

Command line arguments provide a great way for users or other programs to pass input data into a program at startup. Consider making any input data that a program requires at startup to operate a command line parameter. If the command line isn’t passed in, you can always detect that and ask the user for input. That way, your program can operate either way.