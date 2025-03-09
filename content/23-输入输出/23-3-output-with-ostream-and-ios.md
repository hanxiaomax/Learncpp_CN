---
title: 23.3 - 使用ostream和ios处理输出
alias: 23.3 - 使用ostream和ios处理输出
origin: /output-with-ostream-and-ios/
origin_title: "23.3 — Output with ostream and ios"
time: 2022-9-6
type: translation
tags:
- io
---

> [!note] "Key Takeaway"
> - 更改格式化的方式有两种，标记和manipulators。标记你可以将其看做是可以开关的布尔量。而manipulators则是放置在流中，可以修改输入输出的对象 。
> - `setf()`和`unsetf()`分别用于设置和关闭标记
> - 许多标志属于组，称为格式组。[[format-group|格式组]]是一组执行类似(有时互斥)格式化选项的标志，此时可以使用两个参数版本的`setf()`，并通过第二个参数指明组。此时组内其他标记会被自动关闭。


本节课我们将介绍`iostream`的输出类`ostream`。

## 插入运算符

[[insertion-operator|插入运算符]]用于向输出流插入数据。C++为所有的内建数据结构都预定义了插入运算符，我们也可以通过[[14-4-overloading-the-IO-operators|重载输入输出运算符]]为自定义的类提供插入运算符。

在[[23-1-Input-and-output-IO-streams|23.1 - 输入输出流]]中我们介绍过， `istream` 和 `ostream` 都是从 `ios` 类派生来的。`ios` (和 `ios_base`) 类的一个功能就是控制输出的格式。

## 格式化

==更改格式化的方式有两种，标记和manipulators。标记你可以将其看做是可以开关的布尔量。而manipulators则是放置在流中，可以修改输入输出的对象 。==

==设置一个标记可以使用 `setf()`函数并提供合适的标记作为参数。==例如，默认情况下C++并不会在正数前加一个+号。但是，使用 `std::ios::showpos` 标记就可以修改该行为：

```cpp
std::cout.setf(std::ios::showpos); // 打开std::ios::showpos 标记
std::cout << 27 << '\n';
```

输出结果如下：

```bash
+27
```

我们也可以利用[[bitwise-or|按位或]]操作一次性打开多个 `ios` 标记 ：

```cpp
std::cout.setf(std::ios::showpos | std::ios::uppercase); // 打开 std::ios::showpos 和 std::ios::uppercase 标记
std::cout << 1234567.89f << '\n';
```

输出结果：

```bash
+1.23457E+06
```

关闭标记也很简单，使用 `unsetf()`函数即可：

```cpp
std::cout.setf(std::ios::showpos); // turn on the std::ios::showpos flag
std::cout << 27 << '\n';
std::cout.unsetf(std::ios::showpos); // turn off the std::ios::showpos flag
std::cout << 28 << '\n';
```

输出结果如下：

```bash
+27
28
```

在使用`setf()`时还有一个需要提及的小技巧。==许多标志属于组，称为格式组。[[format-group|格式组]]是一组执行类似(有时互斥)格式化选项的标志==。例如，名为“basefield”的格式组包含标志“oct”、“dec”和“hex”，它们控制整数值的基数。默认情况下，设置了“dec”标志。因此，如果我们这样做:

```cpp
std::cout.setf(std::ios::hex); // 尝试启动十六进制输出
std::cout << 27 << '\n';
```

则输出结果为：

```bash
27
```

没有效果！这是因为 `setf()` 只能打开标记——但是它没有智能到懂得去关闭互斥的标记。因此，当 `std::ios::hex` 开启时， `std::ios::dec` 仍然是开启状态，由于它优先级更高，所以仍然是按照十进制输出的。有两个办法可以解决这个问题。

第一种方法是关闭 `std::ios::dec` 并开启 `std::hex`：

```cpp
std::cout.unsetf(std::ios::dec); // turn off decimal output
std::cout.setf(std::ios::hex); // turn on hexadecimal output
std::cout << 27 << '\n';
```

输出结果符合预期：

```bash
1b
```

