---
title: 4.11 - 字符
alias: 4.11 - 字符
origin: /chars/
origin_title: "4.11 - Chars"
time: 2022-4-16
type: translation
tags:
- char
- C++11
---





到目前为止，我们介绍的基础数据类型都是用来保存数字的（整型或者浮点数）或者布尔值的。但是，如果我们想存放字母和标点怎么办？

```cpp
#include <iostream>

int main()
{
    std::cout << "Would you like a burrito? (y/n)";

    // We want the user to enter a 'y' or 'n' character
    // How do we do this?

    return 0;
}
```


`char`类型是用来保存`字符(character)`。字符可以是一个字母、数字、符号或空白。

char类型也属于整型类型，也就是说它底层存储的还是整型数。和布尔值将0解析为false类似，将非零值解析为true类似，char 类型将存储的整型解析为`ASCII`字符。

ASCII 即美国信息交换标准代码是，它是一种将英文字母（以及少数其他符号）表示为0到127整型数字的方法。例如ASCII中97表示字母`a`。

字符常量通常放置在单引号中（例如,`'g'`,`'1'`,`' '`）。

完整的 ASCII 字母表如下：


|ASCII 码	|符号|	ASCII 码	|符号	|ASCII 码	|符号	|ASCII 码	|符号|
|----|----|----|----|----|----|----|----|
|0	|NUL (null)|	32	|(space)	|64	|@	|96	|\`|
|1	|SOH (start of header)|	33	|!	|65	|A	|97	|a|
|2	|STX (start of text)|	34	|”	|66	|B	|98	|b|
|3	|ETX (end of text)|	35	|#	|67	|C	|99	|c|
|4	|EOT (end of transmission)|	36	|$	|68	|D	|100	|d|
|5	|ENQ (enquiry)|	37	|%	|69	|E	|101	|e|
|6	|ACK (acknowledge)|	38	|&	|70	|F	|102	|f|
|7	|BEL (bell)|	39	|’	|71	|G	|103	|g|
|8	|BS (backspace)|	40	|(	|72	|H	|104	|h|
|9	|HT (horizontal tab)|	41	|)	|73	|I	|105	|i|
|10	|LF (line feed/new line)|	42	|*	|74	|J	|106	|j|
|11	|VT (vertical tab)|	43	|+	|75	|K	|107	|k|
|12	|FF (form feed / new page)|	44	|,	|76	|L	|108	|l|
|13	|CR (carriage return)|	45	|-	|77	|M	|109	|m|
|14	|SO (shift out)|	46	|.	|78	|N	|110	|n|
|15	|SI (shift in)|	47	|/	|79	|O	|111	|o|
|16	|DLE (data link escape)|	48	|0	|80	|P	|112	|p|
|17	|DC1 (data control 1)|	49	|1	|81	|Q	|113	|q|
|18	|DC2 (data control 2)|	50	|2	|82	|R	|114	|r|
|19	|DC3 (data control 3)|	51	|3	|83	|S	|115	|s|
|20	|DC4 (data control 4)|	52	|4	|84	|T	|116	|t|
|21	|NAK (negative acknowledge)|	53	|5	|85	|U	|117	|u|
|22	|SYN (synchronous idle)|	54	|6	|86	|V	|118	|v|
|23	|ETB (end of transmission block)|	55	|7	|87	|W	|119	|w|
|24	|CAN (cancel)|	56	|8	|88	|X	|120	|x|
|25	|EM (end of medium)|	57	|9	|89	|Y	|121	|y|
|26	|SUB (substitute)|	58	|:	|90	|Z	|122	|z|
|27	|ESC (escape)|	59	|;	|91	|\[	|123	|{|
|28	  | FS (file separator)|	60	|<	|92	|\\	|124	|||
|29	|GS (group separator)|	61	|=	|93	|]	|125	|}|
|30	|RS (record separator)|	62	|>	|94	|^	|126	|~|
|31	|US (unit separator)|	63	|?	|95	|_	|127	|DEL (删除)|


ASCII 码 0-31 为不可打印字符，它们大多被用来排版或控制打印机，其中很多现在已经不再使用了。如果你尝试将它们打印出来的话，打印的结果可能和你使用的系统相同（你可能会得到一些像emoji的字符）。

ASCII 码 32-127 为可打印字符，它们通常表示字母、数字字符和标点，多被用来表示基本的英文文本。

## 初始化字符

使用字符字面量可以初始化字符变量：

```cpp
char ch2{ 'a' }; // 使用 'a' 来初始化(被存储为 97) (推荐)
```

你也可以使用整型数来初始化字符变量，但是应该尽量避免这么做。

```cpp
char ch1{ 97 }; // 使用 97 来初始化('a') (不推荐)
```


> [!warning] "注意"
> 注意不要将字符数字和整型数字搞混，下面两种初始化并不相同：
> ```cpp
> char ch{5}; // 使用 5 初始化(保存为整型 5)
> char ch{'5'}; // 使用 '5' 初始化 (保存为整型 53)
> ```
> 只有当需要将数字显示成文本的时候，才使用字符数字而不是整型数字。整型数字用于数学运算。
	
## 打印字符

当使用 `std::cout` 打印字符的时候 `std::cout`会把字符变量打印成ASCII字符：

```cpp
#include <iostream>

