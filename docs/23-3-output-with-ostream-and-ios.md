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

??? note "关键点速记"

	- 更改格式化的方式有两种，标记和manipulators。标记你可以将其看做是可以开关的布尔量。而manipulators则是放置在流中，可以修改输入输出的对象 。
	- `setf()`和`unsetf()`分别用于设置和关闭标记
	- 许多标志属于组，称为格式组。[[format-group|格式组]]是一组执行类似(有时互斥)格式化选项的标志，此时可以使用两个参数版本的`setf()`，并通过第二个参数指明组。此时组内其他标记会被自动关闭。


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

```
+27
```

我们也可以利用[[bitwise-or|按位或]]操作一次性打开多个 `ios` 标记 ：

```cpp
std::cout.setf(std::ios::showpos | std::ios::uppercase); // 打开 std::ios::showpos 和 std::ios::uppercase 标记
std::cout << 1234567.89f << '\n';
```

输出结果：

```
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

```
+27
28
```

在使用`setf()`时还有一个需要提及的小技巧。==许多标志属于组，称为格式组。[[format-group|格式组]]是一组执行类似(有时互斥)格式化选项的标志==。例如，名为“basefield”的格式组包含标志“oct”、“dec”和“hex”，它们控制整数值的基数。默认情况下，设置了“dec”标志。因此，如果我们这样做:

```cpp
std::cout.setf(std::ios::hex); // 尝试启动十六进制输出
std::cout << 27 << '\n';
```

则输出结果为：

```
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

```
1b
```

第二种方法是使用另一个版本的 `setf()` ，它有两个形参，第二个参数指明标记所属的[[format-group|格式组]]。当使用这个版本的 `setf()` 时，同组的其他标记都会被自动关闭，只有我们设置的标记会被打开。例如：

```cpp
// Turn on std::ios::hex as the only std::ios::basefield flag
std::cout.setf(std::ios::hex, std::ios::basefield);
std::cout << 27 << '\n';
```

输出结果仍然符合预期：

```
1b
```

使用 `setf()` 和 `unsetf()` 是有点别扭的，因此C++提供了第二种方法来改变格式化选项：manipulators. The nice thing about manipulators is that they are smart enough to turn on and off the appropriate flags. Here is an example of using some manipulators to change the base:

```cpp
std::cout << std::hex << 27 << '\n'; // print 27 in hex
std::cout << 28 << '\n'; // we're still in hex
std::cout << std::dec << 29 << '\n'; // back to decimal
```

COPY

This program produces the output:

```
1b
1c
29
```

In general, using manipulators is much easier than setting and unsetting flags. Many options are available via both flags and manipulators (such as changing the base), however, other options are only available via flags or via manipulators, so it’s important to know how to use both.

## Useful formatters**

Here is a list of some of the more useful flags, manipulators, and member functions. Flags live in the std::ios class, manipulators live in the std namespace, and the member functions live in the std::ostream class.


Group	Flag	Meaning
`std::ios::boolalpha`	If set, booleans print “true” or “false”. If not set, booleans print 0 or 1


Manipulator	Meaning
`std::boolalpha`	Booleans print “true” or “false”
`std::noboolalpha`	Booleans print 0 or 1 (default)


Example:

```cpp
std::cout << true << ' ' << false << '\n';

std::cout.setf(std::ios::boolalpha);
std::cout << true << ' ' << false << '\n';

std::cout << std::noboolalpha << true << ' ' << false << '\n';

std::cout << std::boolalpha << true << ' ' << false << '\n';
```

COPY

Result:

```
1 0
true false
1 0
true false
```


Group	Flag	Meaning
`std::ios::showpos`	If set, prefix positive numbers with a +



Manipulator	Meaning
`std::showpos`	Prefixes positive numbers with a +
`std::noshowpos`	Doesn’t prefix positive numbers with a +

Example:

```cpp
std::cout << 5 << '\n';

std::cout.setf(std::ios::showpos);
std::cout << 5 << '\n';

std::cout << std::noshowpos << 5 << '\n';

std::cout << std::showpos << 5 << '\n';
```

COPY

Result:

```
5
+5
5
+5
```

Group	Flag	Meaning
`std::ios::uppercase`	If set, uses upper case letters

Meaning
`std::uppercase`	Uses upper case letters
`std::nouppercase`	Uses lower case letters


Example:

```cpp
std::cout << 12345678.9 << '\n';

std::cout.setf(std::ios::uppercase);
std::cout << 12345678.9 << '\n';

std::cout << std::nouppercase << 12345678.9 << '\n';

std::cout << std::uppercase << 12345678.9 << '\n';
```

COPY

Result:

```
1.23457e+007
1.23457E+007
1.23457e+007
1.23457E+007
```

Group	Flag	Meaning
`std::ios::basefield`	`std::ios::dec`	Prints values in decimal (default)
`std::ios::basefield`	`std::ios::hex`	Prints values in hexadecimal
`std::ios::basefield`	`std::ios::oct`	Prints values in octal
`std::ios::basefield`	(none)	                    Prints values according to leading characters of value


Manipulator	Meaning
`std::dec`	Prints values in decimal
`std::hex`	Prints values in hexadecimal
`std::oct`	Prints values in octal


Example:

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

```
27
27
33
1b
27
33
1b
```
By now, you should be able to see the relationship between setting formatting via flag and via manipulators. In future examples, we will use manipulators unless they are not available.

Precision, notation, and decimal points