第二种方法是使用另一个版本的 `setf()` ，它有两个形参，第二个参数指明标记所属的[[format-group|格式组]]。当使用这个版本的 `setf()` 时，同组的其他标记都会被自动关闭，只有我们设置的标记会被打开。例如：

```cpp
// Turn on std::ios::hex as the only std::ios::basefield flag
std::cout.setf(std::ios::hex, std::ios::basefield);
std::cout << 27 << '\n';
```

输出结果仍然符合预期：

```bash
1b
```

使用 `setf()` 和 `unsetf()` 是有点别扭的，因此C++提供了第二种方法来改变格式化选项：manipulators。manipulators 最赞的地方在于它足够智能，它能够自动开关相关联的标记。下面的例子中使用了 manipulators 改变计数进制：

```cpp
std::cout << std::hex << 27 << '\n'; // print 27 in hex
std::cout << 28 << '\n'; // 仍然是十六进制，不是一次性的
std::cout << std::dec << 29 << '\n'; // back to decimal
```

程序输出：

```bash
1b
1c
29
```

通常，使用manipulators比设置和取消设置标记要容易得多。许多标记都可以通过标志**和**manipulators来实现(例如更改基数)，然而，另外一些标记则只能通过标记或manipulators实现，因此了解如何使用这两种方法非常重要。

## 有用的标记

这里我们列举一些很有用的标记、manipulators 以及成员函数。 标记位于 `std::ios` 类中，manipulators 则位于std[[namespace|命名空间]]总，而成员函数则位于 `std::ostream` 类中。


|组标|记|	含义|
|:--|:--|:--|
||`std::ios::boolalpha`	|打开该标记后，布尔类型会打印 “true” 或 “false”。如果关闭，则大0或1


|Manipulator	|含义|
|:--|:--|
|`std::boolalpha`	|布尔类型会打印 “true” or “false”
|`std::noboolalpha`	|布尔类型会打印 0 or 1 (default)


例如：

```cpp
std::cout << true << ' ' << false << '\n';

std::cout.setf(std::ios::boolalpha);
std::cout << true << ' ' << false << '\n';

std::cout << std::noboolalpha << true << ' ' << false << '\n';

std::cout << std::boolalpha << true << ' ' << false << '\n';
```

结果：

```bash
1 0
true false
1 0
true false
```


|组 | 标记|	含义|
|:--|:--|:--|
||`std::ios::showpos`	|设置后，正数前面会添加+号

|Manipulator	|含义|
|:--|:--|
|`std::showpos`	|正数前面会添加+号
|`std::noshowpos`	|正数前面不添加+号

例如：

```cpp
std::cout << 5 << '\n';

std::cout.setf(std::ios::showpos);
std::cout << 5 << '\n';

std::cout << std::noshowpos << 5 << '\n';

std::cout << std::showpos << 5 << '\n';
```

结果：

```bash
5
+5
5
+5
```

|组	|标记	|含义|
|:--|:--|:--|
||`std::ios::uppercase`	|If set, uses upper case letters

|Manipulator|含义|
|:--|:--|
|`std::uppercase`	|使用大写字母
|`std::nouppercase`	|使用小写字母

例如：

```cpp
std::cout << 12345678.9 << '\n';

std::cout.setf(std::ios::uppercase);
std::cout << 12345678.9 << '\n';

std::cout << std::nouppercase << 12345678.9 << '\n';

std::cout << std::uppercase << 12345678.9 << '\n';
```

结果：

```bash
1.23457e+007
1.23457E+007
1.23457e+007
1.23457E+007
```

|组	|标记	|含义|
|:--|:--|:--|
|`std::ios::basefield`	|`std::ios::dec`	|按照十进制打印（默认的）
|`std::ios::basefield`	|`std::ios::hex`	|按照十六进制打印
|`std::ios::basefield`	|`std::ios::oct`	|按照八进制打印
|`std::ios::basefield`	|(none)	      |根据前缀字母打印


|Manipulator	|Meaning|
|:--|:--|
|`std::dec` |	按照十进制打印
|`std::hex`	|按照十六进制打印
|`std::oct`	|按照八进制打印

例如：