int main()
{
    char ch1{ 'a' }; // (preferred)
    std::cout << ch1; // cout prints character 'a'

    char ch2{ 98 }; // code point for 'b' (not preferred)
    std::cout << ch2; // cout prints a character ('b')


    return 0;
}
```

输出结果：ab

字符字面量也可以直接打印：

```cpp
cout << 'c';
```

输出结果：c

## 输入字符

下面这个程序会提示用户输入一个字符，然后将字符打印出来：

```cpp
#include <iostream>

int main()
{
    std::cout << "Input a keyboard character: ";

    char ch{};
    std::cin >> ch;
    std::cout << "You entered: " << ch << '\n';

    return 0;
}
```

运行结果：

```
Input a keyboard character: q
You entered q
```

注意， `std::cin` 允许你输入多个字符。不过变量 `ch`只能接收一个字符，因此只有第一个字符会被存放到变量中，剩下字符会被留在`std::cin`的缓冲中，可以被接下来再次调用 `std::cin` 时使用。

以下面的程序为例：

```cpp
#include <iostream>

int main()
{
    std::cout << "Input a keyboard character: "; // 假设用户输入了 "abcd" (带双引号)

    char ch{};
    std::cin >> ch; // ch = 'a', "bcd" 被留在了缓冲中
    std::cout << "You entered: " << ch << '\n';

    // 注意，下面的ch没有要求用户再次输入，它可以直接从缓冲中获取输入
    std::cin >> ch; // ch = 'b', "cd" 被流在缓冲中
    std::cout << "You entered: " << ch << '\n';

    return 0;
}
```



```
Input a keyboard character: abcd
You entered: a
You entered: b
```

如果你想一次性读入多个字符（例如，名字、单词或者句子），你应该使用字符串而不是字符。字符串是一个字符序列（因此字符串可以保存多个符号）。

> [!info] "相关内容"
> 我们会在[[5-7-an-introduction-to-std-string|4.17 - std::string 简介]]中讨论关于字符串的内容。

## 字符类型的大小、范围和默认符号

C++ 将字符类型的大小定义为固定的1字节。默认情况下，字符可以是有符号或者无符号的（多数情况为有符号）。如果你使用字符变量来保存ASCII字符的话，你不需要指定符号，因为有符号和无符号的字符变量都可以保存0-127内的值。

如果你使用字符变量来保存一些比较小的整型值（如非优化空间这样的特别需要，请不要这么做），你应该指定它是有符号还是无符号的。有符号的字符可以保存的整数范围为-128 到 127。无符号字符则可以保存 0 到 255 范围内的整数。

## 转译序列

C++ 中的某些字符是具有特殊含义的，这些字符称为转译序列（escape sequences）。转译序列以`\`（反斜线）开头，紧接着是一个字母或数字。

你可能已经见过在常遇到的转义序列`'\n'`，它会在字符串中嵌入一个换行：

```cpp
#include <iostream>