Using manipulators (or flags), it is possible to change the precision and format with which floating point numbers are displayed. There are several formatting options that combine in somewhat complex ways, so we will take a closer look at this.


Group	Flag	Meaning
std::ios::floatfield	std::ios::fixed	Uses decimal notation for floating-point numbers
std::ios::floatfield	std::ios::scientific	Uses scientific notation for floating-point numbers
std::ios::floatfield	(none)	Uses fixed for numbers with few digits, scientific otherwise
std::ios::floatfield	std::ios::showpoint	Always show a decimal point and trailing 0’s for floating-point values

Manipulator	Meaning
std::fixed	Use decimal notation for values
std::scientific	Use scientific notation for values
std::showpoint	Show a decimal point and trailing 0’s for floating-point values
std::noshowpoint	Don’t show a decimal point and trailing 0’s for floating-point values
std::setprecision(int)	Sets the precision of floating-point numbers (defined in the iomanip header)


Member function	Meaning
std::ios_base::precision()	Returns the current precision of floating-point numbers
std::ios_base::precision(int)	Sets the precision of floating-point numbers and returns old precision


If fixed or scientific notation is used, precision determines how many decimal places in the fraction is displayed. Note that if the precision is less than the number of significant digits, the number will be rounded.

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

COPY

Produces the result:

```
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

If neither fixed nor scientific are being used, precision determines how many significant digits should be displayed. Again, if the precision is less than the number of significant digits, the number will be rounded.

```cpp
std::cout << std::setprecision(3) << 123.456 << '\n';
std::cout << std::setprecision(4) << 123.456 << '\n';
std::cout << std::setprecision(5) << 123.456 << '\n';
std::cout << std::setprecision(6) << 123.456 << '\n';
std::cout << std::setprecision(7) << 123.456 << '\n';
```

COPY

Produces the following result:

```
123
123.5
123.46
123.456
123.456
```

Using the showpoint manipulator or flag, you can make the stream write a decimal point and trailing zeros.

```cpp
std::cout << std::showpoint << '\n';
std::cout << std::setprecision(3) << 123.456 << '\n';
std::cout << std::setprecision(4) << 123.456 << '\n';
std::cout << std::setprecision(5) << 123.456 << '\n';
std::cout << std::setprecision(6) << 123.456 << '\n';
std::cout << std::setprecision(7) << 123.456 << '\n';
```

COPY

Produces the following result:

```
123.
123.5
123.46
123.456
123.4560
```
Here’s a summary table with some more examples:


```
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
**Width, fill characters, and justification**

Typically when you print numbers, the numbers are printed without any regard to the space around them. However, it is possible to left or right justify the printing of numbers. In order to do this, we have to first define a field width, which defines the number of output spaces a value will have. If the actual number printed is smaller than the field width, it will be left or right justified (as specified). If the actual number is larger than the field width, it will not be truncated -- it will overflow the field.


Group	Flag	Meaning
`std::ios::adjustfield`	`std::ios::internal`	Left-justifies the sign of the number, and right-justifies the value
`std::ios::adjustfield`	`std::ios::left`	Left-justifies the sign and value
`std::ios::adjustfield`	`std::ios::right`	Right-justifies the sign and value (default)

Manipulator	Meaning
`std::internal`	Left-justifies the sign of the number, and right-justifies the value
`std::left`	Left-justifies the sign and value
`std::right`	Right-justifies the sign and value
`std::setfill(char)`	Sets the parameter as the fill character (defined in the iomanip header)
`std::setw(int)`	Sets the field width for input and output to the parameter (defined in the iomanip header)

Member function	Meaning
`std::basic_ostream::fill()`	Returns the current fill character
`std::basic_ostream::fill(char)`	Sets the fill character and returns the old fill character
`std::ios_base::width()`	Returns the current field width
`std::ios_base::width(int)`	Sets the current field width and returns old field width


In order to use any of these formatters, we first have to set a field width. This can be done via the `width(int)` member function, or the `setw()` manipulator. Note that right justification is the default.

```cpp
std::cout << -12345 << '\n'; // print default value with no field width
std::cout << std::setw(10) << -12345 << '\n'; // print default with field width
std::cout << std::setw(10) << std::left << -12345 << '\n'; // print left justified
std::cout << std::setw(10) << std::right << -12345 << '\n'; // print right justified
std::cout << std::setw(10) << std::internal << -12345 << '\n'; // print internally justified
```

COPY

This produces the result:

```
-12345
****-12345
-12345****
****-12345
-****12345
```


One thing to note is that setw() and width() only affect the next output statement. They are not persistent like some other flags/manipulators.

Now, let’s set a fill character and do the same example:

```cpp
std::cout.fill('*');
std::cout << -12345 << '\n'; // print default value with no field width
std::cout << std::setw(10) << -12345 << '\n'; // print default with field width
std::cout << std::setw(10) << std::left << -12345 << '\n'; // print left justified
std::cout << std::setw(10) << std::right << -12345 << '\n'; // print right justified
std::cout << std::setw(10) << std::internal << -12345 << '\n'; // print internally justified
```

COPY

This produces the output:

```
-12345
****-12345
-12345****
****-12345
-****12345
```
Note that all the blank spaces in the field have been filled up with the fill character.

The ostream class and iostream library contain other output functions, flags, and manipulators that may be useful, depending on what you need to do. As with the istream class, those topics are really more suited for a tutorial or book focusing on the standard library (such as the excellent book “The C++ Standard Template Library” by Nicolai M. Josuttis).
