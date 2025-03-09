---
title: 1.8 - 空白符和基本排版
alias: 1.8 - 空白符和基本排版
origin: /whitespace-and-basic-formatting/
origin_title: "1.8 — Whitespace and basic formatting"
time: 2022-1-2
type: translation
tags:
- formatting
---


*空白*这个术语，指的是那些出于排版目的而使用的空白字符。在 C++ 中，空白指的是空格符、制表符和换行符。C++ 编译器通常会忽略空白（处理文本字面量时是一个特例）。因此我们可以说 C++ 是一个空格无关（whitespace-independent）的语言。

因此，下面几行代码的效果其实是完全一样的：

```cpp
std::cout << "Hello world!";

std::cout               <<            "Hello world!";

		std::cout << 		"Hello world!";

std::cout
	<< "Hello world!";
```

最后一个语句即使被分割为两行，它也能够正常编译。

下面的函数效果也完全一样：

```cpp
int add(int x, int y) { return x + y; }

int add(int x, int y) {
    return x + y; }

int add(int x, int y)
{    return x + y; }

int add(int x, int y)
{
    return x + y;
}
```

一个例外是，C++编译器并不会忽略引号包裹的字符串中的空白，例如 `"Hello world!"`。

```bash
"Hello world!"
```

上面的字符串和下面的字符串是不一样的。

```bash
"Hello     world!"
```

两个字符串都会被原封不动的打印处理。

在引号包裹的字符串中，换行是不合法的：

```cpp
std::cout << "Hello
     world!"; // Not allowed!
```

只使用空白字符（空格、换行和回车）分割的文本，最终将会被连接在一起：

```cpp
std::cout << "Hello "
     "world!"; // prints "Hello world!"
```

另外一个特例是，C++ 的编译器会关注单行注释（`//`）中的空白符。单行注释只会到该行末尾截止，下面的代码是有问题的：

```cpp
std::cout << "Hello world!"; // Here is a single-line comment
this is not part of the comment
```


## 基本代码格式

和其他语言不同，C++ 并不会强制程序员使用某种排版风格（还记得吗？相信程序员！）。C++ 中有很多可以使用的排版方式，关于哪一种才是最佳的方式，你可能会有不同的看法。我们的基本原则是，代码可读性最强、一执行最好的那种排版风格，就是最好的。 

本教程建议的排版规范如下：