```cpp
std::cout << 27 << '\n';

std::cout.setf(std::ios::dec, std::ios::basefield);
std::cout << 27 << '\n';

std::cout.setf(std::ios::oct, std::ios::basefield);
std::cout << 27 << '\n';

std::cout.setf(std::ios::hex, std::ios::basefield);
std::cout << 27 << '\n';

std::cout << std::dec << 27 << '\n';
std::cout << std::oct << 27 << '\n';
std::cout << std::hex << 27 << '\n';
```

结果：

```bash
27
27
33
1b
27
33
1b
```

到目前为止，你应该能够看到通过标志和通过操作符设置格式之间的关系。在以后的例子中，我们将使用操纵符，除非它们不可用。

## 精度、计数法和小数点

使用 manipulators (或者标记) 也可以改变数值打印时的精度和要展示的小数点位数。这些格式化选项的组合比较复杂，让我们仔细研究一下：

|组	|标记	|含义|
|:--|:--|:--|:--|
| |`std::ios::floatfield`	|`std::ios::fixed`	|对浮点数使用十进制记数法
| |`std::ios::floatfield`	|`std::ios::scientific`	|对浮点数使用科学记数法
| |`std::ios::floatfield`	|(none)	|位数较少时使用固定计数法，位数多时使用科学计数法
| |`std::ios::floatfield`	|`std::ios::showpoint`	|对于浮点值，始终显示小数点和末尾0

|Manipulator|	含义|
|:--|:--|
|`std::fixed`	| 使用十进制记数法
|`std::scientific`	|使用科学计数法
|`std::showpoint`	|对于浮点值，始终显示小数点和末尾0
|`std::noshowpoint` |对于浮点值，不显示小数点和末尾0
|`std::setprecision(int)`	|为浮点数设置精度(定义在 `iomanip` 头文件中)


|成员函数|含义|
|:--|:--|
|`std::ios_base::precision()`	|返回当前浮点数的精度
|`std::ios_base::precision(int)`	|设置浮点数精度并返回之前的精度

如果使用固定记数法或科学记数法，则精度决定分数中显示的小数点后多少位。注意，如果精度小于有效位数，则数字将四舍五入。


```cpp
std::cout << std::fixed << '\n';
std::cout << std::setprecision(3) << 123.456 << '\n';
std::cout << std::setprecision(4) << 123.456 << '\n';
std::cout << std::setprecision(5) << 123.456 << '\n';
std::cout << std::setprecision(6) << 123.456 << '\n';
std::cout << std::setprecision(7) << 123.456 << '\n';

std::cout << std::scientific << '\n';
std::cout << std::setprecision(3) << 123.456 << '\n';
std::cout << std::setprecision(4) << 123.456 << '\n';
std::cout << std::setprecision(5) << 123.456 << '\n';
std::cout << std::setprecision(6) << 123.456 << '\n';
std::cout << std::setprecision(7) << 123.456 << '\n';
```

打印：

```bash
123.456
123.4560
123.45600
123.456000
123.4560000

1.235e+002
1.2346e+002
1.23456e+002
1.234560e+002
1.2345600e+002
```

如果既不使用固定计数法也不使用科学计数法，则精度决定了应该显示多少有效数字。同样，如果精度小于有效位数，则数字将四舍五入。

```cpp
std::cout << std::setprecision(3) << 123.456 << '\n';
std::cout << std::setprecision(4) << 123.456 << '\n';
std::cout << std::setprecision(5) << 123.456 << '\n';
std::cout << std::setprecision(6) << 123.456 << '\n';
std::cout << std::setprecision(7) << 123.456 << '\n';
```

打印结果：

```bash
123
123.5
123.46
123.456
123.456
```

使用 `showpoint` manipulator 或标记，可以打印小数点和末尾0。

```cpp
std::cout << std::showpoint << '\n';
std::cout << std::setprecision(3) << 123.456 << '\n';
std::cout << std::setprecision(4) << 123.456 << '\n';
std::cout << std::setprecision(5) << 123.456 << '\n';
std::cout << std::setprecision(6) << 123.456 << '\n';
std::cout << std::setprecision(7) << 123.456 << '\n';
```

运行结果如下：