int main()
{
    std::cout << "First line\nSecond line\n";
    return 0;
}
```

输出结果：

```
First line
Second line
```

另外一个常用的转译序列是 `'\t'`，表示一个水平制表符：

```cpp
#include <iostream>

int main()
{
    std::cout << "First part\tSecond part";
    return 0;
}
```

输出结果为

```
First part        Second part
```

其他一些值得注意的转译序列有：

- `\'` ：打印单引号
- `\"`：打印双引号
- `\\` 打印反斜线

下表展示了全部的转义序列

|名称	|符号|	含义	|
|---|---|---|
|Alert	|\a|	Makes an alert, such as a beep	|
|Backspace	|\b|	Moves the cursor back one space	|
|Formfeed	|\f|	Moves the cursor to next logical page	|
|Newline	|\n|	Moves cursor to next line	|
|Carriage return	|\r|	Moves cursor to beginning of line	|
|Horizontal tab	|\t|	Prints a horizontal tab	|
|Vertical tab	|\v|	Prints a vertical tab	|
|Single quote	|\’|	Prints a single quote	|
|Double quote	|\”|	Prints a double quote	|
|Backslash	|\\|	Prints a backslash.	|
|Question mark	|\?|	Prints a question mark.<br>No longer relevant. You can use question marks unescaped.|
|Octal number	|\(number)|	Translates into char represented by octal	|
|Hex number	|\x(number)|	Translates into char represented by hex number	|

举例：

```cpp
#include <iostream>

int main()
{
    std::cout << "\"This is quoted text\"\n";
    std::cout << "This string contains a single backslash \\\n";
    std::cout << "6F in hex is char '\x6F'\n";
    return 0;
}
```

打印结果：

```bash
"This is quoted text"
This string contains a single backslash \
6F in hex is char 'o'
```

## Newline (`\n`) vs. std::endl

在[[1-5-Introduction-to-iostream-cout-cin-and-endl|1.5 - iostream 简介： cout，cin 和 endl]]中已经介绍了。

## 字符放在单引号和双引号中有什么区别

单字符总是放在单引号中 (例如 ‘a’, ‘+’, ‘5’)。字符只能表示一个符号（例如，字母、加号和数字5），下面这样的写法是不对的：

```cpp
char ch{'56'}; // char 只能保持一个符号
```

双引号中的文本会被看做是字符串（例如 “Hello, world!”）。

你可以在代码中使用字符串字面量：

```cpp
std::cout << "Hello, world!"; // "Hello, world!" is a string literal
```


> [!success] "最佳实践"
> 如果只有一个字符，请放在单引号中 (例如 ‘t’ 或 ‘\n’, 而不是 “t” 或 “\n”)。以便编译器进行优化。
	
## 还有其他字符类型吗？ wchar_t, char16_t 和 char32_t?

`wchar_t` 在几乎任何场合下都应该避免使用 (处理在使用 Windows API 时)。它的大小是实现时定义的，非常不可靠而且几乎已经废弃了。

> [!cite] "题外话"
> 术语“废弃”指的是，仍然支持，但是不再推荐使用，因为它已经被其他更好的同类替换了，同时它也是不安全的。
    
和 ASCII 将整型 0-127 映射到英文字母一样，也有其他字符编码标准可以将整型映射到其他语言的字符。除了 ASCII 以外最著名的字母编码是 Unicode，它将 144,000 个整型数映射到不同语言的字符。因为 Unicode 的编码点非常多，所以一个 Unicode 编码点需要32位才能表示一个字符（称为 UTF-32）。不过，Unicode 字符也可以使用多个 16 位或 8位字符 (分别称为 UTF-16 和 UTF-8)。

`char16_t` 和 `char32_t` 在 C++11 中被引入，用于支持 16 位和 32 位 Unicode 字符。`char8_t` 在 C++20 中被引入。

你不需要使用 `char8_t`、`char16_t` 或 `char32_t`，触发你希望程序兼容 Unicode。Unicode 和本地化一般来说已经超出了本教程的范围，所以我们并不会涉及相关内容。

同时，当你使用字符或字符串的时候，应该只使用ASCII字符。使用其他字符集的字符可能会导致字符显示错误。