1.使用制表符和空格进行缩进都是允许的 (大多数的 IDE 都可以设置自动将制表符转换为规定个数的空格）。开发者使用空格进行排版尤其内在的逻辑，毕竟使用”空格“来创建代码之间的”空白“是天经地义的。使用空格添加的空白，不论在什么编辑器下，看起来都是一致的。而使用制表符进行缩进的程序员会对上述行为感到困惑，制表符就是为了缩进而存在的，为什么不用呢？更何况你还可以自由控制其缩进的宽度。这个问题没有所谓”正确“的答案，争论它的对错是没有意义的，就好比争论粽子应该是甜的还是咸的，因为这完全取决于你自己的口味。

不论那种方式，我们建议你使用4个空格的宽度作为缩进的宽度。有些IDE默认的缩进宽度是3个空格，其实也是可以的。

2.函数括号的排版有两种可以接受的方式。

Google C++ 风格指南建议的风格是花括号不换行：

```cpp
int main() {
}
```

这么做的依据是，它能够减少纵向空白的产生（括号单独占用一行是不划算的），这样你就可以在有限的屏幕中显示更多的代码，这能够帮助你更好的理解代码。

不过，我们还是倾向于使用另外一种常见的方式，即花括号另起一行：

```cpp
int main()
{
}
```

这么做可以增强可读性，因为一对花括号总是具有相同的缩进，这么做可以减少犯错的几率。如果编译器报告了括号不匹配的错误，那你可以很容易的找到问题所在。

3.每一层花括号中的语句都必须进行缩进一级，例如：

```cpp
int main()
{
    std::cout << "Hello world!\n"; // tabbed in one tab (4 spaces)
    std::cout << "Nice to meet you.\n"; // tabbed in one tab (4 spaces)
}
```

4.每一行代码都不应该太长。常见的规则是：单行不能超过80个字符。如果一行代码太长，它就应当被分割为多行（在合适的位置分割）。具体操作时可以将各个子行额外缩进一级，或者，如果子行之间非常类似，可以将它们都对齐到上面的行（可读性更好）。

```cpp
int main()
{
    std::cout << "This is a really, really, really, really, really, really, really, "
        "really long line\n"; // one extra indentation for continuation line

    std::cout << "This is another really, really, really, really, really, really, really, "
                 "really long line\n"; // text aligned with the previous line for continuation line

    std::cout << "This one is short\n";
}
```

这么做可以使得每行代码都具有很好的可读性。在宽屏显示器上，这么做还可以允许你将两个代码窗口并排显示，轻松地对比它们的差异。

> [!success] "最佳实践"
> 单行代码长度不应该超过80个字符。

> [!tip] "小贴士"
> 很多编辑器都集成（或通过插件/扩展）了*列指示器*，能够显示出特定列的位置（例如80个字符处）。因此你可以很容易地判断你的代码行是不是超长了。搜索编辑器名+“Column guide”来查询你的编辑器是否支持该特性。
> 译注：在 VS Code 中，这一特性叫做 `editor.rulers` ，可以在设置中配置其出现的位置，例如 `editor.rulers=[80]`

5.如果一个较长的行被基于运算符分割为了多个短行，那么运算符应该放置在下一行的开头而不是上一行的结尾：

```cpp
std::cout << 3 + 4
    + 5 + 6
    * 7 * 8;
```

这么做可以明确的表明下一行是承接自上一行的，而且你可以将运算符左对齐，提高可读性。

6.使用空格将值、注释对齐，或在代码段之间添加空格以提高可读性。

可读性不佳：

```cpp
cost = 57;
pricePerItem = 24;
value = 5;
numberOfItems = 17;
```

可读性佳：

```cpp
cost          = 57;
pricePerItem  = 24;
value         = 5;
numberOfItems = 17;
```

可读性不佳：

```cpp
std::cout << "Hello world!\n"; // cout lives in the iostream library
std::cout << "It is very nice to meet you!\n"; // these comments make the code hard to read
std::cout << "Yeah!\n"; // especially when lines are different lengths
```

可读性佳：

```cpp
std::cout << "Hello world!\n";                  // cout lives in the iostream library
std::cout << "It is very nice to meet you!\n";  // these comments are easier to read
std::cout << "Yeah!\n";                         // especially when all lined up
```

可读性不佳：

```cpp
// cout lives in the iostream library
std::cout << "Hello world!\n";
// these comments make the code hard to read
std::cout << "It is very nice to meet you!\n";
// especially when all bunched together
std::cout << "Yeah!\n";
```

可读性佳：

```cpp
// cout lives in the iostream library
std::cout << "Hello world!\n";

// these comments are easier to read
std::cout << "It is very nice to meet you!\n";

// when separated by whitespace
std::cout << "Yeah!\n";
```

本教程将始终贯彻上述排版约定，它们终将会称为你习惯的一部分。在我们介绍信的语言特性的时候，也会对应地介绍其适用的代码排版风格。

C++ 给与了你选择任何你喜欢的风格的权利，但是，我们仍然强烈推荐你使用与我们相同的代码风格，这些规则都是千锤百炼，被无数人测试后得到的经验，它们能够在编程路上助你一臂之力。当然，如果你在基于他人的代码进行工作，请适应并使用他们的代码风格，风格一致性的优先级要高于其他。

## 自动排版

大多数的现代 IDE 都可以帮助你排版你的代码（例如，在你创建函数的时候，IDE就会自动帮你缩进函数体内的语句）。

然而，当你添加、删除代码，或者修改了IDE的默认排版规则后，又或者你从其他地方拷贝了代码，这种情况下排版可能会变得一团糟。修复部分或整个文件中的排版问题是非常头疼的。幸运的是，现代IDE通常都提供了自动排版的功能，它可以对你选择的部分或者整个文件进行重新排版。

> [!tip] "For Visual Studio users"
> 在 Visual Studio 中，可以通过 _Edit > Advanced > Format Document_ and _Edit > Advanced > Format Selection_ 来配置自动排版。

> [!tip] "For Code::Blocks users"
> 在 Code::Blocks 中，可以通过鼠标右键，选择 Format use AStyle 来使用。

为了使用方便，推荐为自动排版功能绑定一个键盘快捷键。

> [!tip] "小贴士"
> 使用自动排版功能，是保持代码风格一致性的好办法。