```bash
123.
123.5
123.46
123.456
123.4560
```

下面是一个有更多例子的汇总表:

```bash
Option	Precision	12345.0	0.12345
Normal	3	1.23e+004	0.123
4	1.235e+004	0.1235
5	12345	0.12345
6	12345	0.12345
Showpoint	3	1.23e+004	0.123
4	1.235e+004	0.1235
5	12345.	0.12345
6	12345.0	0.123450
Fixed	3	12345.000	0.123
4	12345.0000	0.1235
5	12345.00000	0.12345
6	12345.000000	0.123450
Scientific	3	1.235e+004	1.235e-001
4	1.2345e+004	1.2345e-001
5	1.23450e+004	1.23450e-001
6	1.234500e+004	1.234500e-001
```

## 宽度、填充字符和对齐

通常，当我们打印数字时是不考虑其周围的空间的。不过，我们的确可以让数字向左或向右对其。为此，我们必须首先定义一个字段宽度——即输出空间的大小。如果实际打印的数字小于字段宽度，它将被左对齐或右对齐(根据指定)。如果实际数字大于字段宽度，它并不会被截断——而是会溢出。

|Group	|Flag	|Meaning|
|:--|:--|:--|
|`std::ios::adjustfield`	|`std::ios::internal`	|Left-justifies the sign of the number, and right-justifies the value
|`std::ios::adjustfield`	|`std::ios::left`	|Left-justifies the sign and value
|`std::ios::adjustfield`	|`std::ios::right`	|Right-justifies the sign and value (default)

|Manipulator	|Meaning|
|:--|:--|
|`std::internal`	|Left-justifies the sign of the number, and right-justifies the value
|`std::left`	|Left-justifies the sign and value
|`std::right`	|Right-justifies the sign and value
|`std::setfill(char)`	|Sets the parameter as the fill character (defined in the iomanip header)
|`std::setw(int)`	|Sets the field width for input and output to the parameter (defined in the iomanip header)

|Member function	|Meaning|
|:--|:--|
|`std::basic_ostream::fill()`	|Returns the current fill character
|`std::basic_ostream::fill(char)`	|Sets the fill character and returns the old fill character
|`std::ios_base::width()`	|Returns the current field width
|`std::ios_base::width(int)`	|Sets the current field width and returns old field width


为了使用这些格式化操作，我们必须先设置宽度。设置宽度可以通过 `width(int)` 成员函数来完成，或者通过 `setw()` manipulator。注意，默认情况下是右对齐的。

```cpp
std::cout << -12345 << '\n'; // print default value with no field width
std::cout << std::setw(10) << -12345 << '\n'; // print default with field width
std::cout << std::setw(10) << std::left << -12345 << '\n'; // print left justified
std::cout << std::setw(10) << std::right << -12345 << '\n'; // print right justified
std::cout << std::setw(10) << std::internal << -12345 << '\n'; // print internally justified
```

运行结果为：

```bash
-12345
    -12345
-12345
    -12345
-    12345
```


==注意，`setw()` 和 `width()` 只对下一个输出语句有效，和其他的标记或manipulators不同，它们不是持久化的。==

接下来，让我们设置一个填充字符并进行类似的操作：

```cpp
std::cout.fill('*');
std::cout << -12345 << '\n'; // print default value with no field width
std::cout << std::setw(10) << -12345 << '\n'; // print default with field width
std::cout << std::setw(10) << std::left << -12345 << '\n'; // print left justified
std::cout << std::setw(10) << std::right << -12345 << '\n'; // print right justified
std::cout << std::setw(10) << std::internal << -12345 << '\n'; // print internally justified
```

输出结果：

```bash
-12345
****-12345
-12345****
****-12345
-****12345
```

注意，之前的空格被填充字符所替代了。

`ostream` 类和 `iostream` 库还提供了其他有用的输出函数、标记和 manipulators。和 `istream` 类一样，这些议题更适合放在专注于标准库的教程或书中(例如Nicolai M. Josuttis的[“c++标准库”](https://www.amazon.com/Standard-Library-Tutorial-Reference-2nd/dp/0321623215))。
